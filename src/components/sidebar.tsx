"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Command, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { sections } from "@/lib/nav";
import { openPalette, useActiveSection } from "./use-active-section";
import { StatusDot } from "./ui";

const ids = sections.map((s) => s.id);

function useNavState() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const active = useActiveSection(ids, onHome);
  const current = onHome
    ? active
    : pathname.startsWith("/projects")
      ? "projects"
      : pathname.startsWith("/notes")
        ? "notes"
        : null;
  return { onHome, current };
}

function NavList({ current, onNavigate }: { current: string | null; onNavigate?: () => void }) {
  return (
    <ol className="flex flex-col gap-0.5">
      {sections.map((s, i) => {
        const isActive = current === s.id;
        return (
          <li key={s.id}>
            <Link
              href={s.href}
              onClick={onNavigate}
              aria-current={isActive ? "location" : undefined}
              className={`group flex items-center gap-3 rounded px-2 py-1.5 font-mono text-[0.78rem] transition-colors ${
                isActive ? "bg-raised text-fg" : "text-dim hover:text-fg"
              }`}
            >
              <span className={isActive ? "text-accent" : "text-dim group-hover:text-muted"}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="uppercase tracking-[0.08em]">{s.label}</span>
              {isActive ? <span aria-hidden className="ml-auto h-px w-3 bg-accent" /> : null}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

function PaletteButton({ compact = false }: { compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={openPalette}
      className="flex h-8 items-center gap-2 rounded border border-line px-2.5 font-mono text-[0.72rem] text-dim transition-colors hover:border-line-strong hover:text-fg"
      aria-label="Open command palette"
    >
      <Command className="size-3.5" aria-hidden />
      {compact ? null : (
        <>
          <span>Go to…</span>
          <kbd className="ml-auto rounded border border-line px-1 text-[0.65rem]">Ctrl K</kbd>
        </>
      )}
    </button>
  );
}

export function Sidebar({ initials, name, role }: { initials: string; name: string; role: string }) {
  const { current } = useNavState();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-52 flex-col border-r border-line bg-bg px-4 py-6 lg:flex">
      <Link href="/" className="flex items-center gap-3 px-2" aria-label={`${name} — home`}>
        <span className="grid size-8 place-items-center rounded border border-line-strong font-mono text-xs font-semibold text-fg">
          {initials}
        </span>
        <span className="leading-tight">
          <span className="block text-[0.82rem] font-medium text-fg">{name}</span>
          <span className="block font-mono text-[0.68rem] text-dim">{role.toLowerCase()}</span>
        </span>
      </Link>

      <nav aria-label="Sections" className="mt-10">
        <NavList current={current} />
      </nav>

      <div className="mt-auto flex flex-col gap-3 px-2">
        <PaletteButton />
        <p className="flex items-center gap-2 font-mono text-[0.68rem] text-dim">
          <StatusDot tone="ok" pulse />
          all systems nominal
        </p>
      </div>
    </aside>
  );
}

export function MobileNav({ initials, name }: { initials: string; name: string }) {
  const { current } = useNavState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const currentLabel = sections.find((s) => s.id === current)?.label.toLowerCase() ?? "";

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-line bg-bg/90 px-4 backdrop-blur lg:hidden">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${name} — home`}>
          <span className="grid size-7 place-items-center rounded border border-line-strong font-mono text-[0.7rem] font-semibold">
            {initials}
          </span>
          <span className="font-mono text-[0.75rem] text-dim">
            ~/{currentLabel}
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <PaletteButton compact />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-8 place-items-center rounded border border-line text-muted hover:text-fg"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 top-14 bottom-0 z-40 overflow-y-auto border-t border-line bg-bg px-4 py-6 lg:hidden"
          >
            <nav aria-label="Sections">
              <NavList current={current} onNavigate={() => setOpen(false)} />
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
