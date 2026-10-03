import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllNotes } from "@/lib/notes";
import { formatDate } from "@/lib/content";
import { SectionHeader } from "../ui";
import { NoteRow } from "../note-row";

export function NotesSection() {
  const notes = getAllNotes();
  return (
    <section id="notes" aria-labelledby="notes-title" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-24">
        <SectionHeader
          titleId="notes-title"
          index="07"
          path="/notes"
          title="Engineering notes"
          lead="Short write-ups on the problems behind the systems — failure handling, messaging, API design."
          aside={
            notes.length > 0 ? (
              <Link href="/notes/" className="inline-flex items-center gap-1.5 font-mono text-[0.8rem] text-muted hover:text-fg">
                all notes <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            ) : null
          }
        />
        {notes.length === 0 ? (
          <p className="rounded-md border border-dashed border-line-strong px-5 py-8 text-center font-mono text-[0.8rem] text-dim">
            $ ls notes/ — nothing published yet. First notes are on the way.
          </p>
        ) : (
          <ul className="border-t border-line">
            {notes.slice(0, 4).map((n) => (
              <NoteRow key={n.slug} note={n} date={formatDate(n.date)} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
