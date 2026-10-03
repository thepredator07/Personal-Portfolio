import type { SiteConfig } from "./types";

export const site: SiteConfig = {
  // TODO(khubaib): set this to your real domain before deploying.
  // It drives canonical URLs, the sitemap and Open Graph tags.
  // Can also be overridden at build time with NEXT_PUBLIC_SITE_URL.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: "Khubaib Rahman — Backend Engineer",
  description:
    "Backend engineer at Jio Platforms building the distributed backend of a hybrid-cloud disaster-recovery platform — async workflow orchestration, event-driven systems and high-throughput APIs in Java, Spring Boot, Kafka and Go.",
  keywords: [
    "Khubaib Rahman",
    "Backend Engineer",
    "Distributed Systems",
    "Java",
    "Spring Boot",
    "Kafka",
    "Golang",
    "Hybrid Cloud",
    "Workflow Orchestration",
    "Disaster Recovery",
    "Microservices",
  ],
};
