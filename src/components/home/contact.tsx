import { ArrowUpRight, FileText } from "lucide-react";
import { profile, resumeUrl } from "@/lib/content";
import { ButtonLink, Label } from "../ui";

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
        <p className="font-mono text-xs text-dim">
          <span className="text-accent">08</span>
          <span className="mx-2 text-line-strong">/</span>contact
        </p>
        <div className="mt-6 grid gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <h2 id="contact-title" className="text-3xl font-semibold tracking-tight text-fg md:text-4xl">
              Let&apos;s build something resilient.
            </h2>
            <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-muted">
              Email is the fastest way to reach me.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <ButtonLink href={`mailto:${profile.email}`} variant="primary">
                {profile.email}
              </ButtonLink>
              <ButtonLink href={resumeUrl} external>
                <FileText className="size-3.5" aria-hidden /> Resume
              </ButtonLink>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div>
              <Label>Open to</Label>
              <ul className="mt-3 flex flex-col gap-1.5 text-[0.95rem] text-muted">
                {profile.openTo.map((o) => (
                  <li key={o} className="flex items-baseline gap-2.5">
                    <span aria-hidden className="font-mono text-xs text-accent">›</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Label>Elsewhere</Label>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {profile.links.filter((l) => l.href.startsWith("http")).map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between py-2.5 text-[0.92rem]"
                    >
                      <span className="text-fg">{l.label}</span>
                      <span className="flex items-center gap-1.5 font-mono text-[0.72rem] text-dim group-hover:text-fg">
                        {l.handle}
                        <ArrowUpRight className="size-3" aria-hidden />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
