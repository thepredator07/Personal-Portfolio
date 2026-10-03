import { Reveal } from "../reveal";
import { Label, SectionHeader } from "../ui";
import { FailureSim } from "./failure-sim";
import { SystemOverview } from "./system-overview";

export function ArchitectureSection() {
  return (
    <section id="architecture" aria-labelledby="architecture-title" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-24">
        <SectionHeader
          titleId="architecture-title"
          index="05"
          path="/architecture"
          title="Architecture"
          lead="The systems I work on day to day, and the failure they exist to survive."
        />
        <Reveal>
          <Label className="mb-3">System overview</Label>
          <SystemOverview />
        </Reveal>
        <Reveal className="mt-16">
          <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
            <div>
              <Label>Failure → recovery</Label>
              <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
                Disaster Recovery is about what happens after something breaks. Step through a site failover:
                failure, detection, event propagation, promotion of the DR site, recovery.
              </p>
            </div>
          </div>
          <FailureSim />
        </Reveal>
      </div>
    </section>
  );
}
