const cache = new Map<string, string>();

export default async function getBase64ImageUrl(image: any): Promise<string> {
  // Create a simple key for caching
  const imageKey = typeof image === "string" ? image : String(image);

  let url = cache.get(imageKey);
  if (url) {
    return url;
  }

  // Return a simple base64 placeholder instead of using sharp/plaiceholder
  const placeholder =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyEH4Hdzj0eQQvkzQfhvKoLgq5kj0mzLTXJOiCOV5pAvoE9o5ypH2EQo60Q7A==";

  // Cache the result
  cache.set(imageKey, placeholder);

  return placeholder;
}
