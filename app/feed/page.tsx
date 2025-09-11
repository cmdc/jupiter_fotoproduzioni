import AnimationWrapper from "@/components/ui/animation-wrapper";
import { Header } from "@/components/ui/header-on-page";
import BricksMasonry from "@/components/ui/bricks-masonry";
import { Metadata } from "next";
import { getInstagramFeed } from "@/utils/instagram-api";

export const metadata: Metadata = {
  title: "Feed Instagram",
  description:
    "Scopri gli ultimi momenti catturati da Luigi Bruno. Feed Instagram con le immagini più recenti dal profilo @brunol.35ml.",
  openGraph: {
    title: "Feed Instagram | Luigi Bruno Fotografo Basilicata",
    description:
      "Esplora il feed Instagram di Luigi Bruno. Le ultime immagini dal profilo @brunol.35ml con momenti spontanei e dietro le quinte.",
  },
};

export default async function FeedPage() {
  try {
    const instagramFeed = await getInstagramFeed();

    if (!instagramFeed || instagramFeed.length === 0) {
      throw new Error("No Instagram posts found");
    }

    return (
      <AnimationWrapper>
        <div>
          <Header
            title="Instagram Feed"
            subtitle="Gli ultimi scatti dal profilo @brunol.35ml - Momenti spontanei e dietro le quinte della fotografia."
          />

          <div id="photos-section" className="py-24">
            <section className="px-4 md:px-8">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold mb-2">
                  Ultime dal profilo Instagram
                </h2>
                <div className="w-24 h-0.5 bg-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">
                  {instagramFeed.length} post recenti
                </p>
              </div>
              <BricksMasonry images={instagramFeed} />
            </section>
          </div>
        </div>
      </AnimationWrapper>
    );
  } catch (error) {
    return (
      <AnimationWrapper>
        <div>
          <Header
            title="Instagram Feed"
            subtitle="Errore nel caricamento del contenuto"
          />
          <section className="py-24 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">
                Impossibile caricare il Feed
              </h2>
              <p className="text-muted-foreground">
                Errore nel caricamento del feed Instagram. Controlla la
                configurazione API o riprova più tardi.
              </p>
            </div>
          </section>
        </div>
      </AnimationWrapper>
    );
  }
}