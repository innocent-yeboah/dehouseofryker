import Image from "next/image";

type ProductImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
};

/** Studio product photo from `public/`. Parent must be `relative` and sized. */
export function ProductImage({ src, alt, sizes, priority = false }: ProductImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-contain"
    />
  );
}
