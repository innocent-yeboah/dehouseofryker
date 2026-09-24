import Image from "next/image";

type ProductImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /**
   * Listing tiles: scale the studio PNG 1.5× inside an overflow-hidden well.
   * The source frames are 16:9 with wide white margins, so contain alone leaves
   * the product small in a square card. PDP leaves this off.
   */
  zoom?: boolean;
};

/** Studio product photo from `public/`. Parent must be `relative`, sized, and `overflow-hidden` when `zoom` is set. */
export function ProductImage({ src, alt, sizes, priority = false, zoom = false }: ProductImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={zoom ? "origin-center scale-150 object-contain" : "object-contain"}
    />
  );
}
