import { imagekit, imagekitClient } from "./imagekit-client";
import { ImageProps, ImageSeriesProps } from "./types";
import getBase64ImageUrl from "@/lib/generate-blur-placeholder";

// Helper function to create slug from title
const createSlug = (str: string) => {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  var to = "aaaaaeeeeeiiiiooooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
};

// Get files from specific folder
async function getImageKitFilesFromFolder(folderPath: string) {
  try {
    const response = await imagekit.listFiles({
      limit: 1000,
      path: folderPath,
      includeFolder: true,
      fileType: "image",
    });
    return response;
  } catch (error) {
    console.error(`Error fetching ImageKit files from ${folderPath}:`, error);
    return [];
  }
}

// Process individual images for photography gallery (folder-based)
async function processImages(files: any[]) {
  let reducedResults: ImageProps[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const imageUrl = imagekitClient.url({
      path: file.filePath,
      transformation: [
        {
          width: 800,
          quality: 80,
          format: "webp",
        },
      ],
    });

    try {
      const blurDataURL = await getBase64ImageUrl(imageUrl);

      reducedResults.push({
        id: i,
        idc: file.fileId,
        height: file.height || 600,
        src: imageUrl,
        width: file.width || 800,
        alt: String(file.customMetadata?.alt || file.name || `Photo ${i + 1}`),
        date:
          file.customMetadata?.date ||
          new Date(file.createdAt).toLocaleDateString(),
        blurDataURL,
      });
    } catch (error) {
      console.warn(`Failed to generate blur for ${file.name}:`, error);
      reducedResults.push({
        id: i,
        idc: file.fileId,
        height: file.height || 600,
        src: imageUrl,
        width: file.width || 800,
        alt: String(file.customMetadata?.alt || file.name || `Photo ${i + 1}`),
        date:
          file.customMetadata?.date ||
          new Date(file.createdAt).toLocaleDateString(),
        blurDataURL: undefined,
      });
    }
  }

  return {
    props: {
      images: reducedResults,
    },
  };
}

// Get individual photographs for gallery (from photography folder)
export async function getDataPhotographs() {
  try {
    // Get files from photography folder only
    const files = await getImageKitFilesFromFolder("/photography/");
    return await processImages(files);
  } catch (error) {
    console.error("Error in getDataPhotographs:", error);
    throw error;
  }
}

// Get a single photo by ID
export async function getAPhoto(id: string) {
  try {
    const fileDetails = await imagekit.getFileDetails(id);
    const imageUrl = imagekitClient.url({
      path: fileDetails.filePath,
      transformation: [
        {
          width: 800,
          quality: 80,
          format: "webp",
        },
      ],
    });

    const blurDataURL = await getBase64ImageUrl(imageUrl);

    return {
      id: 0,
      idc: fileDetails.fileId,
      height: fileDetails.height || 600,
      src: imageUrl,
      width: fileDetails.width || 800,
      blurDataURL,
      alt: String(
        fileDetails.customMetadata?.alt || fileDetails.name || "Photo"
      ),
    };
  } catch (error) {
    console.error("Error in getAPhoto:", error);
    throw error;
  }
}

// Get a single photo by name or path
export async function getPhotoByName(name: string) {
  try {
    // Get all files and search for the one with matching name or path
    const files = await imagekit.listFiles({
      limit: 1000,
      includeFolder: false,
      name: name,
      tags: ["about", "contatto"],
      fileType: "image",
    });

    const file = files.find(
      (f: any) =>
        f.name === name ||
        f.filePath === name ||
        f.filePath.includes(name) ||
        f.name.includes(name)
    );

    if (!file || file.type !== "file") {
      throw new Error(`Photo not found with name/path: ${name}`);
    }

    // Cast to file type since we've verified it's a file
    const imageFile = file as any;

    const imageUrl = imagekitClient.url({
      path: imageFile.filePath,
      transformation: [
        {
          width: 800,
          quality: 80,
          format: "webp",
        },
      ],
    });

    const blurDataURL = await getBase64ImageUrl(imageUrl);

    return {
      id: 0,
      idc: imageFile.fileId,
      height: imageFile.height || 600,
      src: imageUrl,
      width: imageFile.width || 800,
      blurDataURL,
      alt: String(imageFile.customMetadata?.alt || imageFile.name || "Photo"),
    };
  } catch (error) {
    console.error("Error in getPhotoByName:", error);
    throw error;
  }
}

