import { profile } from "@/lib/content";

export function Footer() {
  const built = new Date().toISOString().slice(0, 10);
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 font-mono text-[0.7rem] text-dim md:flex-row md:items-center md:justify-between md:px-10">
        <p>
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <p>
          static build · {built} · <kbd className="rounded border border-line px-1">Ctrl/⌘ K</kbd> to navigate
        </p>
      </div>
    </footer>
  );
}
