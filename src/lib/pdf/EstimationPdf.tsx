import React from "react"
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image
} from "@react-pdf/renderer"
import { siteTypes } from "@/app/estimation/estimationData"

export type Props = {
    type: string
    options: string[]
    email: string
    commentaires?: string
}


const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#ffffff",
        padding: 30,
        fontFamily: "Helvetica",
        fontSize: 11,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: "#FA541C",
    },
    logo: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1f2937",
    },
    imgLogo: {
        width: "24px",
        height: "24px",
        aspectRatio: 1
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FA541C",
        textAlign: "center",
        marginBottom: 25,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#374151",
        marginBottom: 10,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    infoBox: {
        padding: 15,
        backgroundColor: "#f8fafc",
        borderRadius: 5,
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#6b7280",
        width: "30%",
    },
    infoValue: {
        fontSize: 11,
        color: "#374151",
        width: "70%",
    },
    // Styles pour le "tableau" avec flexbox
    tableContainer: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 5,
        overflow: "hidden",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#FA541C",
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    tableHeaderText: {
        color: "#ffffff",
        fontSize: 11,
        fontWeight: "bold",
        textAlign: "center",
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    tableRowEven: {
        backgroundColor: "#f8fafc",
    },
    tableCell: {
        fontSize: 10,
        color: "#374151",
        paddingHorizontal: 5,
    },
    tableCellCenter: {
        textAlign: "center",
    },
    tableCellRight: {
        textAlign: "right",
    },
    // Colonnes du tableau
    col1: { width: "75%" }, // Description
    col2: { width: "25%", textAlign: "right" }, // Quantité
    // Résumé financier
    summaryContainer: {
        alignItems: "flex-end",
        marginTop: 20,
    },
    summaryBox: {
        width: "40%",
        padding: 15,
        backgroundColor: "#eff6ff",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#FA541C",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    summaryLabel: {
        fontSize: 11,
        color: "#374151",
    },
    summaryValue: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#374151",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#FA541C",
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#1f2937",
    },
    totalValue: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#FA541C",
    },
    commentsBox: {
        padding: 15,
        backgroundColor: "#fefce8",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#eab308",
        marginTop: 15,
    },
    commentsTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#a16207",
        marginBottom: 8,
    },
    commentsText: {
        fontSize: 10,
        color: "#a16207",
        lineHeight: 1.4,
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: "center",
        fontSize: 9,
        color: "#6b7280",
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
    },
})
export function EstimationPdf({ type, options, email, commentaires = "" }: Props) {
    const now = new Date().toLocaleDateString("fr-FR");
    const future = new Date(now)
    future.setUTCDate(future.getDay() + 90)
    const validUntil = future.toLocaleDateString("fr-FR");
    const activeSiteType = siteTypes.find((site) => site.slug === type);
    const activeOptions = activeSiteType?.options.filter((opt) =>
        !!options.find(slctOpt => opt.slug === slctOpt)
    );
    const totalPrice = () => {
        let total = activeSiteType?.basePrice || 0;
        activeOptions?.forEach(({ price }) => total += price)
        return total
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* En-tête */}
                <View style={styles.header}>
                    <View style={{ display: "flex", gap: "4px", alignItems: "center", flexDirection: "row" }}>
                        <Image style={styles.imgLogo} src={`https://occitaweb.fr/trademark/icon-dark.png`} />
                        <Text style={styles.logo}>Occitaweb</Text>
                    </View>
                    <Text style={{ fontSize: 11, color: "#6b7280" }}>
                        Devis N° DEV-{new Date().getFullYear()}-{String(Date.now()).slice(-4)}
                    </Text>
                </View>

                {/* Titre */}
                <Text style={styles.title}>ESTIMATION DÉVELOPPEMENT WEB</Text>

                {/* Informations du projet */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>INFORMATIONS DU PROJET</Text>
                    <View style={styles.infoBox}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Type de site :</Text>
                            <Text style={styles.infoValue}>{activeSiteType?.name}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Votre courriel :</Text>
                            <Text style={styles.infoValue}>{email}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Date du devis :</Text>
                            <Text style={styles.infoValue}>{new Date().toLocaleDateString("fr-FR")}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Validité :</Text>
                            <Text style={styles.infoValue}>{validUntil}</Text>
                        </View>
                    </View>
                </View>

                {/* Détail des prestations */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DÉTAIL DES PRESTATIONS</Text>

                    <View style={styles.tableContainer}>
                        {/* En-tête du tableau */}
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderText, styles.col1]}>Description</Text>
                            <Text style={[styles.tableHeaderText, styles.col2]}>Prix</Text>
                        </View>

                        {/* Ligne du site de base */}
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.col1]}>Développement {(type)}</Text>
                            <Text style={[styles.tableCell, styles.col2, styles.tableCellRight]}>{activeSiteType?.basePrice.toFixed(2)} €</Text>
                        </View>

                        {/* Lignes des options */}
                        {activeOptions?.map((option, index) => (
                            <View key={option.slug} style={[styles.tableRow, ...(index % 2 === 0 ? [styles.tableRowEven] : [])]}>
                                <Text style={[styles.tableCell, styles.col1]}>{option.name}</Text>
                                <Text style={[styles.tableCell, styles.col2, styles.tableCellRight]}>{option.price.toFixed(2)} €</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Résumé financier */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryBox}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Sous-total HT :</Text>
                            <Text style={styles.summaryValue}>{totalPrice().toFixed(2)} €</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>TVA (20%) :</Text>
                            <Text style={styles.summaryValue}>{(totalPrice() * 0.2).toFixed(2)} €</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>TOTAL TTC :</Text>
                            <Text style={styles.totalValue}>{(totalPrice() * 1.2).toFixed(2)} €</Text>
                        </View>
                    </View>
                </View>

                {/* Commentaires du client */}
                <View style={styles.commentsBox}>
                    <Text style={styles.commentsTitle}>COMMENTAIRES</Text>
                    <Text style={styles.commentsText}>{commentaires || "Aucun commentaires"}</Text>
                </View>

                {/* Pied de page */}
                <Text style={styles.footer}>
                    Devis généré automatiquement le {new Date().toLocaleDateString("fr-FR")} à{" "}
                    {new Date().toLocaleTimeString("fr-FR")}
                    {"\n"}Conditions : Acompte de 30% à la commande - Solde à la livraison - Délai : 4 à 8 semaines
                </Text>
            </Page>
        </Document>)
}

