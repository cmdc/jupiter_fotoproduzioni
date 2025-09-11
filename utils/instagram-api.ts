import { ImageProps } from "./types";

// Instagram configuration (no token required)
const INSTAGRAM_USERNAME =
  process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || "brunol.35ml";

// Cache configuration - Extended to reduce API calls
const CACHE_DURATION = 1000 * 60 * 120; // 2 hours
let cachedData: ImageProps[] | null = null;
let cacheTimestamp: number = 0;

// RSS/API service configurations
const SERVICES = {
  RSS_BRIDGE: `https://rss-bridge.org/bridge01/?action=display&bridge=Instagram&context=Username&u=${INSTAGRAM_USERNAME}&format=Json`,
  PICUKI_API: `https://www.picuki.com/profile/${INSTAGRAM_USERNAME}`,
  INSTARSS: `https://instarss.com/feed/${INSTAGRAM_USERNAME}`,
};

interface RSSInstagramPost {
  id?: string;
  title?: string;
  content?: string;
  url?: string;
  image?: string;
  date_published?: string;
  content_html?: string;
}

// Try RSS Bridge service first
async function fetchFromRSSBridge(): Promise<RSSInstagramPost[]> {
  try {
    const response = await fetch(SERVICES.RSS_BRIDGE, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; InstagramFeed/1.0)",
        Accept: "application/json",
      },
      // Add timeout and other fetch options for better reliability
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(
        `RSS Bridge error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return Array.isArray(data.items) ? data.items : [];
  } catch (error) {
    throw error;
  }
}

// Alternative: Try InstaRSS service
async function fetchFromInstaRSS(): Promise<RSSInstagramPost[]> {
  try {
    const response = await fetch(SERVICES.INSTARSS, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; InstagramFeed/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`InstaRSS error: ${response.status}`);
    }

    // Parse RSS XML to extract posts
    const xmlText = await response.text();
    return parseRSSXML(xmlText);
  } catch (error) {
    throw error;
  }
}

// Simple RSS XML parser
function parseRSSXML(xmlText: string): RSSInstagramPost[] {
  const posts: RSSInstagramPost[] = [];

  try {
    // Extract items between <item> tags using regex (simple approach)
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1];

      // Extract fields
      const titleMatch = /<title><!\[CDATA\[(.*?)\]\]><\/title>/.exec(
        itemContent
      );
      const linkMatch = /<link>(.*?)<\/link>/.exec(itemContent);
      const descMatch =
        /<description><!\[CDATA\[(.*?)\]\]><\/description>/.exec(itemContent);
      const pubDateMatch = /<pubDate>(.*?)<\/pubDate>/.exec(itemContent);

      // Extract image from description/content
      const imgMatch = /<img[^>]+src="([^"]+)"/.exec(itemContent);

      if (titleMatch && linkMatch) {
        posts.push({
          id: linkMatch[1]?.split("/").pop() || `post-${posts.length}`,
          title: titleMatch[1],
          content: descMatch?.[1] || "",
          url: linkMatch[1],
          image: imgMatch?.[1] || "",
          date_published: pubDateMatch?.[1] || new Date().toISOString(),
        });
      }
    }
  } catch (error) {
  }

  return posts.slice(0, 20); // Limit to 20 posts
}

// Main function to fetch Instagram posts using multiple fallbacks
async function fetchInstagramPosts(): Promise<RSSInstagramPost[]> {
  const services = [
    { name: "RSS Bridge", fetch: fetchFromRSSBridge },
    { name: "InstaRSS", fetch: fetchFromInstaRSS },
  ];

  for (const service of services) {
    try {
      const posts = await service.fetch();
      if (posts && posts.length > 0) {
        return posts;
      }
    } catch (error) {
      continue;
    }
  }

  throw new Error("All Instagram services failed");
}

function convertRSSPostToImageProps(
  post: RSSInstagramPost,
  index: number
): ImageProps {
  // Extract and clean caption from title or content
  const rawCaption = post.title || post.content || "";
  const cleanCaption =
    rawCaption
      .replace(/#\w+/g, "") // Remove hashtags
      .replace(/@\w+/g, "") // Remove mentions
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/&[^;]+;/g, "") // Remove HTML entities
      .trim()
      .substring(0, 100) || `Instagram Post ${index + 1}`;

  // Parse date
  let postDate = new Date().toLocaleDateString("it-IT");
  if (post.date_published) {
    try {
      postDate = new Date(post.date_published).toLocaleDateString("it-IT");
    } catch (e) {
      // Keep default date if parsing fails
    }
  }

  // Generate varied dimensions for organic masonry look
  const heights = [300, 400, 350, 500, 280, 450, 320, 380, 600, 250];
  const widths = [400, 400, 400, 400, 400, 400, 400, 400, 400, 400]; // Keep width consistent

  // Extract image URL from various possible fields
  let imageUrl = post.image || "";

  // If no direct image, try to extract from content_html
  if (!imageUrl && post.content_html) {
    const imgMatch = /<img[^>]+src="([^"]+)"/.exec(post.content_html);
    imageUrl = imgMatch?.[1] || "";
  }

  // If still no image, try from content
  if (!imageUrl && post.content) {
    const imgMatch = /<img[^>]+src="([^"]+)"/.exec(post.content);
    imageUrl = imgMatch?.[1] || "";
  }

  // Create proxy URL for Instagram images to bypass CORS
  let finalImageUrl = imageUrl;
  if (imageUrl && (imageUrl.includes('cdninstagram.com') || imageUrl.includes('instagram.com'))) {
    // Use our proxy API route to serve the Instagram image
    finalImageUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
  }

  return {
    id: index,
    idc: post.id || `instagram-post-${index}`,
    height: heights[index % heights.length],
    width: widths[index % widths.length],
    src: finalImageUrl,
    alt: `${cleanCaption} - @brunol.35ml`,
    date: postDate,
    tags: ["instagram", "brunol.35ml", "feed"],
    blurDataURL: undefined, // Skip blur generation for RSS images
  };
}

export async function getInstagramFeed(): Promise<ImageProps[]> {
  // Check cache first
  const now = Date.now();
  if (cachedData && now - cacheTimestamp < CACHE_DURATION) {
    return cachedData;
  }


  try {
    const posts = await fetchInstagramPosts();
    if (posts && posts.length > 0) {

      // Convert RSS posts to ImageProps
      const images = posts.map((post, index) =>
        convertRSSPostToImageProps(post, index)
      );

      // Cache the result
      cachedData = images;
      cacheTimestamp = now;

      return images;
    } else {
    }
  } catch (error) {
  }

  // Fallback to mock data if all services fail
  return getMockInstagramFeed();
}

// Mock data for development/fallback
function getMockInstagramFeed(): ImageProps[] {
  // Use more reliable image sources that work better with Next.js and ImageKit
  const baseUrl = "https://images.unsplash.com";
  const mockImages = [
    { w: 600, h: 400, id: "photo-1544005313-94ddf0286df2?" }, // Portrait
    { w: 400, h: 600, id: "photo-1517849845537-4d257902454a" }, // Dog portrait
    { w: 600, h: 600, id: "photo-1529390079861-591de354faf5" }, // Square nature
    { w: 500, h: 700, id: "photo-1441986300917-64674bd600d8" }, // Street photo
    { w: 600, h: 400, id: "photo-1502657877623-f66bf489d236" }, // Landscape
    { w: 600, h: 800, id: "photo-1549388604-817d15aa0110" }, // Portrait
  ];

  return mockImages.map((img, index) => ({
    id: index,
    idc: `mock-${index + 1}`,
    height: img.h,
    width: img.w,
    src: `${baseUrl}/${img.id}?w=${img.w}&h=${img.h}&fit=crop&crop=center`,
    alt: `Mock Instagram post ${
      index + 1
    } - Esempio contenuto dal feed @brunol.35ml`,
    date: new Date().toLocaleDateString("it-IT"),
    tags: ["instagram", "mock"],
    blurDataURL: undefined,
  }));
}
