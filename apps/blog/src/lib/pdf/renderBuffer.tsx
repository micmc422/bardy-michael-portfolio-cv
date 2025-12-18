"use server"

import { renderToBuffer } from "@react-pdf/renderer"
import { EstimationPdf, type Props } from "./EstimationPdf"

export async function PdfReadleStream({ type, options, email, commentaires = "" }: Props) {

    return await renderToBuffer(<EstimationPdf type={type} options={options} email={email} commentaires={commentaires} />)
}
