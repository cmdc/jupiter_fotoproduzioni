import AnimationWrapper from "@/components/ui/animation-wrapper";
import { Header } from "@/components/ui/header-on-page";
import BricksMasonry from "@/components/ui/bricks-masonry";
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

// Helper function to group images by tags
function groupImagesByTags(images: ImageProps[]) {
  const grouped: { [key: string]: ImageProps[] } = {};
  const untagged: ImageProps[] = [];

  images.forEach((image) => {
    if (!image.tags || image.tags.length === 0) {
      untagged.push(image);
    } else {
      // For each tag, add the image to that group
      image.tags.forEach((tag) => {
        // Filter out special display tags
        if (!tag.startsWith("displayName:")) {
          if (!grouped[tag]) {
            grouped[tag] = [];
          }
          grouped[tag].push(image);
        }
      });
    }
  });

  // If image has no regular tags, add to untagged
  images.forEach((image) => {
    const regularTags =
      image.tags?.filter((tag) => !tag.startsWith("displayName:")) || [];
    if (regularTags.length === 0 && !untagged.includes(image)) {
      untagged.push(image);
    }
  });

  return { grouped, untagged };
}

export default async function Page({}: Props) {
  try {
    const data = await getDataPhotographs();
    const { grouped, untagged } = groupImagesByTags(data.props.images);
    const taggedSections = Object.entries(grouped);

    return (
      <AnimationWrapper>
        <div>
          <Header
            title="Portfolio Fotografico"
            subtitle="Momenti catturati nel tempo, emozioni che diventano arte attraverso l'obiettivo."
          />

          <div id="photos-section" className="py-24 space-y-32">
            {/* Tagged sections */}
            {taggedSections.map(([tag, images]) => (
              <section key={tag} className="px-4 md:px-8">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold capitalize mb-2">{tag}</h2>
                  <div className="w-24 h-0.5 bg-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-4">
                    {images.length} foto
                  </p>
                </div>
                <BricksMasonry images={images} />
              </section>
            ))}

            {/* Untagged images - scattered throughout without section header */}
            {untagged.length > 0 && (
              <section className="px-4 md:px-8 pt-10">
                <BricksMasonry images={untagged} />
              </section>
            )}
          </div>
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
