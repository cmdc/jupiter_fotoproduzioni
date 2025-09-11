import { imagekit, imagekitClient } from "./imagekit-client";
import { ImageProps, ImageSeriesProps } from "./types";
import getBase64ImageUrl from "@/lib/generate-blur-placeholder";

/*
 * ImageKit Organization Migration:
 * 
 * OLD SYSTEM (Tag-based):
 * - Individual photos: No "series" tag
 * - Photo series: Tagged with "series:seriesName"
 * 
 * NEW SYSTEM (Folder-based):
 * - Individual photos: Stored in /photography folder
 * - Photo series: Stored in /series/[seriesName] subfolders
 * 
 * This file now uses folder-based organization with fallback to tag-based
 * for backward compatibility during the transition period.
 */

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

// Get all files from ImageKit with metadata
async function getImageKitFiles() {
  try {
    const response = await imagekit.listFiles({
      limit: 1000,
      includeFolder: false,
    });
    return response;
  } catch (error) {
    console.error("Error fetching ImageKit files:", error);
    return [];
  }
}

// Get files from specific folder
async function getImageKitFilesFromFolder(folderPath: string) {
  try {
    const response = await imagekit.listFiles({
      limit: 1000,
      path: folderPath,
      includeFolder: false,
    });
    return response;
  } catch (error) {
    console.error(`Error fetching ImageKit files from ${folderPath}:`, error);
    return [];
  }
}

// Process individual images for photography gallery (folder-based)
async function processImages(files: any[]) {
  const photographs = files.filter(
    (file) =>
      file.type === "file" &&
      file.mimeType?.startsWith("image/")
      // Now using folder-based organization, no tag filtering needed
  );
  console.log(`Processing ${photographs.length} photographs`);

  let reducedResults: ImageProps[] = [];

  for (let i = 0; i < photographs.length; i++) {
    const file = photographs[i];
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
  // Check if ImageKit credentials are configured
  if (
    !process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY === "your-imagekit-public-key"
  ) {
    throw new Error("ImageKit credentials not configured");
  }

  try {
    // Get files from photography folder only
    const files = await getImageKitFilesFromFolder("/photography");
    return await processImages(files);
  } catch (error) {
    console.error("Error in getDataPhotographs:", error);
    // Fallback to old method if folder doesn't exist
    try {
      console.log("Falling back to tag-based method...");
      const allFiles = await getImageKitFiles();
      const filteredFiles = allFiles.filter(
        (file: any) =>
          file.type === "file" &&
          file.mimeType?.startsWith("image/") &&
          !file.tags?.includes("series")
      );
      console.log(`Fallback: Processing ${filteredFiles.length} photographs`);
      return await processImages(filteredFiles);
    } catch (fallbackError) {
      console.error("Fallback method also failed:", fallbackError);
      throw error;
    }
  }
}

// Get a single photo by ID
export async function getAPhoto(id: string) {
  if (
    !process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY === "your-imagekit-public-key"
  ) {
    throw new Error("ImageKit credentials not configured");
  }

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

// Get photo series (from series folder and subfolders)
export async function getPhotoSeries() {
  if (
    !process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY === "your-imagekit-public-key"
  ) {
    throw new Error("ImageKit credentials not configured");
  }

  try {
    // Get all files from series folder
    const seriesFiles = await getImageKitFilesFromFolder("/series");
    
    // Group files by their subfolder path
    const seriesMap = new Map<string, any[]>();
    
    seriesFiles.forEach((file: any) => {
      if (file.type === "file" && file.mimeType?.startsWith("image/")) {
        // Extract series name from file path (e.g., /series/nature/photo1.jpg -> nature)
        const pathParts = file.filePath.split('/');
        if (pathParts.length >= 3 && pathParts[1] === 'series') {
          const seriesName = pathParts[2]; // Get the immediate subfolder name
          if (!seriesMap.has(seriesName)) {
            seriesMap.set(seriesName, []);
          }
          seriesMap.get(seriesName)?.push(file);
        }
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
    // Fallback to tag-based method if folder doesn't exist
    try {
      console.log("Falling back to tag-based series method...");
      const allFiles = await getImageKitFiles();
      const seriesMap = new Map<string, any[]>();

      // Group files by series tag (old method)
      allFiles.forEach((file: any) => {
        if (file.tags && file.tags.length > 0) {
          file.tags.forEach((tag: string) => {
            if (tag.startsWith("series:")) {
              const seriesName = tag.replace("series:", "");
              if (!seriesMap.has(seriesName)) {
                seriesMap.set(seriesName, []);
              }
              seriesMap.get(seriesName)?.push(file);
            }
          });
        }
      });

      const seriesResults: ImageSeriesProps[] = [];
      let seriesIndex = 0;

      for (const [seriesName, files] of Array.from(seriesMap.entries())) {
        if (files.length === 0) continue;
        const seriesImages = await processSeriesImages(files);
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

        let coverBlurDataURL;
        try {
          coverBlurDataURL = await getBase64ImageUrl(coverImageUrl);
        } catch (error) {
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
    } catch (fallbackError) {
      console.error("Fallback series method also failed:", fallbackError);
      throw error;
    }
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
