import ImageContainer from "@/components/image-container";
import AnimationWrapper from "@/components/ui/animation-wrapper";
import { Header } from "@/components/ui/header-on-page";
import { getDataPhotographs } from "@/utils/imagekit-fetches";
import { ImageProps } from "@/utils/types";
import { Metadata } from "next";

type Props = {};

export const metadata: Metadata = {
  title: "Portfolio Fotografico",
  description:
    "Scopri il portfolio fotografico di Luigi Bruno. Galleria di immagini professionali che catturano emozioni, momenti speciali e la bellezza della Basilicata.",
  openGraph: {
    title: "Portfolio Fotografico | Luigi Bruno Fotografo Basilicata",
    description:
      "Esplora la galleria fotografica di Luigi Bruno. Immagini professionali che raccontano storie e catturano la bellezza dei momenti più preziosi.",
  },
};

export default async function Page({}: Props) {
  try {
    const data = await getDataPhotographs();
    return (
      <AnimationWrapper>
        <div>
          <Header
            title="Portfolio Fotografico"
            subtitle="Momenti catturati nel tempo, emozioni che diventano arte attraverso l'obiettivo."
          />
          <section className="grid md:grid-cols-gallery auto-rows-[5px] py-24 md:mx-1">
            {data.props.images.map((image: ImageProps, index: number) => (
              <ImageContainer
                key={index}
                image={image}
                index={index}
                href={""}
              />
            ))}
          </section>
        </div>
      </AnimationWrapper>
    );
  } catch (error) {
    return (
      <AnimationWrapper>
        <div>
          <Header title="Photography" subtitle="Error loading content" />
          <section className="py-24 text-center select-none">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 select-none">
                Unable to Load Content
              </h2>
              <p className="text-muted-foreground select-none">
                There was an error loading the photographs. Please check your
                ImageKit configuration.
              </p>
            </div>
          </section>
        </div>
      </AnimationWrapper>
    );
  }
}
