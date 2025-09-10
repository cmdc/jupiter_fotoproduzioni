import ImageContainer from "@/components/image-container";
import AnimationWrapper from "@/components/ui/animation-wrapper";
import { Header } from "@/components/ui/header-on-page";
import { getDataPhotographs } from "@/utils/contentful-fetches";
import { ImageProps } from "@/utils/types";
import { Metadata } from "next";
import Image from "next/image";

type Props = {};

export const metadata: Metadata = {
  title: "Photography",
  description:
    "A moment in time and space, captured and rendered for its perceived beauty.",
};

export default async function Page({}: Props) {
  // Check if Contentful credentials are configured
  if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || 
      process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID === 'your-contentful-space-id') {
    return (
      <AnimationWrapper>
        <div>
          <Header
            title="Photography"
            subtitle="Contentful configuration required"
          />
          <section className="py-24 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Configuration Required</h2>
              <p className="text-muted-foreground">
                Please configure your Contentful credentials in the .env file to view photographs.
              </p>
              <div className="mt-6 text-sm text-muted-foreground">
                <p>Required environment variables:</p>
                <ul className="mt-2 space-y-1">
                  <li>NEXT_PUBLIC_CONTENTFUL_SPACE_ID</li>
                  <li>NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </AnimationWrapper>
    );
  }

  try {
    const data = await getDataPhotographs();
    return (
      <AnimationWrapper>
        <div>
          <Header
            title="Photography"
            subtitle="A moment in time and space, captured and rendered for its perceived beauty."
          />
          <section className="grid md:grid-cols-gallery auto-rows-[5px] py-24 md:mx-1">
            {data.props.images.map((image: ImageProps, index: number) => (
              <ImageContainer key={index} image={image} index={index} href={""} />
            ))}
          </section>
        </div>
      </AnimationWrapper>
    );
  } catch (error) {
    return (
      <AnimationWrapper>
        <div>
          <Header
            title="Photography"
            subtitle="Error loading content"
          />
          <section className="py-24 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Unable to Load Content</h2>
              <p className="text-muted-foreground">
                There was an error loading the photographs. Please check your Contentful configuration.
              </p>
            </div>
          </section>
        </div>
      </AnimationWrapper>
    );
  }
}
