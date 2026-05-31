type BookCoverProps = {
  title: string;
  author?: string;
  coverUrl?: string;
  priority?: boolean;
};

export function BookCover({ title, author, coverUrl }: BookCoverProps) {
  const alt = author ? `Обложка книги ${title}, ${author}` : `Обложка книги ${title}`;

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
      className="flex aspect-[2/3] flex-col justify-between rounded-lg border border-[#d9cee9] bg-[linear-gradient(145deg,#ede5ff_0%,#fffefa_100%)] p-4 shadow-[0_18px_34px_rgba(36,50,65,0.14)]"
      role="img"
      aria-label={`Нет обложки для книги ${title}`}
    >
      <span className="font-mono text-xs text-secondary">QuietShelf</span>
      <div>
        <p className="line-clamp-4 text-lg font-bold leading-tight text-primary">
          {title}
        </p>
        {author ? (
          <p className="mt-3 line-clamp-2 text-sm leading-5 text-secondary">
            {author}
          </p>
        ) : null}
      </div>
    </div>
  );
}
