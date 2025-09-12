import "./globals.css";
import type { Metadata } from "next";
import { Courier_Prime } from "next/font/google";
import type { ReactNode, FC } from "react";
import Menu from "@/components/ui/menu";
import { Particles } from "@/components/particles";
import { Providers } from "@/lib/providers";
import GoogleAnalytics from "./GoogleAnalytics";
import Link from "next/link";
import { CookieConsentBanner } from "@/components/ui/cookie-consent-banner";
import { StructuredData } from "@/components/structured-data";

const courierFont = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    template: "Jupiter Fotoproduzioni - Luigi Bruno | %s",
    default:
      "Luigi Bruno Fotografo - Jupiter Fotoproduzioni | Matrimoni e Eventi Basilicata",
  },
  description:
    "Jupiter Fotoproduzioni di Luigi Bruno, fotografo professionista specializzato in matrimoni e eventi a Potenza, Satriano di Lucania e tutta la Basilicata. Servizi fotografici di alta qualità, book matrimoniali esclusivi, reportage eventi aziendali e ritratti artistici. Studio fotografico professionale per matrimoni, cerimonie religiose, ricevimenti e servizi pre-matrimoniali in Basilicata e Sud Italia.",
  keywords: [
    "Jupiter Fotoproduzioni",
    "Luigi Bruno fotografo",
    "fotografo matrimoni Basilicata",
    "fotografo Potenza",
    "fotografo eventi Satriano di Lucania",
    "matrimoni Basilicata",
    "servizi fotografici Potenza",
    "fotografo professionista Basilicata",
    "eventi speciali Basilicata",
    "Jupiter Foto",
    "Luigi Bruno Jupiter",
    "studio fotografico Basilicata",
    "book matrimoniali esclusivi",
    "reportage matrimoniali Basilicata",
    "fotografia eventi aziendali Potenza",
    "ritratti artistici professionali",
    "cerimonie religiose Basilicata",
    "ricevimenti matrimoniali",
    "servizio fotografico pre-matrimonio",
    "engagement photography Basilicata",
    "fotografia matrimonio Matera",
    "wedding photographer Basilicata",
    "fotografo sposi Potenza",
    "album matrimoniali personalizzati",
    "fotoproduzioni Sud Italia",
    "fotografo cerimonie Basilicata",
    "servizio fotografico matrimonio completo",
    "fotografia professionale eventi",
    "studio Jupiter Fotoproduzioni",
    "Luigi Bruno wedding photographer",
  ],
  authors: [{ name: "Luigi Bruno", url: "https://jupiterfoto.it" }],
  creator: "Luigi Bruno - Jupiter Fotoproduzioni",
  publisher: "Jupiter Fotoproduzioni",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://jupiterfoto.it"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Jupiter Fotoproduzioni - Luigi Bruno Fotografo | Matrimoni e Eventi Basilicata",
    description:
      "Jupiter Fotoproduzioni, studio fotografico professionale di Luigi Bruno specializzato in matrimoni e eventi a Potenza, Satriano di Lucania e Basilicata. Book matrimoniali esclusivi, reportage eventi aziendali e servizi fotografici di alta qualità. Cattura i tuoi momenti più preziosi con stile, eleganza e professionalità.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://jupiterfoto.it",
    siteName: "Jupiter Fotoproduzioni - Luigi Bruno Fotografo",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Luigi Bruno Fotografo - Matrimoni e Eventi in Basilicata",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Jupiter Fotoproduzioni - Luigi Bruno | Fotografo Matrimoni Basilicata",
    description:
      "Jupiter Fotoproduzioni - Luigi Bruno, fotografo professionista specializzato in matrimoni e eventi a Potenza, Satriano di Lucania e Basilicata. Book matrimoniali e servizi fotografici di alta qualità.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

interface RootLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}
const RootLayout: FC<RootLayoutProps> = ({ children, modal }) => {
  const year = new Date().getFullYear();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={courierFont.className}>
        <Providers>
          <Menu />
          <Particles className="absolute inset-0 -z-10" />
          {children}

          <div className="text-center bottom-2 -z-10 text-xs md:text-normal left-0 opacity-60 right-0 m-auto w-5/6 md:w-1/2 scroll-m-20 p-3 sm:p-5 pt-4 sm:pt-10 text-md tracking-tight transition-colors first:mt-0 select-none flex flex-col items-center lg:justify-center">
            <Link
              className="flex items-center gap-1 text-current text-sm"
              href="http://cmdc.it"
              title="CMDC homepage"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-default-600">powered by</span>
              <p className="text-[#74feff] dark:animate-pulse text-center font-semibold">
                cmdc
              </p>
            </Link>
            <span className="mt-2 text-sm text-center text-default-600">
              {`© ${year} copyright`}
            </span>
          </div>
          <CookieConsentBanner />
        </Providers>
        <StructuredData type="LocalBusiness" />
        <StructuredData type="WebSite" />
        <GoogleAnalytics />
      </body>
    </html>
  );
};

export default RootLayout;
