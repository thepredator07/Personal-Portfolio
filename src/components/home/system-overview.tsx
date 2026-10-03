import type { ReactNode } from "react";

/**
 * A composite map of the kinds of systems in my day-to-day work.
 * Every box is a technology or system named on my resume.
 */

function Box({ label, detail, tone = "default" }: { label: string; detail?: string; tone?: "default" | "accent" | "stream" }) {
  const border = { default: "border-line-strong", accent: "border-accent/40", stream: "border-info/45" }[tone];
  return (
    <div className={`rounded border bg-raised px-3 py-2.5 text-center ${border}`}>
      <p className="text-[0.85rem] leading-snug text-fg">{label}</p>
      {detail ? <p className="mt-0.5 font-mono text-[0.66rem] leading-snug text-muted">{detail}</p> : null}
    </div>
  );
}

function Tier({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-[7.5rem_1fr] md:gap-5">
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-dim md:text-right">{name}</p>
      <div>{children}</div>
    </div>
  );
}

function Wire() {
  return (
    <div aria-hidden className="grid grid-cols-1 md:grid-cols-[7.5rem_1fr] md:gap-5">
      <span className="hidden md:block" />
      <div className="relative mx-auto h-7 w-px overflow-hidden bg-line-strong">
        <span className="absolute left-0 top-0 h-2 w-px animate-flow bg-accent motion-reduce:hidden" />
      </div>
    </div>
  );
}

export function SystemOverview() {
  return (
    <figure>
      <div
        role="img"
        aria-label="Architecture overview: clients and external APIs call Spring Boot REST APIs; behind them, services for validation, orchestration, DR configuration and replication state publish events to Kafka, which also feeds observability; long-running steps complete through async callbacks and Camunda workflows. Data lives in MongoDB, Oracle/PostgreSQL and Redis. Everything runs on Kubernetes and Docker on Azure, with Commvault for disaster recovery."
        className="rounded-md border border-line bg-sunken p-4 md:p-8"
      >
        <div aria-hidden className="flex flex-col">
          <Tier name="Ingress">
            <div className="grid grid-cols-2 gap-2 md:mx-auto md:max-w-md">
              <Box label="DR console" detail="customers" />
              <Box label="External systems" detail="callbacks · Camunda" />
            </div>
          </Tier>
          <Wire />
          <Tier name="API">
            <div className="md:mx-auto md:max-w-md">
              <Box label="Spring Boot REST APIs" detail="Spring Security · OpenFeign" tone="accent" />
            </div>
          </Tier>
          <Wire />
          <Tier name="Services">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              <Box label="Validation" detail="rule-driven · parallel" tone="accent" />
              <Box label="Orchestration" detail="sync · onboarding" tone="accent" />
              <Box label="DR config" detail="discovery · mapping" tone="accent" />
              <Box label="Replication state" detail="idempotent publish" tone="accent" />
            </div>
          </Tier>
          <Wire />
          <Tier name="Events">
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 md:mx-auto md:max-w-xl">
              <Box label="Apache Kafka" detail="events · replication state" tone="stream" />
              <span className="font-mono text-xs text-dim">⇢</span>
              <Box label="Observability" detail="dual sink" />
            </div>
          </Tier>
          <Wire />
          <Tier name="Data">
            <div className="grid grid-cols-3 gap-2 md:mx-auto md:max-w-xl">
              <Box label="MongoDB" detail="clusters" />
              <Box label="Oracle · Postgres" detail="JDBC batch" />
              <Box label="Redis" />
            </div>
          </Tier>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-[7.5rem_1fr] md:gap-5">
            <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-dim md:mb-0 md:pt-2.5 md:text-right">Platform</p>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 rounded border border-dashed border-line-strong px-3 py-2.5 font-mono text-[0.72rem] text-muted">
              <span>Kubernetes</span>
              <span className="text-line-strong">·</span>
              <span>Docker</span>
              <span className="text-line-strong">·</span>
              <span>Azure</span>
              <span className="text-line-strong">·</span>
              <span>Commvault (DR)</span>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 font-mono text-[0.72rem] text-dim">
        A composite of the systems I work on — the shape of the stack, not one specific production topology.
      </figcaption>
    </figure>
  );
}
