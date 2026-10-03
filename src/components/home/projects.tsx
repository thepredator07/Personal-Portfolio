import { projects } from "@/lib/content";
import { SectionHeader } from "../ui";
import { ProjectsExplorer } from "./projects-explorer";

export function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-24">
        <SectionHeader
          titleId="projects-title"
          index="04"
          path="/projects"
          title="Projects"
          lead="Systems I've designed and built — professional work at Jio Platforms, and things I've built on my own. Each opens into a case study: problem, architecture, trade-offs, failure modes."
        />
        <ProjectsExplorer projects={projects} />
      </div>
    </section>
  );
}
