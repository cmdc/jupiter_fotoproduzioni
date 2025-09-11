import { Header } from "@/components/ui/header-on-page";
import {
  getASeries,
  getAnAsset,
  getPhotoSeries,
} from "@/utils/imagekit-fetches";
import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";
import { ImageSeriesProps } from "@/utils/types";
import AnimationWrapper from "@/components/ui/animation-wrapper";

type Props = { params: { seriesId: string } };

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { seriesId } = params;

  try {
    const data_ = await getPhotoSeries();
    const data = data_.props.images.filter(
      (image: any) => image.slug === seriesId
    )[0];

    if (!data) {
      return {
        title: `Photo Series | ${seriesId}`,
        description: "Photography series",
      };
    }

    return {
      title: `${data.seriesTitle} | Serie Fotografica Luigi Bruno`,
      description: `${data.description} - Serie fotografica di Luigi Bruno, fotografo specializzato in matrimoni e eventi in Basilicata.`,
      openGraph: {
        title: `${data.seriesTitle} | Luigi Bruno Fotografo`,
        description: `${data.description} - Progetto fotografico completo di Luigi Bruno.`,
        images: [
          {
            url: data.src,
            width: 1200,
            height: 630,
            alt: data.seriesTitle,
          },
        ],
      },
    };
  } catch (error) {
    console.warn("Failed to generate metadata for photo-series:", error);
    return {
      title: `Photo Series | ${seriesId}`,
      description: "Photography series",
    };
  }
}

export async function generateStaticParams() {
  try {
    const data_ = await getPhotoSeries();
    const data = data_.props.images;
    return data.map((image: any) => ({
      seriesId: image.slug.toString(),
      revalidate: 86400,
    }));
  } catch (error) {
    console.warn(
      "Failed to generate static params for photo-series, skipping:",
      error
    );
    return [];
  }
}

// return users .map(user => ({
//   userId: user.id.toString()
//   })D

async function Page({ params }: Props) {
  const { seriesId } = params;

  try {
    const data_ = await getPhotoSeries();
    //handle pretty urls, the slug is fetched and the data is filtered from the same query
    const data = data_.props.images.filter(
      (image: any) => image.slug === seriesId
    )[0];

    if (!data) {
      return (
        <AnimationWrapper>
          <Header title="Photo Series" subtitle="Series not found" />
          <section className="py-24 md:mx-1 justify-self-center text-center select-none">
            <p className="text-muted-foreground select-none">
              The requested photo series was not found.
            </p>
          </section>
        </AnimationWrapper>
      );
    }

    return (
      <AnimationWrapper>
        <Header title={data.seriesTitle} subtitle={data.description} />
        <section className="py-24 md:mx-1 justify-self-center ">
          {data.images?.map((image: any, index: number) => (
            <div
              className={`flex flex-col items-center justify-between md:px-24 pt-24 py-1 text-2xl tracking-tight transition-colors text-muted-foreground ${
                // index % 2 ? "md:flex-row-reverse" : ""
                ""
              }`}
              key={image.id}
            >
              {/* <h2 className="mx-auto mb-5">{image.alt}</h2> */}
              {/* <div className="md:hidden text-center mx-2">
              <p className="text-sm md:text-xl md:text-muted-foreground group-hover:opacity-100 line-clamp-2">
                {image.alt} <br /> {image.date}
              </p>
            </div> */}
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                quality={100}
                className="max-h-[85vh] aspect-auto w-auto"
                sizes="100vh"
                blurDataURL={image.blurDataURL}
                placeholder="blur"
                priority
              />
              <div className="md:block md:p-6 max-w-2xl min-w-lg py-4 select-none">
                <p className="text-sm md:text-xl text-center text-foreground-muted md:text-muted-foreground line-clamp-3 select-none">
                  {image.alt} <br />
                  {image.date && (
                    <span className="text-xs select-none">{image.date}</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </section>
        {/* <div className="container flex flex-col my-10">
        <div className="flex justify-center">{x}</div>
      </div> */}
      </AnimationWrapper>
    );
  } catch (error) {
    return (
      <AnimationWrapper>
        <Header title="Photo Series" subtitle="Error loading content" />
        <section className="py-24 md:mx-1 justify-self-center text-center select-none">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 select-none">
              Unable to Load Content
            </h2>
            <p className="text-muted-foreground select-none">
              There was an error loading the photo series. Please check your
              ImageKit configuration.
            </p>
          </div>
        </section>
      </AnimationWrapper>
    );
  }
}

export default Page;
