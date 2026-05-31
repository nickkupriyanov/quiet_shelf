import Link from "next/link";
import {
  IconBooks,
  IconChartBar,
  IconHome,
  IconPlus,
} from "@tabler/icons-react";

const navItems = [
  { href: "/", label: "Главная", icon: IconHome },
  { href: "/library", label: "Библиотека", icon: IconBooks },
  { href: "/library?add=1", label: "Добавить", icon: IconPlus },
];

const desktopNavItems = [
  { href: "/", label: "Главная", icon: IconHome },
  { href: "/#rhythm", label: "Ритм", icon: IconChartBar },
  { href: "/library", label: "Библиотека", icon: IconBooks },
  { href: "/library?add=1", label: "Добавить", icon: IconPlus },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh p-2 text-primary sm:p-[18px]">
      <div className="quiet-gradient-panel mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-[1680px] flex-col overflow-hidden rounded-[24px] sm:min-h-[calc(100dvh-36px)]">
        <header className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 sm:px-[18px]">
          <Link
            href="/"
            className="flex min-h-10 items-center rounded-full px-2 font-mono text-sm font-black text-primary"
            aria-label="QuietShelf, главная"
          >
            QuietShelf
          </Link>
          <nav className="hidden min-w-0 justify-center gap-2 md:flex">
            <div className="flex min-w-0 items-center gap-1 rounded-full bg-soft/85 p-1">
            {desktopNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-secondary transition hover:bg-card hover:text-primary"
              >
                <item.icon size={18} stroke={1.8} aria-hidden="true" />
                {item.label}
              </Link>
            ))}
            </div>
          </nav>
          <Link
            href="/library?add=1"
            className="quiet-cta inline-flex min-h-11 w-11 items-center justify-center rounded-full px-0 text-sm font-bold transition hover:translate-y-[-1px] sm:w-auto sm:px-4"
          >
            <IconPlus size={18} stroke={2} aria-hidden="true" />
            <span className="sr-only sm:not-sr-only sm:ml-2">Добавить</span>
          </Link>
        </header>

        <main className="flex-1 px-3 pb-24 pt-1 sm:px-[18px] md:pb-[18px]">{children}</main>

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
