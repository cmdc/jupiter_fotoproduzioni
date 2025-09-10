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

// Process individual images for photography gallery
async function processImages(files: any[]) {
  const photographs = files.filter(file => 
    file.type === 'file' && 
    file.mimeType?.startsWith('image/') &&
    !file.tags?.includes('series') // Individual photos, not part of series
  );

  let reducedResults: ImageProps[] = [];
  
  for (let i = 0; i < photographs.length; i++) {
    const file = photographs[i];
    const imageUrl = imagekitClient.url({
      path: file.filePath,
      transformation: [{
        width: 800,
        quality: 80,
        format: 'webp'
      }]
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
        date: file.customMetadata?.date || new Date(file.createdAt).toLocaleDateString(),
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
        date: file.customMetadata?.date || new Date(file.createdAt).toLocaleDateString(),
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

// Get individual photographs for gallery
export async function getDataPhotographs() {
  // Check if ImageKit credentials are configured
  if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY === 'your-imagekit-public-key') {
    throw new Error("ImageKit credentials not configured");
  }

  try {
    const files = await getImageKitFiles();
    return await processImages(files);
  } catch (error) {
    console.error("Error in getDataPhotographs:", error);
    throw error;
  }
}

// Get a single photo by ID
export async function getAPhoto(id: string) {
  if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY === 'your-imagekit-public-key') {
    throw new Error("ImageKit credentials not configured");
  }

  try {
    const fileDetails = await imagekit.getFileDetails(id);
    const imageUrl = imagekitClient.url({
      path: fileDetails.filePath,
      transformation: [{
        width: 800,
        quality: 80,
        format: 'webp'
      }]
    });
    
    const blurDataURL = await getBase64ImageUrl(imageUrl);

    return {
      id: 0,
      idc: fileDetails.fileId,
      height: fileDetails.height || 600,
      src: imageUrl,
      width: fileDetails.width || 800,
      blurDataURL,
      alt: String(fileDetails.customMetadata?.alt || fileDetails.name || "Photo"),
    };
  } catch (error) {
    console.error("Error in getAPhoto:", error);
    throw error;
  }
}

// Get photo series (folders with photos)
export async function getPhotoSeries() {
  if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY === 'your-imagekit-public-key') {
    throw new Error("ImageKit credentials not configured");
  }

  try {
    // Since ImageKit doesn't have folders in the same way as Contentful,
    // we'll use tags to organize photo series
    // Get all files and group them by tags
    const allFiles = await getImageKitFiles();
    const seriesMap = new Map<string, any[]>();
    
    // Group files by series tag
    allFiles.forEach((file: any) => {
      if (file.tags && file.tags.length > 0) {
        file.tags.forEach((tag: string) => {
          if (tag.startsWith('series:')) {
            const seriesName = tag.replace('series:', '');
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
      // Process images in series
      const seriesImages = await processSeriesImages(files);
      
      // Use first image as cover
      const coverImage = files[0];
      const coverImageUrl = imagekitClient.url({
        path: coverImage.filePath,
        transformation: [{
          width: 600,
          height: 400,
          crop: 'maintain_ratio',
          quality: 80,
          format: 'webp'
        }]
      });
      
      const seriesTitle = coverImage.customMetadata?.seriesTitle || seriesName;
      const description = coverImage.customMetadata?.seriesDescription || `Photo series: ${seriesTitle}`;
      
      seriesResults.push({
        id: seriesIndex,
        idc: `series-${seriesIndex}`,
        slug: createSlug(seriesTitle),
        src: coverImageUrl,
        seriesTitle,
        description,
        alt: seriesTitle,
        date: coverImage.customMetadata?.date || new Date(coverImage.createdAt).toLocaleDateString(),
        blurDataURL: undefined, // Will be generated if needed
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
    console.error("Error in getPhotoSeries:", error);
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
      transformation: [{
        width: 1200,
        quality: 90,
        format: 'webp'
      }]
    });
    
    try {
      const blurDataURL = await getBase64ImageUrl(imageUrl);
      
      reducedResults.push({
        id: i,
        idc: file.fileId,
        height: file.height || 800,
        src: imageUrl,
        width: file.width || 1200,
        alt: String(file.customMetadata?.alt || file.name || `Series photo ${i + 1}`),
        date: file.customMetadata?.date || new Date(file.createdAt).toLocaleDateString(),
        blurDataURL,
      });
    } catch (error) {
      console.warn(`Failed to generate blur for series image ${file.name}:`, error);
      reducedResults.push({
        id: i,
        idc: file.fileId,
        height: file.height || 800,
        src: imageUrl,
        width: file.width || 1200,
        alt: String(file.customMetadata?.alt || file.name || `Series photo ${i + 1}`),
        date: file.customMetadata?.date || new Date(file.createdAt).toLocaleDateString(),
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
  const series = allSeries.props.images.find((s: ImageSeriesProps) => s.slug === slug);
  
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