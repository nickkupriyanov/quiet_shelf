import Link from "next/link";
import {
  IconBooks,
  IconChartBar,
  IconHome,
  IconPlus,
} from "@tabler/icons-react";

const navItems = [
  { href: "/", label: "Главная", icon: IconHome },
  { href: "/#rhythm", label: "Ритм", icon: IconChartBar },
  { href: "/library", label: "Библиотека", icon: IconBooks },
  { href: "/library?add=1", label: "Добавить", icon: IconPlus },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-page p-2 text-primary sm:p-4">
      <div className="mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-[1680px] flex-col rounded-[20px] border border-border-soft bg-shell shadow-[0_22px_70px_rgba(36,50,65,0.12)] sm:min-h-[calc(100dvh-2rem)]">
        <header className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-6">
          <Link
            href="/"
            className="flex min-h-11 items-center rounded-full px-2 font-mono text-sm font-semibold text-primary"
            aria-label="QuietShelf, главная"
          >
            QuietShelf
          </Link>
          <nav className="hidden items-center gap-1 rounded-full bg-soft/80 p-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-secondary transition hover:bg-card hover:text-primary"
              >
                <item.icon size={18} stroke={1.8} aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/library?add=1"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-[#f8f7f2] shadow-[0_10px_24px_rgba(36,50,65,0.18)] transition hover:translate-y-[-1px]"
          >
            <IconPlus size={18} stroke={2} aria-hidden="true" />
            <span className="sr-only sm:not-sr-only sm:ml-2">Добавить</span>
          </Link>
        </header>

        <main className="flex-1 px-3 pb-24 pt-2 sm:px-5 md:pb-5 lg:px-6">{children}</main>

        <nav
          className="fixed inset-x-3 bottom-3 z-20 grid grid-cols-4 rounded-full border border-border-soft bg-card/95 p-1 shadow-[0_14px_38px_rgba(36,50,65,0.18)] backdrop-blur md:hidden"
          aria-label="Основная навигация"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-medium text-secondary transition hover:bg-soft hover:text-primary"
            >
              <item.icon size={19} stroke={1.8} aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
