import { Fragment } from "react";
import type { ArchNode, ArchitectureFlow } from "@content/types";

const kindStyle: Record<NonNullable<ArchNode["kind"]>, { tag: string; className: string }> = {
  client: { tag: "client", className: "border-line-strong" },
  service: { tag: "svc", className: "border-accent/40" },
  queue: { tag: "stream", className: "border-info/50" },
  store: { tag: "store", className: "border-line-strong" },
  external: { tag: "ext", className: "border-dashed border-line-strong" },
  infra: { tag: "infra", className: "border-line-strong" },
};

function Node({ node }: { node: ArchNode }) {
  const k = kindStyle[node.kind ?? "service"];
  return (
    <div className={`relative rounded border bg-raised px-3 py-2.5 ${k.className}`}>
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-dim">{k.tag}</p>
      <p className="mt-0.5 text-[0.85rem] leading-snug text-fg">{node.label}</p>
      {node.detail ? <p className="mt-0.5 font-mono text-[0.68rem] leading-snug text-muted">{node.detail}</p> : null}
    </div>
  );
}

/**
 * Data-driven architecture diagram: lanes flow left→right on wide screens and
 * top→bottom on narrow ones, so it stays readable on a phone.
 */
export function ArchFlow({ flow, compact = false }: { flow: ArchitectureFlow; compact?: boolean }) {
  const cols = flow.lanes.length;
  return (
    <figure>
      <div
        className={`grid items-center gap-2 rounded-md border border-line bg-sunken ${compact ? "p-3" : "p-4 md:p-6"} md:gap-3`}
        style={{ ["--cols" as string]: cols }}
      >
        <div className="flex flex-col items-stretch gap-2 md:grid md:grid-cols-[repeat(var(--cols),minmax(0,1fr))] md:items-center md:gap-0">
          {flow.lanes.map((lane, i) => (
            <Fragment key={i}>
              <div className="relative flex flex-col gap-2 md:px-3">
                {lane.map((n) => (
                  <Node key={n.id} node={n} />
                ))}
                {i < cols - 1 ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 -right-1.5 hidden -translate-y-1/2 font-mono text-xs text-dim md:block"
                  >
                    →
                  </span>
                ) : null}
              </div>
              {i < cols - 1 ? (
                <span aria-hidden className="py-0.5 text-center font-mono text-xs text-dim md:hidden">
                  ↓
                </span>
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
      {flow.caption ? <figcaption className="mt-2.5 font-mono text-[0.72rem] text-dim">{flow.caption}</figcaption> : null}
    </figure>
  );
}
