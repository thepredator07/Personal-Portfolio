import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Section } from "@content/types";
import { getProject, kindLabel, projects, statusLabel } from "@/lib/content";
import { ArchFlow } from "@/components/arch-flow";
import { Label, MetricGrid, StatusDot, TagList } from "@/components/ui";
import { Footer } from "@/components/footer";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/projects/${p.slug}/` },
    openGraph: { title: p.title, description: p.description, url: `/projects/${p.slug}/`, type: "article" },
  };
}

function Block({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line py-10 md:grid-cols-[11rem_1fr] md:gap-10">
      <h2 className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-dim">
        <span className="text-accent">{String(n).padStart(2, "0")}</span>
        <span className="mx-2 text-line-strong">/</span>
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function SectionBody({ section }: { section: Section }) {
  return (
    <div className="flex flex-col gap-4 text-[1rem] leading-relaxed text-muted">
      {section.body ? <p className="text-fg/90">{section.body}</p> : null}
      {section.points?.length ? (
        <ul className="flex flex-col gap-2.5">
          {section.points.map((pt, i) => (
            <li key={i} className="grid grid-cols-[1.25rem_1fr]">
              <span aria-hidden className="font-mono text-xs leading-[1.6rem] text-accent">›</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const idx = projects.indexOf(p);
  const prev = projects[idx - 1];
  const next = projects[idx + 1];

  const blocks: { title: string; node: React.ReactNode }[] = [];
  if (p.problem) blocks.push({ title: "Problem", node: <SectionBody section={p.problem} /> });
  if (p.solution) blocks.push({ title: "Solution", node: <SectionBody section={p.solution} /> });
  if (p.architecture) blocks.push({ title: "Architecture", node: <ArchFlow flow={p.architecture} /> });
  if (p.engineering) blocks.push({ title: "Engineering", node: <SectionBody section={p.engineering} /> });
  if (p.tradeoffs) blocks.push({ title: "Trade-offs", node: <SectionBody section={p.tradeoffs} /> });
  if (p.failureModes) blocks.push({ title: "Failure modes", node: <SectionBody section={p.failureModes} /> });
  if (p.results?.length || p.resultNotes?.length)
    blocks.push({
      title: "Result",
      node: (
        <div className="flex flex-col gap-4">
          {p.results?.length ? <MetricGrid metrics={p.results} cols={p.results.length >= 3 ? 3 : 2} /> : null}
          {p.resultNotes?.length ? <SectionBody section={{ points: p.resultNotes }} /> : null}
        </div>
      ),
    });
  blocks.push({ title: "Tech stack", node: <TagList items={p.technologies} label="Technologies" /> });

  const meta: [string, string | undefined][] = [
    ["type", kindLabel[p.kind]],
    ["org", p.organisation],
    ["period", p.period],
    ["category", p.category],
  ];

  return (
    <>
      <article className="mx-auto max-w-4xl px-5 pt-10 pb-16 md:px-10 md:pt-16">
        <nav aria-label="Breadcrumb" className="font-mono text-[0.75rem] text-dim">
          <Link href="/#projects" className="inline-flex items-center gap-1.5 hover:text-fg">
            <ArrowLeft className="size-3.5" aria-hidden /> projects
          </Link>
          <span className="mx-2 text-line-strong">/</span>
          <span className="text-muted">{p.slug}</span>
        </nav>

        <header className="mt-8 pb-10">
          <p className="flex items-center gap-2 font-mono text-[0.72rem] text-dim">
            <StatusDot tone={p.status === "archived" ? "idle" : p.status === "in-progress" ? "warn" : "ok"} />
            {statusLabel[p.status]}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">{p.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{p.description}</p>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-[0.75rem] sm:grid-cols-4">
            {meta
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <dt className="text-dim">{k}</dt>
                  <dd className="mt-0.5 text-fg">{v}</dd>
                </div>
              ))}
          </dl>
          <div className="mt-8 flex flex-wrap items-center gap-4 font-mono text-[0.8rem]">
            {p.github ? (
              <a href={p.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded border border-line-strong px-3 py-1.5 text-fg hover:bg-raised">
                source on GitHub <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            ) : null}
            {p.demo ? (
              <a href={p.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded border border-line-strong px-3 py-1.5 text-fg hover:bg-raised">
                live demo <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            ) : null}
            {!p.github && !p.demo && p.linkNote ? <span className="text-dim">{p.linkNote}</span> : null}
          </div>
        </header>

        {blocks.map((b, i) => (
          <Block key={b.title} n={i + 1} title={b.title}>
            {b.node}
          </Block>
        ))}

        <nav aria-label="More projects" className="mt-6 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
          {prev ? (
            <Link href={`/projects/${prev.slug}/`} className="group rounded-md border border-line p-4 hover:border-line-strong">
              <Label>
                <ArrowLeft className="mr-1 inline size-3" aria-hidden /> previous
              </Label>
              <p className="mt-1.5 text-fg group-hover:text-accent">{prev.title}</p>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/projects/${next.slug}/`} className="group rounded-md border border-line p-4 text-right hover:border-line-strong">
              <Label>
                next <ArrowRight className="ml-1 inline size-3" aria-hidden />
              </Label>
              <p className="mt-1.5 text-fg group-hover:text-accent">{next.title}</p>
            </Link>
          ) : null}
        </nav>
      </article>
      <Footer />
    </>
  );
}
