import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  /** Intrinsic pixel size from Payload; 0 when unknown. */
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * A full-width, auto-height image.
 *
 * Uses next/image — AVIF/WebP srcset, lazy-loading, and a reserved aspect
 * ratio (no layout shift) — whenever Payload reports the intrinsic size.
 * When it doesn't, we fall back to a plain <img>: inventing an aspect ratio
 * for next/image would letterbox or stretch the picture, and a correct image
 * beats an optimized wrong one.
 */
export function ResponsiveMedia({
  src,
  alt,
  width,
  height,
  className = "",
  sizes = "(min-width: 1100px) 1100px, 100vw",
  priority = false,
}: Props) {
  if (!src) return null;

  if (width > 0 && height > 0) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={`w-full h-auto ${className}`}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`w-full ${className}`}
    />
  );
}
