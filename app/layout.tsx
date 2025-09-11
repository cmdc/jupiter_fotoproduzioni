import "./globals.css";
import type { Metadata } from "next";
import { Courier_Prime } from "next/font/google";
//import localFont from "next/font/local";
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
  style: ["normal", "italic"]
});
// const courierFont = localFont({
//   src: [
//     {
//       path: '../public/fonts/courier-normal.ttf',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: '../public/fonts/courier-italic.ttf',
//       weight: '400',
//       style: 'italic',
//     },
//     {
//       path: '../public/fonts/courier-bold.ttf',
//       weight: '700',
//       style: 'normal',
//     },
//     {
//       path: '../public/fonts/courier-bolditalic.ttf',
//       weight: '700',
//       style: 'italic',
//     },
//   ],
//   variable: '--font-courier',
// });

export const metadata: Metadata = {
  title: {
    template: "Luigi Bruno Fotografo | %s",
    default: "Luigi Bruno Fotografo - Matrimoni e Eventi in Basilicata",
  },
  description: "Luigi Bruno, fotografo professionista specializzato in matrimoni e eventi a Potenza, Satriano di Lucania e tutta la Basilicata. Servizi fotografici di alta qualità per i tuoi momenti speciali.",
  keywords: [
    "fotografo matrimoni Basilicata",
    "fotografo Potenza",
    "fotografo eventi Satriano di Lucania", 
    "Luigi Bruno fotografo",
    "matrimoni Basilicata",
    "servizi fotografici Potenza",
    "fotografo professionista",
    "eventi speciali Basilicata"
  ],
  authors: [{ name: "Luigi Bruno" }],
  creator: "Luigi Bruno",
  publisher: "Jupiter Foto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jupiterfoto.it'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Luigi Bruno Fotografo - Matrimoni e Eventi in Basilicata",
    description: "Fotografo professionista specializzato in matrimoni e eventi a Potenza e Satriano di Lucania. Cattura i tuoi momenti più preziosi con stile e professionalità.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://jupiterfoto.it',
    siteName: "Luigi Bruno Fotografo",
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Luigi Bruno Fotografo - Matrimoni e Eventi in Basilicata',
      },
    ],
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Luigi Bruno Fotografo - Matrimoni e Eventi in Basilicata",
    description: "Fotografo professionista specializzato in matrimoni e eventi a Potenza e Satriano di Lucania.",
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
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

          <div className="text-center bottom-3 text-xs md:text-normal left-0 opacity-60 right-0 m-auto w-5/6 md:w-1/2  scroll-m-20 p-5 pt-10 text-md  tracking-tight transition-colors first:mt-0 select-none flex flex-col items-center lg:justify-center">
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
      {/* {modal} */}
    </html>
  );
};

export default RootLayout;
