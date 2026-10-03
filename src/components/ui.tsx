import type { ReactNode } from "react";
import type { Metric } from "@content/types";

/** Section heading styled like a path in an internal tool: `03  /experience` */
export function SectionHeader({
  index,
  path,
  title,
  lead,
  aside,
  titleId,
}: {
  titleId?: string;
  index: string;
  path: string;
  title: string;
  lead?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="font-mono text-xs text-dim">
          <span className="text-accent">{index}</span>
          <span className="mx-2 text-line-strong">/</span>
          {path}
        </p>
        <h2 id={titleId} className="mt-3 text-2xl font-semibold tracking-tight text-fg md:text-[1.75rem]">{title}</h2>
        {lead ? <p className="mt-3 text-[0.975rem] leading-relaxed text-muted">{lead}</p> : null}
      </div>
      {aside}
    </header>
  );
}

export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-dim ${className}`}>{children}</p>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded border border-line bg-raised px-1.5 py-0.5 font-mono text-[0.72rem] text-muted">
      {children}
    </span>
  );
}

export function TagList({ items, label }: { items: string[]; label?: string }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={label}>
      {items.map((t) => (
        <li key={t}>
          <Tag>{t}</Tag>
        </li>
      ))}
    </ul>
  );
}

export function StatusDot({ tone = "ok", pulse = false }: { tone?: "ok" | "warn" | "fail" | "idle"; pulse?: boolean }) {
  const color = { ok: "bg-accent", warn: "bg-warn", fail: "bg-fail", idle: "bg-dim" }[tone];
  return (
    <span
      aria-hidden
      className={`inline-block size-1.5 shrink-0 rounded-full ${color} ${pulse ? "animate-pulse-soft" : ""}`}
    />
  );
}

export function MetricValue({ metric, size = "md" }: { metric: Metric; size?: "sm" | "md" | "lg" }) {
  const arrow = metric.direction === "up" ? "↑" : metric.direction === "down" ? "↓" : null;
  const valueSize = { sm: "text-lg", md: "text-2xl", lg: "text-[1.75rem] md:text-3xl" }[size];
  return (
    <div>
      <p className={`font-mono font-medium tracking-tight text-fg ${valueSize}`}>
        {metric.value}
        {arrow ? (
          <span className="ml-1 text-accent" aria-hidden>
            {arrow}
          </span>
        ) : null}
      </p>
      <p className="mt-1 text-[0.8rem] leading-snug text-muted">
        {arrow ? <span className="sr-only">{metric.direction === "up" ? "increase in " : "reduction in "}</span> : null}
        {metric.label}
        {metric.source ? <span className="ml-1 font-mono text-[0.7rem] text-dim">· {metric.source}</span> : null}
      </p>
    </div>
  );
}

/** Row of metrics separated by hairlines. */
export function MetricGrid({ metrics, size = "md", cols = 4 }: { metrics: Metric[]; size?: "sm" | "md" | "lg"; cols?: 2 | 3 | 4 | 5 }) {
  const colClass = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-3 lg:grid-cols-5" }[cols];
  return (
    <dl className={`grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line [&>*:last-child:nth-child(odd)]:col-span-2 sm:[&>*:last-child:nth-child(odd)]:col-span-1 ${colClass}`}>
      {metrics.map((m) => (
        <div key={m.label} className="bg-bg p-4">
          <dt className="sr-only">{m.label}</dt>
          <dd>
            <MetricValue metric={m} size={size} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "secondary",
  external,
  download,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  download?: boolean;
}) {
  const styles = {
    primary: "bg-fg text-bg hover:bg-white",
    secondary: "border border-line-strong text-fg hover:border-dim hover:bg-raised",
    ghost: "text-muted hover:text-fg",
  }[variant];
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: "" } : {})}
      className={`inline-flex h-9 items-center gap-2 rounded px-3.5 font-mono text-[0.8rem] transition-colors ${styles}`}
    >
      {children}
    </a>
  );
}
