import Link from "next/link";
import type { NoteMeta } from "@/lib/notes";

export function NoteRow({ note, date }: { note: NoteMeta; date: string }) {
  return (
    <li className="border-b border-line">
      <Link
        href={`/notes/${note.slug}/`}
        className="group grid gap-1 py-5 md:grid-cols-[8rem_1fr_auto] md:items-baseline md:gap-6"
      >
        <time dateTime={note.date} className="font-mono text-[0.72rem] text-dim">
          {date}
        </time>
        <span>
          <span className="text-[1.02rem] text-fg transition-colors group-hover:text-accent">
            {note.title}
            {note.draft ? <span className="ml-2 rounded border border-warn/40 px-1 font-mono text-[0.6rem] uppercase text-warn">draft</span> : null}
          </span>
          {note.summary ? <span className="mt-1 block text-[0.9rem] text-muted">{note.summary}</span> : null}
        </span>
        <span className="font-mono text-[0.7rem] text-dim">
          {note.tags.slice(0, 2).map((t) => `#${t}`).join(" ")} · {note.readingMinutes} min
        </span>
      </Link>
    </li>
  );
}
