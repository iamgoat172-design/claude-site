import type { Metadata } from "next";
import { Spectral, Onest } from "next/font/google";
import "./globals.css";
import { company } from "@/lib/content";

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sk-dinastiya.com"),
  title: {
    default: "СК «Династия» — строительство домов в Санкт-Петербурге и Ленобласти",
    template: "%s — СК «Династия»",
  },
  description:
    "Строим частные дома из газобетона, кирпича, тёплой керамики и клееного бруса под ключ. Отдельный договор на каждый этап, гарантия 25 лет. Санкт-Петербург и Ленинградская область.",
  keywords: [
    "строительство домов",
    "дома под ключ",
    "газобетон",
    "клееный брус",
    "тёплая керамика",
    "фахверк",
    "Санкт-Петербург",
    "Ленинградская область",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: "СК «Династия» — дома, которые остаются в семье",
    description:
      "Частные дома под ключ из газобетона, кирпича, тёплой керамики и клееного бруса. Гарантия 25 лет.",
    siteName: "СК «Династия»",
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${spectral.variable} ${onest.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GeneralContractor",
              name: "СК «Династия»",
              description:
                "Строительство частных домов под ключ из газобетона, кирпича, тёплой керамики и клееного бруса.",
              telephone: company.phone,
              areaServed: "Санкт-Петербург и Ленинградская область",
              address: {
                "@type": "PostalAddress",
                streetAddress: company.address,
                addressLocality: "Санкт-Петербург",
                addressCountry: "RU",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
