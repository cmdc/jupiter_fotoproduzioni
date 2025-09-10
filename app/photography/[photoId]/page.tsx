import { getAnAsset, getDataPhotographs } from "@/utils/imagekit-fetches";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import ModalSwiper from "@/components/swiper/modal-swiper";
import { ImageProps } from "@/utils/types";
import AnimationWrapper from "@/components/ui/animation-wrapper";

type Props = { params: { photoId: string } };

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { photoId } = params;

  // Skip metadata generation if ImageKit credentials are not configured
  if (
    !process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY === "your-imagekit-public-key"
  ) {
    return {
      title: `Photograph | ${photoId}`,
    };
  }

  try {
    var data = await getDataPhotographs();
    var alt = data.props.images
      .map(function (e: { alt: any }) {
        return e.alt;
      })
      .indexOf(photoId);

    return {
      title: `Photograph | ${alt}`,
    };
  } catch (error) {
    return {
      title: `Photograph | ${photoId}`,
    };
  }
}

export async function generateStaticParams() {
  // Skip static generation if ImageKit credentials are not configured
  if (
    !process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY === "your-imagekit-public-key"
  ) {
    return [];
  }

  try {
    const dataAll = await getDataPhotographs();
    const data = dataAll.props.images;
    return data.map((image: any) => ({
      photoId: image.idc.toString(),
      revalidate: 86400,
    }));
  } catch (error) {
    console.warn(
      "Failed to generate static params for photography, skipping:",
      error
    );
    return [];
  }
}

async function Page({ params }: Props) {
  var idc = params.photoId;

  // Check if ImageKit credentials are configured
  if (
    !process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY === "your-imagekit-public-key"
  ) {
    return (
      <AnimationWrapper>
        <div className="py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Configuration Required</h2>
            <p className="text-muted-foreground">
              Please configure your ImageKit credentials in the .env file to
              view photographs.
            </p>
            <div className="mt-6 text-sm text-muted-foreground">
              <p>Required environment variables:</p>
              <ul className="mt-2 space-y-1">
                <li>NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY</li>
                <li>NEXT_IMAGEKIT_PRIVATE_KEY</li>
                <li>NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT</li>
              </ul>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    );
  }

  try {
    var data = await getDataPhotographs();
    return (
      <AnimationWrapper>
        <div>
          <ModalSwiper images={data.props.images} idc={idc} show={false} />
        </div>
      </AnimationWrapper>
    );
  } catch (error) {
    return (
      <AnimationWrapper>
        <div className="py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Unable to Load Content</h2>
            <p className="text-muted-foreground">
              There was an error loading the photograph. Please check your
              ImageKit configuration.
            </p>
          </div>
        </div>
      </AnimationWrapper>
    );
  }
}
export default Page;

// :TODO: need to add a 404 page for when the photoId is not found
