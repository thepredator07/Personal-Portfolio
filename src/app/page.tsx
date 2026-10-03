import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { ExperienceSection } from "@/components/home/experience";
import { ProjectsSection } from "@/components/home/projects";
import { ArchitectureSection } from "@/components/home/architecture";
import { StackSection } from "@/components/home/stack";
import { NotesSection } from "@/components/home/notes";
import { ContactSection } from "@/components/home/contact";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <ExperienceSection />
      <ProjectsSection />
      <ArchitectureSection />
      <StackSection />
      <NotesSection />
      <ContactSection />
      <Footer />
    </>
  );
}
