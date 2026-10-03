import type { Metadata } from "next";
import { getAllNotes } from "@/lib/notes";
import { formatDate } from "@/lib/content";
import { NoteRow } from "@/components/note-row";
import { SectionHeader } from "@/components/ui";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Engineering notes",
  description: "Notes on distributed systems, messaging, reliability and backend design.",
  alternates: { canonical: "/notes/" },
};

export default function NotesIndex() {
  const notes = getAllNotes();
  const tags = Array.from(new Set(notes.flatMap((n) => n.tags))).sort();
  return (
    <>
      <div className="mx-auto max-w-4xl px-5 pt-10 pb-20 md:px-10 md:pt-16">
        <SectionHeader index="07" path="/notes" title="Engineering notes" lead="Write-ups on the problems behind the systems." />
        {tags.length ? (
          <p className="-mt-4 mb-8 font-mono text-[0.72rem] text-dim">{tags.map((t) => `#${t}`).join("  ")}</p>
        ) : null}
        {notes.length === 0 ? (
          <p className="font-mono text-sm text-dim">Nothing published yet.</p>
        ) : (
          <ul className="border-t border-line">
            {notes.map((n) => (
              <NoteRow key={n.slug} note={n} date={formatDate(n.date)} />
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
}
