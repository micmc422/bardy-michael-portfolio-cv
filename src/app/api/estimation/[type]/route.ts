import { PdfReadleStream } from "@/lib/pdf/renderBuffer"
import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

const OWNER_EMAIL = "contact@occitaweb.fr"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ type: string }> }
) {
    try {
        const { type } = await params
        const { searchParams } = new URL(req.url)
        const options = searchParams.getAll("options")

        const body = await req.json()
        const { email, commentaires } = body;
        const pdfBuffer = await PdfReadleStream({ type, options, email, commentaires })
        const buffer = Buffer.from(pdfBuffer)

        const res = await transporter.sendMail({
            from: OWNER_EMAIL,
            to: [OWNER_EMAIL, email],
            subject: "Résumé de votre estimation",
            text: `Veuillez trouver ci-joint le résumé de votre demande.`,
            attachments: [
                {
                    filename: "estimation.pdf",
                    content: buffer,
                    contentType: "application/pdf",
                },
            ],
        })
        if (res.rejected) throw new Error("Envoi de l'email rejeté !")
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
