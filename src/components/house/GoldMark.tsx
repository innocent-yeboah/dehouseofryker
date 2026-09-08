type GoldMarkProps = {
  className?: string;
  showWord?: boolean;
};

export function GoldMark({ className = "", showWord = true }: GoldMarkProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 48 48"
        className="h-9 w-9 shrink-0"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="42" height="42" fill="none" stroke="#C6A15B" strokeWidth="1.5" />
        <path
          d="M24 10 L34 38 H29.2 L26.8 31 H21.2 L18.8 38 H14 Z M22.4 27 H25.6 L24 22 Z"
          fill="#C6A15B"
        />
      </svg>
      {showWord ? (
        <span className="font-serif text-lg font-semibold tracking-wide text-ink sm:text-xl">
          De House of Ryker
        </span>
      ) : null}
    </span>
  );
}
