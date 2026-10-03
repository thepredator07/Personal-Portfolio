import type { SkillGroup } from "./types";

/**
 * Grouped, not scored. No percentages.
 * Only list things you would be comfortable being interviewed on.
 */
export const skills: SkillGroup[] = [
  {
    name: "Languages",
    key: "lang",
    items: [{ name: "Java", note: "primary" }, { name: "Go" }, { name: "Python" }],
  },
  {
    name: "Backend",
    key: "backend",
    items: [
      { name: "Spring Boot" },
      { name: "Spring Security" },
      { name: "Hibernate / JPA" },
      { name: "OpenFeign" },
      { name: "REST APIs" },
      { name: "Gin", note: "Go" },
      { name: "GORM", note: "Go" },
      { name: "JWT / RBAC" },
    ],
  },
  {
    name: "Events & workflows",
    key: "async",
    items: [
      { name: "Apache Kafka" },
      { name: "Camunda", note: "BPMN" },
      { name: "Async callbacks & correlation" },
      { name: "Compensation / sagas" },
      { name: "Idempotent retries" },
    ],
  },
  {
    name: "Concurrency",
    key: "concurrency",
    items: [
      { name: "CompletableFuture" },
      { name: "ExecutorService", note: "bounded pools" },
      { name: "Fan-out / barrier / aggregate" },
      { name: "JDBC batching" },
    ],
  },
  {
    name: "Data",
    key: "data",
    items: [{ name: "MongoDB" }, { name: "PostgreSQL" }, { name: "Oracle" }, { name: "Redis" }],
  },
  {
    name: "Cloud & infra",
    key: "infra",
    items: [{ name: "Azure" }, { name: "Docker" }, { name: "Kubernetes" }, { name: "Nginx" }, { name: "Commvault", note: "DR" }],
  },
  {
    name: "Performance",
    key: "perf",
    items: [{ name: "Latency optimisation" }, { name: "Throughput tuning" }, { name: "JMeter" }],
  },
  {
    name: "Foundations",
    key: "cs",
    items: [
      { name: "Distributed systems" },
      { name: "Microservices" },
      { name: "System design" },
      { name: "Concurrency" },
      { name: "Design patterns" },
      { name: "Data structures & algorithms" },
    ],
  },
];
