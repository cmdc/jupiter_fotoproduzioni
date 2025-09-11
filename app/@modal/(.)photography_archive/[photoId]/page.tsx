import ModalSwiper from "@/components/swiper/modal-swiper";
import Modal from "@/components/ui/Modal/modal";
import { getAnAsset, getDataPhotographs } from "@/utils/imagekit-fetches";
import { Metadata, ResolvingMetadata } from "next";

type Props = { params: { photoId: string } };

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { photoId } = params;
  const data = await getAnAsset(photoId);

  return {
    title: `Photograph | ${data.alt}`,
  };
}

export async function generateStaticParams() {
  const dataAll = await getDataPhotographs();
  const data = dataAll.props.images;
  return data.map((image: any) => ({
    photoId: image.idc.toString(),
    revalidate: 86400,
  }));
}

async function Page({ params }: Props) {
  var dataAll = await getDataPhotographs();
  var idc = params.photoId;

  // const currentImage = data;
  return (
    <Modal>
      <ModalSwiper images={dataAll.props.images} idc={idc} show={false} />
    </Modal>
  );
}

export default Page;

// TODO: need to figure out how to manage the modal transitions from photo to photo. (maybe that is not needed - Not sure)
// TODO: The image feels like is not taking the full space possible => Might need to fix later
