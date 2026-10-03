import { skills } from "@/lib/content";
import { Reveal } from "../reveal";
import { SectionHeader } from "../ui";

export function StackSection() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-24">
        <SectionHeader
          titleId="stack-title"
          index="06"
          path="/stack"
          title="Stack"
          lead="Grouped by where it sits in a system. No percentages — just what I've used to build things."
        />
        <Reveal>
          <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((g) => (
              <div key={g.key} className="bg-bg p-5">
                <p className="font-mono text-[0.7rem] text-dim">
                  <span className="text-info">&quot;{g.key}&quot;</span>
                  <span className="mx-1.5 text-line-strong">·</span>
                  <span className="uppercase tracking-[0.12em]">{g.name}</span>
                </p>
                <ul className="mt-4 flex flex-col gap-1.5">
                  {g.items.map((i) => (
                    <li key={i.name} className="flex items-baseline justify-between gap-3 text-[0.93rem]">
                      <span className="text-fg">{i.name}</span>
                      {i.note ? <span className="font-mono text-[0.68rem] text-dim">{i.note}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
