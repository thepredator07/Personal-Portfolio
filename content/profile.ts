import type { Profile } from "./types";

export const profile: Profile = {
  name: "Khubaib Rahman",
  initials: "KR",
  role: "Backend Engineer",
  focus: ["Distributed Systems", "Java", "Spring Boot", "Kafka", "Go"],
  statement:
    "I build backend systems that stay correct when a dependency, a callback or an entire site fails — async workflows, event pipelines and cloud platform APIs.",
  summary:
    "Backend engineer at Jio Platforms, building the distributed backend of a hybrid-cloud disaster-recovery platform. Most of my work is the hard middle of backend systems: long-running async workflows across service boundaries, high-throughput validation pipelines, event-driven state propagation and the APIs that sit on top — in Java, Spring Boot, Kafka and Go.",
  location: "Navi Mumbai, India",
  email: "khubaibrahman07@gmail.com",
  careerStart: "2023-10-01",
  resume: "/resume.pdf",
  openTo: [
    "Backend engineering",
    "Distributed systems",
    "Cloud infrastructure & reliability",
    "Hard technical problems",
  ],
  // Every number here comes straight from the resume. Keep it that way.
  highlights: [
    { value: "12.8×", label: "validation throughput", direction: "up", source: "JMeter" },
    { value: "~90%", label: "validation latency", direction: "down", source: "JMeter" },
    { value: "60%", label: "cluster-sync failures", direction: "down" },
    { value: "~200", label: "engineers on internal log tooling" },
  ],
  // Capability areas, phrased the way platform/infra teams hire for them.
  // Each one is backed by a project on the site.
  domains: [
    "Hybrid cloud platforms",
    "Distributed workflow orchestration",
    "Event-driven architecture",
    "Resilience & disaster recovery",
    "High-throughput, concurrent APIs",
    "Platform & developer tooling",
  ],
  links: [
    { label: "GitHub", href: "https://github.com/thepredator07", icon: "github", handle: "thepredator07" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/khubaib-rahman-60525418b/",
      icon: "linkedin",
      handle: "khubaib-rahman",
    },
    { label: "LeetCode", href: "https://leetcode.com/khubaibrahman07/", icon: "leetcode", handle: "khubaibrahman07" },
    { label: "Email", href: "mailto:khubaibrahman07@gmail.com", icon: "mail", handle: "khubaibrahman07@gmail.com" },
  ],
};
