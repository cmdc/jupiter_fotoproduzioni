import { AnimatedText } from "@/components/ui/animated-text";
import AnimationWrapper from "@/components/ui/animation-wrapper";
import { Logo } from "@/components/ui/logo";
import ThemeToggle from "@/components/ui/my-theme-toggle";
import { Separator } from "@/components/ui/separator";
import MenuElements from "@/lib/menu-elements";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luigi Bruno Fotografo - Matrimoni e Eventi Basilicata",
  description:
    "Luigi Bruno, fotografo professionista specializzato in matrimoni e eventi a Potenza, Satriano di Lucania e Basilicata. Portfolio fotografico e servizi per catturare i tuoi momenti più preziosi.",
  openGraph: {
    title: "Luigi Bruno Fotografo - Matrimoni e Eventi in Basilicata",
    description:
      "Scopri il portfolio di Luigi Bruno, fotografo specializzato in matrimoni e eventi. Servizi fotografici professionali a Potenza, Satriano di Lucania e tutta la Basilicata.",
  },
};

export default function Home() {
  return (
    <AnimationWrapper>
      <div className="flex relative isolate items-center justify-center h-[calc(100vh-160px)] align-middle px-5">
        <div className="text-center select-none">
          <div className="inline-block mb-3">
            <Logo className="h-32 lg:h-44 w-auto" animate />
          </div>
          {/* <h1 className="text-5xl font-bold tracking-tight sm:text-6xl select-none">
            <AnimatedText
              text=" Jupiter"
              once
              className="text-5xl font-bold tracking-tight sm:text-6xl select-none"
            />
          </h1> */}
          <p className="mt-6 text-sm  md:text-md leading-6 md:leading-8 text-muted-foreground select-none">
            Fotografo Professionista
          </p>
          <blockquote>
            <AnimatedText
              className="mt-6 text-md md:text-xl font-bold md:font-normal  underline-offset-4	 leading-8 select-none"
              once
              text="Catturando emozioni autentiche attraverso l'obiettivo."
            />
          </blockquote>
          <p className="my-6 mb-12 text-sm md:leading-8 text-muted-foreground select-none">
            Matrimoni • Eventi • Ritratti in Basilicata
          </p>
          <Separator />
          <div className="pt-12 text-xs md:text-normal mb-5 lg:hidden opacity-60 select-none">
            <MenuElements className="md:p-5" />
          </div>
          <ThemeToggle className="test lg:hidden opacity-60" />
        </div>
      </div>
    </AnimationWrapper>
  );
}
