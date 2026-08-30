import NextImage from "next/image";

export function Image({ src, alt = "", width = 1200, height = 900, sizes = "100vw", ...props }) {
  if (!src) return null;
  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      {...props}
    />
  );
}
