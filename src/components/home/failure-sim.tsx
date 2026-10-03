"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play, RotateCcw, StepForward } from "lucide-react";

/**
 * Failure → Recovery visualisation.
 *
 * A conceptual walk through a site-level DR failover:
 *   nominal → primary fails → health checks detect it → failover event is
 *   published → DR site is promoted → traffic is served from the DR site.
 *
 * Nothing here talks to a real system. It's a diagram with a timeline.
 */

type Phase = 0 | 1 | 2 | 3 | 4 | 5;

const PHASES: { key: string; title: string; status: string; tone: Tone; log: { t: string; level: Level; msg: string }[] }[] = [
  {
    key: "nominal",
    title: "Nominal",
    status: "NOMINAL",
    tone: "ok",
    log: [{ t: "t+0.0s", level: "info", msg: "primary serving traffic · replication to DR site healthy" }],
  },
  {
    key: "failure",
    title: "Failure",
    status: "DEGRADED",
    tone: "fail",
    log: [{ t: "t+0.4s", level: "error", msg: "service-a@primary: unreachable · requests failing" }],
  },
  {
    key: "detect",
    title: "Detection",
    status: "DEGRADED",
    tone: "warn",
    log: [
      { t: "t+3.0s", level: "warn", msg: "health-check: 3/3 heartbeats missed from primary" },
      { t: "t+3.1s", level: "warn", msg: "primary marked DOWN" },
    ],
  },
  {
    key: "event",
    title: "Event",
    status: "FAILING OVER",
    tone: "warn",
    log: [{ t: "t+3.2s", level: "info", msg: "kafka ← dr.failover.initiated {site: primary → dr}" }],
  },
  {
    key: "promote",
    title: "Recovery",
    status: "FAILING OVER",
    tone: "warn",
    log: [
      { t: "t+4.0s", level: "info", msg: "dr-site: replica promoted · service-b starting" },
      { t: "t+5.5s", level: "info", msg: "service-b@dr: readiness OK" },
    ],
  },
  {
    key: "recovered",
    title: "Recovered",
    status: "RECOVERED",
    tone: "ok",
    log: [
      { t: "t+5.6s", level: "info", msg: "traffic routed → dr site" },
      { t: "t+5.7s", level: "ok", msg: "kafka ← dr.failover.completed · serving from DR site" },
    ],
  },
];

type Tone = "ok" | "warn" | "fail" | "idle";
type Level = "info" | "warn" | "error" | "ok";

const toneText: Record<Tone, string> = { ok: "text-accent", warn: "text-warn", fail: "text-fail", idle: "text-dim" };
const toneBorder: Record<Tone, string> = {
  ok: "border-accent/50",
  warn: "border-warn/60",
  fail: "border-fail/60",
  idle: "border-line-strong",
};
const toneDot: Record<Tone, string> = { ok: "bg-accent", warn: "bg-warn", fail: "bg-fail", idle: "bg-dim" };
const levelText: Record<Level, string> = { info: "text-muted", warn: "text-warn", error: "text-fail", ok: "text-accent" };

function Node({ label, state, tone, sub }: { label: string; state: string; tone: Tone; sub?: ReactNode }) {
  return (
    <motion.div
      layout
      className={`relative rounded border bg-raised px-3 py-2.5 transition-colors duration-300 ${toneBorder[tone]}`}
    >
      <div className="flex flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
        <p className="text-[0.85rem] leading-snug text-fg">{label}</p>
        <span className={`flex shrink-0 items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-wider ${toneText[tone]}`}>
          <span className={`size-1.5 rounded-full ${toneDot[tone]} ${tone === "warn" ? "animate-pulse-soft" : ""}`} />
          {state}
        </span>
      </div>
      {sub ? <p className="mt-1 font-mono text-[0.66rem] text-dim">{sub}</p> : null}
    </motion.div>
  );
}

function Wire({ active, broken = false, label }: { active: boolean; broken?: boolean; label?: string }) {
  return (
    <div className="flex flex-col items-center py-1" aria-hidden>
      <div
        className={`relative h-6 w-px overflow-hidden ${
          broken ? "bg-fail/60" : active ? "bg-accent/60" : "border-l border-dashed border-line-strong bg-transparent"
        }`}
      >
        {active && !broken ? <span className="absolute left-0 top-0 h-2 w-px animate-flow bg-accent motion-reduce:hidden" /> : null}
      </div>
      <span className={`h-3 font-mono text-[0.6rem] leading-3 ${broken ? "text-fail" : "text-dim"}`}>{label ?? ""}</span>
    </div>
  );
}

