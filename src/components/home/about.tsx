import { achievements, certifications, education, profile } from "@/lib/content";
import { Reveal } from "../reveal";
import { Label, SectionHeader } from "../ui";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-24">
      <SectionHeader titleId="about-title" index="02" path="/about" title="About" />
      <Reveal className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-16">
        <p className="text-lg leading-relaxed text-fg/90">{profile.summary}</p>

        <div className="flex flex-col gap-8">
          <div>
            <Label>Domains</Label>
            <ul className="mt-3 flex flex-col gap-1.5 text-[0.95rem] text-muted">
              {profile.domains.map((d) => (
                <li key={d} className="flex items-baseline gap-2.5">
                  <span aria-hidden className="font-mono text-xs text-accent">›</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Label>Education</Label>
            <ul className="mt-3 flex flex-col gap-3">
              {education.map((e) => (
                <li key={e.degree}>
                  <p className="text-[0.95rem] text-fg">{e.degree}</p>
                  <p className="text-sm text-muted">{e.institution}</p>
                  <p className="font-mono text-xs text-dim">
                    {e.start} – {e.end}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          {certifications.length > 0 ? (
            <div>
              <Label>Certifications</Label>
              <ul className="mt-3 flex flex-col gap-2 text-sm">
                {certifications.map((c) => (
                  <li key={c.name}>
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-fg hover:underline">
                        {c.name}
                      </a>
                    ) : (
                      <span className="text-fg">{c.name}</span>
                    )}
                    <span className="text-muted"> · {c.issuer}</span>
                    {c.date ? <span className="font-mono text-xs text-dim"> · {c.date}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {achievements.length > 0 ? (
            <div>
              <Label>Achievements</Label>
              <ul className="mt-3 flex flex-col gap-2 text-sm">
                {achievements.map((a) => (
                  <li key={a.title}>
                    <span className="text-fg">{a.title}</span>
                    {a.date ? <span className="font-mono text-xs text-dim"> · {a.date}</span> : null}
                    {a.description ? <p className="text-muted">{a.description}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
