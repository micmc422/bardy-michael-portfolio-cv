import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyse de Site Web | Michaël Bardy",
  description:
    "Analysez gratuitement votre site web : performance, SEO, sécurité, accessibilité et compatibilité mobile.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
