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
      },
    });

    if (!response.ok) {
      throw new Error(`RSS Bridge error: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data.items) ? data.items : [];
  } catch (error) {
    console.warn("RSS Bridge failed:", error);
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
    console.warn("InstaRSS failed:", error);
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
    console.warn("RSS XML parsing failed:", error);
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
      console.log(`Trying ${service.name}...`);
      const posts = await service.fetch();
      if (posts && posts.length > 0) {
        console.log(`Success with ${service.name}: ${posts.length} posts`);
        return posts;
      }
    } catch (error) {
      console.warn(`${service.name} failed:`, error);
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

  return {
    id: index,
    idc: post.id || `rss-post-${index}`,
    height: heights[index % heights.length],
    width: widths[index % widths.length],
    src: imageUrl,
    alt: cleanCaption,
    date: postDate,
    tags: ["instagram", "feed", "rss"],
    blurDataURL: undefined, // Skip blur generation for RSS images
  };
}

export async function getInstagramFeed(): Promise<ImageProps[]> {
  // Check cache first
  const now = Date.now();
  if (cachedData && now - cacheTimestamp < CACHE_DURATION) {
    return cachedData;
  }

  return getMockInstagramFeed();
}

// Mock data for development/fallback
function getMockInstagramFeed(): ImageProps[] {
  return [
    {
      id: 0,
      idc: "mock-1",
      height: 600,
      width: 600,
      src: "https://picsum.photos/600/600?random=1",
      alt: "Mock Instagram post 1",
      date: new Date().toLocaleDateString("it-IT"),
      tags: ["instagram", "mock"],
    },
    {
      id: 1,
      idc: "mock-2",
      height: 600,
      width: 400,
      src: "https://picsum.photos/600/400?random=2",
      alt: "Mock Instagram post 2",
      date: new Date().toLocaleDateString("it-IT"),
      tags: ["instagram", "mock"],
    },
    {
      id: 2,
      idc: "mock-3",
      height: 800,
      width: 600,
      src: "https://picsum.photos/600/800?random=3",
      alt: "Mock Instagram post 3",
      date: new Date().toLocaleDateString("it-IT"),
      tags: ["instagram", "mock"],
    },
    {
      id: 3,
      idc: "mock-4",
      height: 500,
      width: 600,
      src: "https://picsum.photos/600/500?random=4",
      alt: "Mock Instagram post 4",
      date: new Date().toLocaleDateString("it-IT"),
      tags: ["instagram", "mock"],
    },
    {
      id: 4,
      idc: "mock-5",
      height: 700,
      width: 600,
      src: "https://picsum.photos/600/700?random=5",
      alt: "Mock Instagram post 5",
      date: new Date().toLocaleDateString("it-IT"),
      tags: ["instagram", "mock"],
    },
    {
      id: 5,
      idc: "mock-6",
      height: 600,
      width: 600,
      src: "https://picsum.photos/600/600?random=6",
      alt: "Mock Instagram post 6",
      date: new Date().toLocaleDateString("it-IT"),
      tags: ["instagram", "mock"],
    },
  ];
}
