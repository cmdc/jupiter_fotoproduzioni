"use client";
import { ImageLoaderProps } from "next/image";

export default function imagekitLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  // If src is already a full URL (from ImageKit), return as is with transformations
  if (src.startsWith("http")) {
    // Extract the base URL and path
    const url = new URL(src);

    // If it's already an ImageKit URL with transformations, return as is
    if (url.pathname.includes("/tr:")) {
      return src;
    }

    // Add transformations to existing ImageKit URL
    const pathParts = url.pathname.split("/");
    const filename = pathParts.pop();
    const basePath = pathParts.join("/");

    const transforms = [
      `w-${width}`,
      `q-${quality || 75}`,
      "f-webp",
      "c-maintain_ratio",
    ].join(",");

    return `${url.origin}${basePath}/tr:${transforms}/${filename}`;
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