// Get photo series (from series folder and subfolders)
export async function getPhotoSeries() {
  try {
    // Get all files from series folder
    const seriesFiles = await getImageKitFilesFromFolder("/series/");

    // Group files by their subfolder path
    const seriesMap = new Map<string, any[]>();

    seriesFiles.forEach((file: any) => {
      // Extract series name from file path (e.g., /series/nature/photo1.jpg -> nature)
      const pathParts = file.filePath.split("/");
      if (pathParts.length >= 3 && pathParts[1] === "series") {
        const seriesName = pathParts[2]; // Get the immediate subfolder name
        if (!seriesMap.has(seriesName)) {
          seriesMap.set(seriesName, []);
        }
        seriesMap.get(seriesName)?.push(file);
      }
    });

    const seriesResults: ImageSeriesProps[] = [];
    let seriesIndex = 0;

    for (const [seriesName, files] of Array.from(seriesMap.entries())) {
      if (files.length === 0) continue;
      // Process images in series
      const seriesImages = await processSeriesImages(files);

      // Use first image as cover
      const coverImage = files[0];
      const coverImageUrl = imagekitClient.url({
        path: coverImage.filePath,
        transformation: [
          {
            width: 600,
            height: 400,
            crop: "maintain_ratio",
            quality: 80,
            format: "webp",
          },
        ],
      });

      const seriesTitle = coverImage.customMetadata?.seriesTitle || seriesName;
      const description =
        coverImage.customMetadata?.seriesDescription ||
        `Photo series: ${seriesTitle}`;

      // Generate blur data URL for cover image
      let coverBlurDataURL;
      try {
        coverBlurDataURL = await getBase64ImageUrl(coverImageUrl);
      } catch (error) {
        console.warn(
          `Failed to generate blur for series cover ${seriesName}:`,
          error
        );
        coverBlurDataURL = undefined;
      }

      seriesResults.push({
        id: seriesIndex,
        idc: `series-${seriesIndex}`,
        slug: createSlug(seriesTitle),
        src: coverImageUrl,
        seriesTitle,
        description,
        alt: seriesTitle,
        date:
          coverImage.customMetadata?.date ||
          new Date(coverImage.createdAt).toLocaleDateString(),
        blurDataURL: coverBlurDataURL,
        images: seriesImages.props.images,
      });

      seriesIndex++;
    }

    return {
      props: {
        images: seriesResults,
      },
    };
  } catch (error) {
    console.error("Error in getPhotoSeries (folder-based):", error);
    throw error;
  }
}

// Process images within a series
async function processSeriesImages(files: any[]) {
  let reducedResults: ImageProps[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const imageUrl = imagekitClient.url({
      path: file.filePath,
      transformation: [
        {
          width: 1200,
          quality: 90,
          format: "webp",
        },
      ],
    });

    try {
      const blurDataURL = await getBase64ImageUrl(imageUrl);

      reducedResults.push({
        id: i,
        idc: file.fileId,
        height: file.height || 800,
        src: imageUrl,
        width: file.width || 1200,
        alt: String(
          file.customMetadata?.alt || file.name || `Series photo ${i + 1}`
        ),
        date:
          file.customMetadata?.date ||
          new Date(file.createdAt).toLocaleDateString(),
        blurDataURL,
      });
    } catch (error) {
      console.warn(
        `Failed to generate blur for series image ${file.name}:`,
        error
      );
      reducedResults.push({
        id: i,
        idc: file.fileId,
        height: file.height || 800,
        src: imageUrl,
        width: file.width || 1200,
        alt: String(
          file.customMetadata?.alt || file.name || `Series photo ${i + 1}`
        ),
        date:
          file.customMetadata?.date ||
          new Date(file.createdAt).toLocaleDateString(),
        blurDataURL: undefined,
      });
    }
  }

  return {
    props: {
      images: reducedResults,
    },
  };
}

// Legacy compatibility - get a series by slug
export async function getASeries(slug: string) {
  const allSeries = await getPhotoSeries();
  const series = allSeries.props.images.find(
    (s: ImageSeriesProps) => s.slug === slug
  );

  if (!series) {
    throw new Error(`Series not found: ${slug}`);
  }

  return {
    reducedResults: series,
    images: { props: { images: series.images || [] } },
  };
}

// Get asset by entry ID (legacy compatibility)
export async function getAnAsset(entityId: string) {
  return await getAPhoto(entityId);
}
