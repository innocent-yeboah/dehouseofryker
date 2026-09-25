type GoldMarkProps = {
  className?: string;
  imgClassName?: string;
  showWord?: boolean;
};

export function GoldMark({ className = "", imgClassName = "", showWord = true }: GoldMarkProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src="/brand/dhr-monogram.png"
        alt={showWord ? "De House of Ryker" : ""}
        width={160}
        height={160}
        className={imgClassName || "h-10 w-auto max-w-[7.5rem] object-contain sm:h-14 sm:max-w-[10rem]"}
      />
    </span>
  );
}
