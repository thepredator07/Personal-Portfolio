"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@content/types";
import { ArchFlow } from "../arch-flow";
import { Label, MetricGrid, StatusDot, TagList } from "../ui";

type Filter = "all" | Project["kind"];

const kindLabel: Record<Project["kind"], string> = {
  professional: "professional",
  personal: "personal",
  experiment: "experiment",
  learning: "learning",
};

function Preview({ p }: { p: Project }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="flex items-center gap-2 font-mono text-[0.72rem] text-dim">
          <StatusDot tone={p.status === "archived" ? "idle" : p.status === "in-progress" ? "warn" : "ok"} />
          {p.status} · {p.organisation ?? kindLabel[p.kind]} {p.period ? `· ${p.period}` : ""}
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-fg">{p.title}</h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{p.description}</p>
      </div>
      {p.problem?.body ? (
        <div>
          <Label>Problem</Label>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{p.problem.body}</p>
        </div>
      ) : null}
      {p.architecture ? <ArchFlow flow={p.architecture} compact /> : null}
      {p.results?.length ? <MetricGrid metrics={p.results} size="sm" cols={p.results.length >= 3 ? 3 : 2} /> : null}
      <TagList items={p.technologies} label="Technologies" />
      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-5 font-mono text-[0.8rem]">
        <Link href={`/projects/${p.slug}/`} className="inline-flex items-center gap-1.5 text-accent hover:underline">
          Read the case study <ArrowRight className="size-3.5" aria-hidden />
        </Link>
        {p.github ? (
          <a href={p.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted hover:text-fg">
            source <ArrowUpRight className="size-3" aria-hidden />
          </a>
        ) : null}
        {p.demo ? (
          <a href={p.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted hover:text-fg">
            demo <ArrowUpRight className="size-3" aria-hidden />
          </a>
        ) : null}
        {!p.github && !p.demo && p.linkNote ? <span className="text-dim">{p.linkNote}</span> : null}
      </div>
    </div>
  );
}

/**
 * Two-pane explorer on desktop (index + preview), accordion on mobile.
 */
export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const kinds = useMemo(() => Array.from(new Set(projects.map((p) => p.kind))), [projects]);
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? projects : projects.filter((p) => p.kind === filter);
  const [selected, setSelected] = useState<string>(projects[0]?.slug ?? "");
  const [openMobile, setOpenMobile] = useState<string | null>(null);
  const current = visible.find((p) => p.slug === selected) ?? visible[0];

  return (
    <div>
      {kinds.length > 1 ? (
        <div role="group" aria-label="Filter projects" className="mb-6 flex flex-wrap gap-1.5 font-mono text-[0.75rem]">
          {(["all", ...kinds] as Filter[]).map((k) => {
            const count = k === "all" ? projects.length : projects.filter((p) => p.kind === k).length;
            const active = filter === k;
            return (
              <button
                key={k}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(k)}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  active ? "border-line-strong bg-raised text-fg" : "border-transparent text-dim hover:text-fg"
                }`}
              >
                {k} <span className="text-dim">{count}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-10">
        {/* Index */}
        <ol className="border-t border-line">
          {visible.map((p) => {
            const n = projects.indexOf(p) + 1;
            const isSel = current?.slug === p.slug;
            const isOpen = openMobile === p.slug;
            return (
              <li key={p.slug} className="border-b border-line">
                {/* Desktop: select into preview pane */}
                <button
                  type="button"
                  onClick={() => setSelected(p.slug)}
                  aria-pressed={isSel}
                  className={`group hidden w-full items-baseline gap-4 py-3.5 text-left transition-colors lg:flex ${
                    isSel ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  <span className={`font-mono text-xs ${isSel ? "text-accent" : "text-dim"}`}>{String(n).padStart(2, "0")}</span>
                  <span className="flex-1">
                    <span className="block text-[0.95rem]">{p.title}</span>
                    <span className="mt-0.5 block font-mono text-[0.7rem] text-dim">
                      {p.category} · {kindLabel[p.kind]}
                    </span>
                  </span>
                  <span aria-hidden className={`font-mono text-xs transition-opacity ${isSel ? "text-accent opacity-100" : "opacity-0"}`}>
                    ›
                  </span>
                </button>

                {/* Mobile: accordion */}
                <button
                  type="button"
                  onClick={() => setOpenMobile(isOpen ? null : p.slug)}
                  aria-expanded={isOpen}
                  aria-controls={`proj-panel-${p.slug}`}
                  className="flex w-full items-baseline gap-4 py-4 text-left lg:hidden"
                >
                  <span className="font-mono text-xs text-dim">{String(n).padStart(2, "0")}</span>
                  <span className="flex-1">
                    <span className="block text-[0.98rem] text-fg">{p.title}</span>
                    <span className="mt-0.5 block font-mono text-[0.7rem] text-dim">
                      {p.category} · {kindLabel[p.kind]}
                    </span>
                  </span>
                  <span aria-hidden className={`font-mono text-sm text-dim transition-transform ${isOpen ? "rotate-90" : ""}`}>
                    ›
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={`proj-panel-${p.slug}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden lg:hidden"
                    >
                      <div className="pb-6">
                        <Preview p={p} />
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>

        {/* Preview pane (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-6 rounded-md border border-line p-6">
            <AnimatePresence mode="wait" initial={false}>
              {current ? (
                <motion.div
                  key={current.slug}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                  aria-live="polite"
                >
                  <Preview p={current} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
