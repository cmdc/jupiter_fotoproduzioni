"use client";
import { ImageLoaderProps } from "next/image";

export default function imagekitLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  // If src is already a full URL, check if it's from ImageKit or external
  if (src.startsWith("http")) {
    const url = new URL(src);

    // If it's an ImageKit URL
    if (url.hostname === "ik.imagekit.io") {
      // If it's already an ImageKit URL with transformations, just return it
      // ImageKit URLs already include width in their transformations
      return src;
    }

    // For external URLs (Instagram, Unsplash, etc.), add width parameter if supported
    // Instagram CDN URLs support basic resizing
    if (url.hostname.includes("cdninstagram.com")) {
      // For Instagram URLs, we can add width but keep original format
      return src; // Instagram URLs already have optimal sizing
    }

    // For other external services like Unsplash, add width parameter
    if (url.hostname === "images.unsplash.com") {
      url.searchParams.set("w", width.toString());
      if (quality) url.searchParams.set("q", quality.toString());
      return url.toString();
    }

    // For other external URLs, return as is
    return src;
  }

  // Fallback for relative paths
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";
  if (!urlEndpoint) return src;

  const transforms = [
    `w-${width}`,
    `q-${quality || 75}`,
    "f-webp",
    "c-maintain_ratio",
  ].join(",");

  return `${urlEndpoint}/tr:${transforms}${src}`;
}
