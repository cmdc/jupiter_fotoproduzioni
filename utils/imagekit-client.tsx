import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.NEXT_IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

// For client-side operations (no private key needed)
export const imagekitClient = {
  url: (options: {
    path?: string;
    src?: string;
    transformation?: Array<{ [key: string]: any }>;
    transformationPosition?: "path" | "query";
  }) => {
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";
    if (!urlEndpoint) return "";

    const {
      path,
      src,
      transformation = [],
      transformationPosition = "path",
    } = options;
    let url = urlEndpoint;

    if (path) {
      url = `${urlEndpoint}${path}`;
    } else if (src) {
      url = src;
    }

    if (transformation && transformation.length > 0) {
      const transformStr = transformation
        .map((t) =>
          Object.entries(t)
            .map(([k, v]) => `${k}-${v}`)
            .join(",")
        )
        .join("/");

      if (transformationPosition === "path") {
        const parts = url.split("/");
        const fileName = parts.pop();
        url = `${parts.join("/")}/tr:${transformStr}/${fileName}`;
      } else {
        url = `${url}?tr=${transformStr}`;
      }
    }

    return url;
  },
};
