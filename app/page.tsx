import { AnimatedText } from "@/components/ui/animated-text";
import AnimationWrapper from "@/components/ui/animation-wrapper";
import { Logo } from "@/components/ui/logo";
import ThemeToggle from "@/components/ui/my-theme-toggle";
import { Separator } from "@/components/ui/separator";
import MenuElements from "@/lib/menu-elements";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Luigi Bruno Fotografo - Jupiter Fotoproduzioni | Matrimoni e Eventi Basilicata",
  description:
    "Luigi Bruno di Jupiter Fotoproduzioni, fotografo professionista specializzato in matrimoni e eventi a Potenza, Satriano di Lucania e Basilicata. Servizi fotografici di alta qualità, book matrimoniali, reportage eventi aziendali e ritratti artistici. Portfolio fotografico professionale per catturare i tuoi momenti più preziosi con stile ed eleganza.",
  keywords: [
    "Luigi Bruno fotografo",
    "Jupiter Fotoproduzioni",
    "fotografo matrimoni Basilicata",
    "fotografo Potenza",
    "fotografo Satriano di Lucania",
    "matrimoni Basilicata",
    "eventi Basilicata",
    "servizi fotografici Potenza",
    "book matrimoniali Basilicata",
    "fotografo professionista Basilicata",
    "reportage matrimoniali",
    "fotografia eventi aziendali",
    "ritratti artistici Potenza",
    "studio fotografico Basilicata",
    "fotografia matrimonio Matera",
    "cerimonie religiose Basilicata",
    "ricevimenti matrimoniali",
    "Jupiter Foto",
    "Luigi Bruno Jupiter",
    "fotoproduzioni Basilicata",
    "fotografo wedding Basilicata",
    "fotografia sposi Potenza",
    "album matrimoniali personalizzati",
    "servizio fotografico pre-matrimonio",
    "engagement shoot Basilicata",
  ],
  authors: [{ name: "Luigi Bruno", url: "https://jupiterfoto.it" }],
  creator: "Luigi Bruno - Jupiter Fotoproduzioni",
  publisher: "Jupiter Fotoproduzioni",
  openGraph: {
    title:
      "Luigi Bruno Fotografo - Jupiter Fotoproduzioni | Matrimoni e Eventi Basilicata",
    description:
      "Scopri il portfolio di Luigi Bruno di Jupiter Fotoproduzioni, fotografo specializzato in matrimoni e eventi. Servizi fotografici professionali a Potenza, Satriano di Lucania e tutta la Basilicata. Book matrimoniali, reportage eventi e ritratti artistici di alta qualità.",
    type: "website",
    locale: "it_IT",
    siteName: "Jupiter Fotoproduzioni - Luigi Bruno Fotografo",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Luigi Bruno Fotografo - Jupiter Fotoproduzioni | Matrimoni Basilicata",
    description:
      "Jupiter Fotoproduzioni - Luigi Bruno, fotografo professionista specializzato in matrimoni e eventi a Potenza e Basilicata. Portfolio fotografico di alta qualità.",
  },
  alternates: {
    canonical: "https://jupiterfoto.it",
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
};

export default function Home() {
  return (
    <AnimationWrapper>
      <div className="flex relative isolate items-center justify-center h-[calc(100vh-180px)] sm:h-[calc(100vh-160px)] align-middle px-4 sm:px-5">
        <div className="text-center select-none">
          <div className="inline-block mb-2 sm:mb-3">
            <Logo className="h-24 sm:h-32 md:h-36 lg:h-44 w-auto" animate />
          </div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl select-none sr-only">
            <AnimatedText
              text=" Jupiter"
              once
              className="text-5xl font-bold tracking-tight sm:text-6xl select-none"
            />
          </h1>
          <p className="mt-3 sm:mt-6 text-sm md:text-md leading-5 sm:leading-6 md:leading-8 text-muted-foreground select-none">
            Fotografo Professionista
          </p>
          <blockquote>
            <AnimatedText
              className="mt-3 sm:mt-6 text-sm sm:text-md md:text-xl font-bold md:font-normal underline-offset-4 leading-6 sm:leading-8 select-none"
              once
              text="Catturando emozioni autentiche attraverso l'obiettivo."
            />
          </blockquote>
          <p className="my-3 sm:my-6 mb-6 sm:mb-12 text-sm md:leading-8 text-muted-foreground select-none">
            Matrimoni • Eventi • Ritratti in Basilicata
          </p>
          <Separator />
          <div className="pt-6 sm:pt-12 text-xs md:text-normal mb-3 sm:mb-5 lg:hidden opacity-60 select-none">
            <MenuElements className="md:p-5" />
          </div>
          <ThemeToggle className="test lg:hidden opacity-60" />
        </div>
      </div>
    </AnimationWrapper>
  );
}
