import { ArrowDown, ArrowUpRight, Download, FileText } from "lucide-react";
import { currentRole, experienceLabel, formatMonth, profile, projects, skills, resumeUrl } from "@/lib/content";
import { sections } from "@/lib/nav";
import { Terminal, type TerminalData } from "../terminal";
import { ButtonLink, MetricGrid, StatusDot } from "../ui";

export function Hero() {
  const since = currentRole ? formatMonth(currentRole.start) : "";
  const rows: [string, React.ReactNode][] = [
    ["current", currentRole ? <>{currentRole.title} · <span className="text-fg">{currentRole.company}</span></> : profile.role],
    ["team", currentRole?.team ?? "—"],
    ["experience", <>{experienceLabel()} <span className="text-dim">· since {since}</span></>],
    ["location", profile.location],
  ];

  const terminalData: TerminalData = {
    name: profile.name,
    role: profile.role,
    location: profile.location,
    email: profile.email,
    resume: resumeUrl,
    current: {
      title: currentRole?.title ?? profile.role,
      company: currentRole?.company ?? "",
      team: currentRole?.team,
      since,
      systems: (currentRole?.systems ?? []).map((s) => (typeof s === "string" ? s : s.name)),
    },
    projects: projects.map((p) => ({ slug: p.slug, title: p.title, kind: p.kind })),
    stack: Object.fromEntries(skills.map((g) => [g.key, g.items.map((i) => i.name)])),
    links: profile.links.map((l) => ({ label: l.label, href: l.href })),
    sections: sections.map((s) => s.id),
  };

  return (
    <section id="home" aria-labelledby="hero-name" className="relative border-b border-line">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 h-[70%]" />
      <div className="relative mx-auto max-w-6xl px-5 pt-10 pb-12 md:px-10 md:pt-16 lg:pt-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
          <div className="min-w-0">
            <p className="font-mono text-xs text-dim">
              <span className="text-accent">~/khubaib</span> $ whoami
              <span aria-hidden className="ml-1 inline-block h-3.5 w-[7px] translate-y-0.5 animate-blink bg-accent/80" />
            </p>
            <h1 id="hero-name" className="mt-4 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
              {profile.name}
            </h1>
            <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[0.82rem] text-muted">
              <span className="text-fg">{profile.role}</span>
              {profile.focus.map((f) => (
                <span key={f} className="whitespace-nowrap">
                  <span aria-hidden className="mr-2 text-line-strong">·</span>
                  {f}
                </span>
              ))}
            </p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg/90">{profile.statement}</p>

            <dl className="mt-7 grid max-w-xl grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-l border-line pl-4 font-mono text-[0.8rem]">
              {rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-dim">{k}</dt>
                  <dd className="text-muted">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <ButtonLink href={resumeUrl} variant="primary" external>
                <FileText className="size-3.5" aria-hidden /> View resume
              </ButtonLink>
              <ButtonLink href={resumeUrl} download>
                <Download className="size-3.5" aria-hidden /> PDF
              </ButtonLink>
              <ButtonLink href="#projects" variant="ghost">
                Explore work <ArrowDown className="size-3.5" aria-hidden />
              </ButtonLink>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.78rem]">
              {profile.links.filter((l) => l.href.startsWith("http")).map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted transition-colors hover:text-fg"
                  >
                    {l.label.toLowerCase()}
                    <ArrowUpRight className="size-3 text-dim" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex min-h-72 flex-col">
            <Terminal data={terminalData} />
          </div>
        </div>

        <div className="mt-12">
          <p className="mb-3 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-dim">
            <StatusDot /> selected impact · {currentRole?.company}
          </p>
          <MetricGrid metrics={profile.highlights} size="lg" />
        </div>
      </div>
    </section>
  );
}
