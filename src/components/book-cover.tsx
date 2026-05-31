type BookCoverProps = {
  title: string;
  author?: string;
  coverUrl?: string;
  priority?: boolean;
  size?: "hero" | "tile" | "thumb";
};

const fallbackThemes = [
  "bg-[linear-gradient(145deg,#7a88b8,#ece2cf_52%,#bd7f75)]",
  "bg-[linear-gradient(145deg,#435b6e,#bfd8c4_56%,#eac99b)]",
  "bg-[linear-gradient(145deg,#f0c66e,#e3a691_52%,#856b95)]",
  "bg-[linear-gradient(145deg,#6b789b,#ede5ff_58%,#7d9b77)]",
];

const sizeClasses = {
  hero: "rounded-xl p-4",
  tile: "rounded-xl p-3",
  thumb: "rounded-lg p-2.5",
};

export function BookCover({ title, author, coverUrl, size = "tile" }: BookCoverProps) {
  const alt = author ? `Обложка книги ${title}, ${author}` : `Обложка книги ${title}`;
  const theme = fallbackThemes[title.length % fallbackThemes.length];

  if (coverUrl) {
    return (
      <div className="aspect-[2/3] overflow-hidden rounded-lg bg-soft shadow-[0_18px_34px_rgba(36,50,65,0.18)] ring-1 ring-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={[
        "relative flex aspect-[2/3] flex-col justify-between overflow-hidden border border-black/10 text-[#fffefa] shadow-[0_20px_38px_rgba(42,48,57,0.20)]",
        theme,
        sizeClasses[size],
      ].join(" ")}
      role="img"
      aria-label={`Нет обложки для книги ${title}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.35),transparent_28%)]" />
      <span className="relative font-mono text-xs font-bold text-white/80">QuietShelf</span>
      <div>
        <p className="relative line-clamp-4 text-lg font-black leading-tight drop-shadow-sm">
          {title}
        </p>
        {author ? (
          <p className="relative mt-3 line-clamp-2 text-sm font-semibold leading-5 text-white/82">
            {author}
          </p>
        ) : null}
      </div>
    </div>
  );
}
