type GoldMarkProps = {
  className?: string;
  showWord?: boolean;
};

export function GoldMark({ className = "", showWord = true }: GoldMarkProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {/* Canva lockup already includes the house name under the DHR monogram. */}
      <img
        src="/brand/dhr-monogram.png"
        alt={showWord ? "De House of Ryker" : ""}
        width={160}
        height={160}
        className="h-12 w-auto sm:h-14"
      />
    </span>
  );
}
