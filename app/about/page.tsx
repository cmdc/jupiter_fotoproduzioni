import React, { Suspense } from "react";
import { Header } from "@/components/ui/header-on-page";
import Link from "next/link";
import { getAPhoto } from "@/utils/imagekit-fetches";
import AnimationWrapper from "@/components/ui/animation-wrapper";
import { ContactForm } from "@/components/ui/contact-form";
import { Separator } from "@/components/ui/separator";
import { ScrollToFormButton } from "@/components/ui/scroll-to-form-button";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi sono",
  description: "Luigi Bruno, fotografo professionista specializzato in matrimoni e eventi a Potenza e Satriano di Lucania. Scopri la mia storia e il mio approccio alla fotografia.",
  openGraph: {
    title: "Luigi Bruno - Chi sono | Fotografo Matrimoni Basilicata",
    description: "Conosci Luigi Bruno, fotografo specializzato in matrimoni e eventi in Basilicata. La mia passione per catturare emozioni autentiche e momenti unici.",
  },
};

type Props = {};

async function Page({}: Props) {
  let data;

  // Check if ImageKit credentials are configured
  if (
    !process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY === "your-imagekit-public-key"
  ) {
    data = null;
  } else {
    try {
      data = await getAPhoto("2Lk8gJFapmsaug9WrFV7jW");
    } catch (error) {
      console.warn("Failed to load photo for about page:", error);
      data = null;
    }
  }
  // About page should have my image and a short description of me with some links to my socials
  return (
    <AnimationWrapper>
      <Header
        title={"👋 Ciao, sono Luigi Bruno"}
        subtitle={"Fotografo professionista specializzato in matrimoni e eventi"}
        subtitle2={"Catturando emozioni autentiche a Potenza, Satriano di Lucania e tutta la Basilicata"}
        image={data || undefined}
      />

      <div className="flex justify-center gap-6 p-10">
        {/* Telefono */}
        <Link
          href="tel:+393200243217"
          className="flex flex-col items-center group"
          title="Chiama Luigi Bruno"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-primary"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xs text-center select-none">Telefono</span>
        </Link>

        {/* Email - scroll al form */}
        <ScrollToFormButton />

        {/* Mappa */}
        <Link
          href="https://maps.app.goo.gl/ph6BdZbU7Fpa8dLA6"
          className="flex flex-col items-center group"
          target="_blank"
          title="Visualizza su Google Maps"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-primary"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="10"
                r="3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xs text-center select-none">Mappa</span>
        </Link>

        {/* Instagram */}
        <Link
          href="https://www.instagram.com/brunol.35ml"
          className="flex flex-col items-center group"
          target="_blank"
          title="Seguimi su Instagram"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-primary"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="2"
                width="20"
                height="20"
                rx="5"
                ry="5"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="17.5"
                y1="6.5"
                x2="17.51"
                y2="6.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-xs text-center select-none">Instagram</span>
        </Link>

        {/* WhatsApp */}
        <Link
          href="https://wa.me/393200243217?text=Ciao%20Luigi,%20vorrei%20informazioni%20per%20un%20servizio%20fotografico"
          className="flex flex-col items-center group"
          target="_blank"
          title="Scrivimi su WhatsApp"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-primary"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xs text-center select-none">WhatsApp</span>
        </Link>
      </div>

      {/* Contact Form Section */}
      <div className="py-16">
        <Separator className="mb-16" />
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 select-none">
            Pronto per il tuo evento speciale?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto select-none">
            Ogni matrimonio, ogni celebrazione ha una storia unica da raccontare. 
            Condividi con me i dettagli del tuo evento e creeremo insieme ricordi indimenticabili.
          </p>
        </div>
        
        <div id="contact-form">
          <ContactForm />
        </div>
        
        <div className="text-center mt-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold select-none">Risposta Veloce</h3>
              <p className="text-sm text-muted-foreground select-none">Ti rispondo entro 24 ore</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold select-none">Consulenza Gratuita</h3>
              <p className="text-sm text-muted-foreground select-none">Prima consulenza senza impegno</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold select-none">Tutta la Basilicata</h3>
              <p className="text-sm text-muted-foreground select-none">Servizi in tutta la regione</p>
            </div>
          </div>

          <div className="pt-8">
            <p className="text-sm text-muted-foreground select-none">
              📍 Basato a Satriano di Lucania • Servizi in tutta Italia
            </p>
          </div>
        </div>
      </div>

    </AnimationWrapper>
  );
}

export default Page;
