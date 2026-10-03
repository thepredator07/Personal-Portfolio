"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type TerminalData = {
  name: string;
  role: string;
  location: string;
  email: string;
  resume: string;
  current: { title: string; company: string; team?: string; since: string; systems: string[] };
  projects: { slug: string; title: string; kind: string }[];
  stack: Record<string, string[]>;
  links: { label: string; href: string }[];
  sections: string[];
};

type Line = { id: number; node: ReactNode };

const COMMANDS = ["help", "whoami", "ls projects", "cat experience.md", "cat stack.json", "contact", "resume", "failover", "open ", "clear"];

/**
 * A small optional terminal. Everything it can show is also reachable through
 * normal navigation — it's a metaphor, not a gate.
 */
export function Terminal({ data }: { data: TerminalData }) {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const nextId = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const prompt = (cmd: string) => (
    <p>
      <span className="text-accent">visitor@kr</span>
      <span className="text-dim">:~$</span> <span className="text-fg">{cmd}</span>
    </p>
  );

  function exec(raw: string): ReactNode | "clear" {
    const cmd = raw.trim().replace(/\s+/g, " ");
    const [head, ...rest] = cmd.split(" ");
    const arg = rest.join(" ");

    switch (head) {
      case "":
        return null;
      case "help":
        return (
          <div className="text-muted">
            <p>available commands:</p>
            <ul className="mt-1 grid grid-cols-[auto_1fr] gap-x-4">
              {[
                ["whoami", "who runs this system"],
                ["ls projects", "list projects"],
                ["cat experience.md", "current role"],
                ["cat stack.json", "technologies, grouped"],
                ["open <section>", data.sections.join(" | ")],
                ["failover", "run the DR simulation"],
                ["contact", "how to reach me"],
                ["resume", "open the PDF"],
                ["clear", "clear the screen"],
              ].map(([c, d]) => (
                <li key={c} className="contents">
                  <span className="text-fg">{c}</span>
                  <span className="text-dim">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case "whoami":
        return (
          <p className="text-muted">
            {data.name} — {data.role.toLowerCase()}, {data.location}
          </p>
        );
      case "ls":
        if (arg === "projects" || arg === "projects/") {
          return (
            <ol className="text-muted">
              {data.projects.map((p, i) => (
                <li key={p.slug}>
                  <span className="text-dim">{String(i + 1).padStart(2, "0")}</span>{" "}
                  <Link href={`/projects/${p.slug}/`} className="text-fg underline-offset-2 hover:underline">
                    {p.slug}
                  </Link>{" "}
                  <span className="text-dim">[{p.kind}]</span>
                </li>
              ))}
            </ol>
          );
        }
        return <p className="text-muted">projects/  experience.md  stack.json  resume.pdf</p>;
      case "cat":
        if (arg === "experience.md") {
          return (
            <div className="text-muted">
              <p className="text-fg"># {data.current.title} — {data.current.company}</p>
              <p className="text-dim">
                {data.current.team ? `${data.current.team} · ` : ""}since {data.current.since}
              </p>
              <ul className="mt-1">
                {data.current.systems.map((s) => (
                  <li key={s}>- {s}</li>
                ))}
              </ul>
            </div>
          );
        }
        if (arg === "stack.json") {
          return (
            <pre className="whitespace-pre-wrap text-muted">
              {"{\n"}
              {Object.entries(data.stack).map(([k, v], i, arr) => (
                <span key={k}>
                  {"  "}
                  <span className="text-info">&quot;{k}&quot;</span>: [{v.map((x) => `"${x}"`).join(", ")}]
                  {i < arr.length - 1 ? ",\n" : "\n"}
                </span>
              ))}
              {"}"}
            </pre>
          );
        }
        if (arg === "resume.pdf") {
          window.open(data.resume, "_blank");
          return <p className="text-muted">opening resume.pdf…</p>;
        }
        return <p className="text-fail">cat: {arg || "<file>"}: No such file</p>;
      case "open":
      case "cd": {
        const target = arg.replace(/^\/|\/$/g, "");
        if (data.sections.includes(target)) {
          router.push(`/#${target}`);
          return <p className="text-muted">→ /{target}</p>;
        }
        return <p className="text-fail">{head}: {arg || "<section>"}: not found. try: {data.sections.join(", ")}</p>;
      }
      case "failover":
        router.push("/#architecture");
        window.setTimeout(() => window.dispatchEvent(new CustomEvent("sim:run")), 600);
        return <p className="text-warn">initiating simulated failover → /architecture</p>;
      case "contact":
        return (
          <ul className="text-muted">
            {data.links.map((l) => (
              <li key={l.label}>
                <span className="inline-block w-20 text-dim">{l.label.toLowerCase()}</span>
                <a
                  href={l.href}
                  className="text-fg underline-offset-2 hover:underline"
                  {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {l.href.replace(/^mailto:|^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </a>
              </li>
            ))}
          </ul>
        );
      case "resume":
        window.open(data.resume, "_blank");
        return <p className="text-muted">opening resume.pdf…</p>;
      case "clear":
        return "clear";
      case "sudo":
        // Easter egg #2
        if (/^rm -rf \/?\*?$/.test(arg)) {
          return (
            <div className="text-muted">
              <p className="text-fail">rm: primary volume destroyed.</p>
              <p className="text-warn">health-check: 3/3 heartbeats missed — promoting replica…</p>
              <p className="text-accent">✓ restored from DR site. RPO: 0 visitors lost.</p>
              <p className="text-dim">nice try. this host has disaster recovery configured.</p>
            </div>
          );
        }
        return <p className="text-fail">visitor is not in the sudoers file. This incident will be reported.</p>;
      case "exit":
        return <p className="text-muted">there is no escape. try `open contact` instead.</p>;
      default:
        return (
          <p className="text-fail">
            command not found: {head} <span className="text-dim">— try `help`</span>
          </p>
        );
    }
  }

  function submit(value: string) {
    const out = exec(value);
    if (out === "clear") {
      setLines([]);
    } else {
      setLines((prev) => [
        ...prev,
        { id: nextId.current++, node: prompt(value) },
        ...(out ? [{ id: nextId.current++, node: out }] : []),
      ]);
    }
    if (value.trim()) setHistory((h) => [value, ...h].slice(0, 50));
    setCursor(-1);
    setInput("");
  }

  // Seed with one command so the terminal isn't empty on load.
  useEffect(() => {
    setLines([
      { id: nextId.current++, node: prompt("whoami") },
      { id: nextId.current++, node: exec("whoami") },
      { id: nextId.current++, node: prompt("ls projects") },
      { id: nextId.current++, node: exec("ls projects") },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border border-line bg-sunken">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span className="size-2 rounded-full bg-line-strong" aria-hidden />
        <span className="size-2 rounded-full bg-line-strong" aria-hidden />
        <span className="size-2 rounded-full bg-line-strong" aria-hidden />
        <span className="ml-2 font-mono text-[0.68rem] text-dim">visitor@kr — zsh</span>
        <span className="ml-auto font-mono text-[0.65rem] text-dim">optional · type `help`</span>
      </div>
      <div
        ref={scrollRef}
        className="h-64 flex-1 overflow-y-auto px-3 py-3 font-mono text-[0.76rem] leading-relaxed md:h-auto md:min-h-64"
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        <div className="flex flex-col gap-1.5">
          {lines.map((l) => (
            <div key={l.id}>{l.node}</div>
          ))}
        </div>
        <form
          className="mt-1.5 flex items-center"
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
        >
          <label htmlFor="term-input" className="shrink-0">
            <span className="text-accent">visitor@kr</span>
            <span className="text-dim">:~$</span>
            <span className="sr-only">Terminal command</span>
          </label>
          <input
            id="term-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                const next = Math.min(cursor + 1, history.length - 1);
                if (history[next] !== undefined) {
                  setCursor(next);
                  setInput(history[next]);
                }
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const next = cursor - 1;
                setCursor(Math.max(next, -1));
                setInput(next >= 0 ? history[next] : "");
              } else if (e.key === "Tab" && input) {
                const match = COMMANDS.find((c) => c.startsWith(input));
                if (match) {
                  e.preventDefault();
                  setInput(match);
                }
              }
            }}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="ml-2 w-full bg-transparent text-fg caret-accent focus:outline-none"
          />
        </form>
      </div>
    </div>
  );
}
