import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { experience, formatMonth, getProject } from "@/lib/content";
import { Reveal } from "../reveal";
import { Label, MetricGrid, SectionHeader, StatusDot, TagList } from "../ui";

export function ExperienceSection() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-24">
        <SectionHeader titleId="experience-title"
          index="03"
          path="/experience"
          title="Experience"
          lead="Where the systems ran in production."
        />

        <ol className="flex flex-col gap-16">
          {experience.map((job) => {
            const live = job.end === "present";
            return (
              <li key={`${job.company}-${job.start}`}>
                <Reveal>
                  {/* Time axis */}
                  <div className="flex items-center gap-3 font-mono text-xs text-dim">
                    <span className="text-fg">{formatMonth(job.start)}</span>
                    <span aria-hidden className="relative h-px flex-1 bg-line-strong">
                      {live ? <span className="absolute right-0 -top-[3px] size-[7px] rounded-full bg-accent" /> : null}
                    </span>
                    <span className={live ? "flex items-center gap-1.5 text-accent" : "text-fg"}>
                      {live ? <StatusDot pulse /> : null}
                      {formatMonth(job.end).toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)] lg:gap-14">
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-fg">{job.company}</h3>
                      <p className="mt-1 text-muted">{job.title}</p>
                      {job.team ? <p className="mt-3 font-mono text-[0.8rem] text-accent">{job.team}</p> : null}
                      {job.domains?.length ? (
                        <p className="mt-1 font-mono text-[0.75rem] text-dim">{job.domains.join(" · ")}</p>
                      ) : null}
                      {job.summary ? <p className="mt-5 text-[0.95rem] leading-relaxed text-muted">{job.summary}</p> : null}

                      <Label className="mt-8">Systems</Label>
                      <ul className="mt-3 flex flex-col gap-1.5">
                        {job.systems.map((sys) => {
                          const s = typeof sys === "string" ? sys : sys.name;
                          const project = typeof sys === "string" ? undefined : getProject(sys.project);
                          return (
                            <li key={s} className="flex items-baseline gap-2.5 text-[0.92rem]">
                              <span aria-hidden className="text-[0.6rem] text-accent">●</span>
                              {project ? (
                                <Link href={`/projects/${project.slug}/`} className="group inline-flex items-center gap-1 text-fg hover:text-accent">
                                  {s}
                                  <ArrowUpRight className="size-3 text-dim group-hover:text-accent" aria-hidden />
                                </Link>
                              ) : (
                                <span className="text-fg">{s}</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-8">
                      <div>
                        <Label>What I built</Label>
                        <ul className="mt-3 flex flex-col divide-y divide-line border-y border-line">
                          {job.highlights.map((h, i) => (
                            <li key={i} className="grid grid-cols-[2rem_1fr] py-3.5 text-[0.93rem] leading-relaxed text-muted">
                              <span className="font-mono text-xs text-dim">{String(i + 1).padStart(2, "0")}</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {job.impact?.length ? (
                        <div>
                          <Label className="mb-3">Impact</Label>
                          <MetricGrid metrics={job.impact} cols={5} size="sm" />
                        </div>
                      ) : null}
                      <TagList items={job.technologies} label="Technologies" />
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