export function FailureSim() {
  const [phase, setPhase] = useState<Phase>(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const stop = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setRunning(false);
  }, []);

  const run = useCallback(() => {
    stop();
    setPhase(0);
    setRunning(true);
  }, [stop]);

  // Advance automatically while running
  useEffect(() => {
    if (!running || phase >= 5) return;
    timer.current = window.setTimeout(() => {
      const next = Math.min(phase + 1, 5) as Phase;
      setPhase(next);
      if (next === 5) setRunning(false);
    }, phase === 0 ? 500 : 1500);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [running, phase]);

  // The terminal's `failover` command triggers this.
  useEffect(() => {
    const onRun = () => run();
    window.addEventListener("sim:run", onRun);
    return () => window.removeEventListener("sim:run", onRun);
  }, [run]);

  const p = PHASES[phase];
  const primaryDown = phase >= 1;
  const detected = phase >= 2;
  const eventSent = phase >= 3;
  const promoting = phase === 4;
  const recovered = phase === 5;
  const log = PHASES.slice(0, phase + 1).flatMap((x) => x.log);

  return (
    <div ref={rootRef} className="overflow-hidden rounded-md border border-line">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line bg-raised px-4 py-3">
        <p className="font-mono text-[0.72rem] text-dim">
          status:{" "}
          <span className={`font-medium ${toneText[p.tone]}`} aria-live="polite">
            {p.status}
          </span>
        </p>
        <ol className="hidden items-center gap-1 font-mono text-[0.65rem] md:flex" aria-label="Phases">
          {PHASES.map((x, i) => (
            <li key={x.key} className="flex items-center gap-1">
              <span className={i <= phase ? (i === phase ? "text-fg" : "text-muted") : "text-dim"}>{x.title.toLowerCase()}</span>
              {i < PHASES.length - 1 ? <span className="text-line-strong">→</span> : null}
            </li>
          ))}
        </ol>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={run}
            disabled={running}
            className="inline-flex h-8 items-center gap-1.5 rounded bg-fg px-3 font-mono text-[0.75rem] text-bg transition-opacity hover:bg-white disabled:opacity-50"
          >
            <Play className="size-3" aria-hidden /> {phase === 0 ? "Simulate failure" : "Run again"}
          </button>
          <button
            type="button"
            onClick={() => {
              stop();
              setPhase((x) => (Math.min(x + 1, 5) as Phase));
            }}
            disabled={phase === 5}
            aria-label="Next step"
            className="grid size-8 place-items-center rounded border border-line-strong text-muted hover:text-fg disabled:opacity-40"
          >
            <StepForward className="size-3.5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => {
              stop();
              setPhase(0);
            }}
            aria-label="Reset"
            className="grid size-8 place-items-center rounded border border-line-strong text-muted hover:text-fg"
          >
            <RotateCcw className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* Diagram */}
        <div className="bg-sunken p-4 md:p-6" aria-hidden>
          <div className="mx-auto max-w-sm">
            <Node label="Clients" state={primaryDown && !recovered ? "errors" : "requests"} tone={primaryDown && !recovered ? "fail" : "ok"} />
            <Wire active />
            <Node
              label="Traffic routing"
              state={recovered ? "→ DR" : "→ primary"}
              tone={recovered ? "ok" : primaryDown ? "warn" : "ok"}
            />
          </div>

          <div className="mt-1 grid grid-cols-2 gap-3 md:gap-6">
            {/* Primary site */}
            <div>
              <Wire active={!primaryDown} broken={primaryDown} label={primaryDown ? "✕" : undefined} />
              <div className={`rounded-md border p-2.5 transition-colors duration-300 ${primaryDown ? "border-fail/40" : "border-line"}`}>
                <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-dim">Primary site</p>
                <div className="flex flex-col gap-2">
                  <Node
                    label="Service A"
                    state={primaryDown ? "failed" : "active"}
                    tone={primaryDown ? "fail" : "ok"}
                    sub={primaryDown ? (detected ? "isolated" : "not responding") : "serving"}
                  />
                  <Node label="Database" state={primaryDown ? "unreachable" : "primary"} tone={primaryDown ? "idle" : "ok"} />
                </div>
              </div>
            </div>

            {/* DR site */}
            <div>
              <Wire active={recovered} />
              <div className={`rounded-md border p-2.5 transition-colors duration-300 ${recovered ? "border-accent/40" : "border-line"}`}>
                <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-dim">DR site</p>
                <div className="flex flex-col gap-2">
                  <Node
                    label="Service B"
                    state={recovered ? "online" : promoting ? "starting" : "standby"}
                    tone={recovered ? "ok" : promoting ? "warn" : "idle"}
                    sub={recovered ? "serving" : "warm standby"}
                  />
                  <Node
                    label="Replica"
                    state={recovered ? "primary" : promoting ? "promoting" : primaryDown ? "standby" : "in sync"}
                    tone={recovered ? "ok" : promoting ? "warn" : "idle"}
                    sub={recovered ? "serving writes" : primaryDown ? "replication stopped" : "replicating ←"}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
            <Node
              label="Kafka · dr events"
              state={recovered ? "completed" : eventSent ? "failover" : "idle"}
              tone={recovered ? "ok" : eventSent ? "warn" : "idle"}
              sub={eventSent ? (recovered ? "dr.failover.completed" : "dr.failover.initiated") : "—"}
            />
            <Node
              label="Health checks"
              state={detected ? (recovered ? "ok" : "alert") : primaryDown ? "probing" : "ok"}
              tone={detected && !recovered ? "fail" : primaryDown && !detected ? "warn" : "ok"}
              sub={detected && !recovered ? "3/3 missed" : "heartbeats"}
            />
          </div>
        </div>

        {/* Event log */}
        <div className="flex flex-col border-t border-line lg:border-t-0 lg:border-l">
          <p className="border-b border-line px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-dim">event log</p>
          <ol className="flex-1 space-y-1.5 px-4 py-3 font-mono text-[0.7rem] leading-relaxed" aria-live="polite" aria-label="Simulation event log">
            <AnimatePresence initial={false}>
            {log.map((l, i) => (
              <motion.li key={`${l.t}-${i}`} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="flex gap-3">
                <span className="shrink-0 text-dim">{l.t}</span>
                <span className={levelText[l.level]}>{l.msg}</span>
              </motion.li>
            ))}
            </AnimatePresence>
          </ol>
          <p className="border-t border-line px-4 py-3 text-[0.75rem] leading-relaxed text-dim">
            Conceptual visualisation of a site-level failover. Timings are illustrative — nothing in your browser is actually failing over.
          </p>
        </div>
      </div>
    </div>
  );
}
