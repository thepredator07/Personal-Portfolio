/**
 * Markdown notes loader. Any .md file in /content/notes becomes a note at
 * /notes/<filename>/. Runs at build time only (server components).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { NoteFrontmatter } from "@content/types";

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

export type NoteMeta = NoteFrontmatter & { slug: string; readingMinutes: number };
export type Note = NoteMeta & { html: string };

const showDrafts = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_DRAFTS === "1";

function readingMinutes(text: string): number {
  return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 220));
}

function parse(file: string): { meta: NoteMeta; body: string } {
  const raw = fs.readFileSync(path.join(NOTES_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const fm = data as Partial<NoteFrontmatter>;
  const slug = file.replace(/\.md$/, "");
  if (!fm.title || !fm.date) {
    throw new Error(`Note "${file}" is missing a title or date in its frontmatter.`);
  }
  return {
    meta: {
      slug,
      title: fm.title,
      // gray-matter turns unquoted YAML dates into Date objects
      date: (fm.date as unknown) instanceof Date ? (fm.date as unknown as Date).toISOString().slice(0, 10) : String(fm.date),
      summary: fm.summary ?? "",
      tags: fm.tags ?? [],
      draft: fm.draft ?? false,
      readingMinutes: readingMinutes(content),
    },
    body: content,
  };
}

export function getAllNotes(): NoteMeta[] {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs
    .readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parse(f).meta)
    .filter((n) => showDrafts || !n.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getNote(slug: string): Note | undefined {
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(NOTES_DIR, file))) return undefined;
  const { meta, body } = parse(file);
  if (meta.draft && !showDrafts) return undefined;
  return { ...meta, html: marked.parse(body, { async: false }) as string };
}

/** Notes sharing the most tags with the given one. */
export function getRelatedNotes(slug: string, limit = 3): NoteMeta[] {
  const all = getAllNotes();
  const current = all.find((n) => n.slug === slug);
  if (!current) return [];
  return all
    .filter((n) => n.slug !== slug)
    .map((n) => ({ n, score: n.tags.filter((t) => current.tags.includes(t)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.n);
}
