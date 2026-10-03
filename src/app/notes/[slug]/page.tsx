import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllNotes, getNote, getRelatedNotes } from "@/lib/notes";
import { formatDate, profile } from "@/lib/content";
import { Label } from "@/components/ui";
import { Footer } from "@/components/footer";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  const notes = getAllNotes();
  // Static export needs at least one param; a placeholder 404s cleanly.
  return notes.length ? notes.map((n) => ({ slug: n.slug })) : [{ slug: "_empty" }];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const n = getNote(slug);
  if (!n) return {};
  return {
    title: n.title,
    description: n.summary,
    keywords: n.tags,
    alternates: { canonical: `/notes/${n.slug}/` },
    openGraph: { type: "article", title: n.title, description: n.summary, publishedTime: n.date, tags: n.tags, url: `/notes/${n.slug}/` },
  };
}

export default async function NotePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();
  const related = getRelatedNotes(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: note.title,
    description: note.summary,
    datePublished: note.date,
    keywords: note.tags.join(", "),
    author: { "@type": "Person", name: profile.name },
  };

  return (
    <>
      <article className="mx-auto max-w-[44rem] px-5 pt-10 pb-16 md:px-8 md:pt-16">
        <nav aria-label="Breadcrumb" className="font-mono text-[0.75rem] text-dim">
          <Link href="/notes/" className="inline-flex items-center gap-1.5 hover:text-fg">
            <ArrowLeft className="size-3.5" aria-hidden /> notes
          </Link>
          <span className="mx-2 text-line-strong">/</span>
          <span className="text-muted">{note.slug}.md</span>
        </nav>
        <header className="mt-8 border-b border-line pb-8">
          {note.draft ? (
            <p className="mb-3 inline-block rounded border border-warn/40 px-1.5 font-mono text-[0.65rem] uppercase text-warn">draft — hidden in production</p>
          ) : null}
          <h1 className="text-3xl font-semibold tracking-tight text-fg md:text-[2.1rem] md:leading-tight">{note.title}</h1>
          {note.summary ? <p className="mt-3 text-lg text-muted">{note.summary}</p> : null}
          <p className="mt-5 font-mono text-[0.72rem] text-dim">
            <time dateTime={note.date}>{formatDate(note.date)}</time> · {note.readingMinutes} min read ·{" "}
            {note.tags.map((t) => `#${t}`).join(" ")}
          </p>
        </header>
        <div className="prose-note mt-8" dangerouslySetInnerHTML={{ __html: note.html }} />

        {related.length ? (
          <aside className="mt-16 border-t border-line pt-8" aria-label="Related notes">
            <Label>Related</Label>
            <ul className="mt-3 flex flex-col gap-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/notes/${r.slug}/`} className="text-fg hover:text-accent">
                    {r.title}
                  </Link>
                  <span className="ml-2 font-mono text-[0.7rem] text-dim">{r.readingMinutes} min</span>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Footer />
    </>
  );
}
