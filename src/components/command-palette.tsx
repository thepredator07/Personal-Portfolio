"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export type PaletteItem = {
  id: string;
  label: string;
  group: "Navigate" | "Projects" | "Notes" | "Links";
  href: string;
  hint?: string;
  /** extra search terms, not displayed */
  keywords?: string;
  external?: boolean;
};

/**
 * ⌘K / Ctrl+K command palette. No dependencies — a filtered listbox in a dialog.
 * Items are built on the server from /content and passed in.
 */
export function CommandPalette({ items }: { items: PaletteItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
    returnFocus.current?.focus?.();
  }, []);

  const show = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else show();
      }
    };
    const onOpen = () => show();
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, [open, close, show]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => `${i.label} ${i.group} ${i.hint ?? ""} ${i.keywords ?? ""}`.toLowerCase().includes(q));
  }, [items, query]);

  const run = useCallback(
    (item: PaletteItem) => {
      close();
      if (item.external) window.open(item.href, "_blank", "noopener,noreferrer");
      else if (item.href.endsWith(".pdf")) window.open(item.href, "_blank");
      else router.push(item.href);
    },
    [close, router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[index]) {
      e.preventDefault();
      run(results[index]);
    } else if (e.key === "Tab") {
      // keep focus inside the dialog
      e.preventDefault();
    }
  };

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [index]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          onMouseDown={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.14 }}
            className="w-full max-w-lg overflow-hidden rounded-lg border border-line-strong bg-raised shadow-2xl shadow-black/50"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-4 text-dim" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
                placeholder="Jump to a section, project or note…"
                className="h-12 w-full bg-transparent font-mono text-sm text-fg placeholder:text-dim focus:outline-none"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={results[index] ? `palette-${results[index].id}` : undefined}
                aria-autocomplete="list"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[0.65rem] text-dim">esc</kbd>
            </div>
            <ul ref={listRef} id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto py-2">
              {results.length === 0 ? (
                <li className="px-4 py-6 text-center font-mono text-xs text-dim">command not found: {query}</li>
              ) : null}
              {results.map((item, i) => {
                const header = results[i - 1]?.group !== item.group ? item.group : null;
                const active = i === index;
                return (
                  <li key={item.id} role="presentation">
                    {header ? (
                      <p className="px-4 pt-3 pb-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-dim">{header}</p>
                    ) : null}
                    <div
                      id={`palette-${item.id}`}
                      role="option"
                      aria-selected={active}
                      data-index={i}
                      onMouseMove={() => setIndex(i)}
                      onClick={() => run(item)}
                      className={`mx-2 flex cursor-pointer items-center gap-3 rounded px-2.5 py-2 text-sm ${
                        active ? "bg-line text-fg" : "text-muted"
                      }`}
                    >
                      <span className="font-mono text-[0.7rem] text-dim">{active ? "›" : " "}</span>
                      <span className="truncate">{item.label}</span>
                      {item.hint ? <span className="ml-auto truncate font-mono text-[0.68rem] text-dim">{item.hint}</span> : null}
                      {active ? <CornerDownLeft className="size-3.5 shrink-0 text-dim" aria-hidden /> : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
