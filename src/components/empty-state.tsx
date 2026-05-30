import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

type EmptyStateProps = {
  title?: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({
  title = "Начните с книги на прикроватной тумбочке.",
  actionHref = "/library?add=1",
  actionLabel = "Добавить книгу",
}: EmptyStateProps) {
  return (
    <section className="rounded-[18px] border border-dashed border-border-soft bg-card p-8 text-center">
      <div className="mx-auto mb-5 grid h-24 w-28 place-items-end rounded-b-lg rounded-t-sm bg-lilac px-4 pb-4 shadow-[0_14px_28px_rgba(36,50,65,0.10)]">
        <div className="h-16 w-10 rounded-md bg-card shadow-sm" />
      </div>
      <h2 className="mx-auto max-w-sm text-2xl font-bold leading-tight text-primary">
        {title}
      </h2>
      <Link
        href={actionHref}
        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-[#f8f7f2]"
      >
        <IconPlus size={18} aria-hidden="true" />
        {actionLabel}
      </Link>
    </section>
  );
}
