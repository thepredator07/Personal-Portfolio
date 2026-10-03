import type { Experience } from "./types";

/** Newest first. */
export const experience: Experience[] = [
  {
    company: "Jio Platforms Limited",
    title: "Software Development Engineer 1",
    start: "2023-10",
    end: "present",
    location: "Navi Mumbai",
    team: "CloudXP — hybrid cloud & disaster recovery",
    domains: ["Hybrid cloud", "Disaster recovery", "Workflow orchestration"],
    summary:
      "Backend for an enterprise hybrid-cloud platform and its Disaster-Recovery-as-a-Service product: validation pipelines, async workflow orchestration, cloud onboarding, DR configuration and replication-state propagation across 20+ microservices.",
    systems: [
      { name: "Rule-driven async validation engine", project: "async-validation-framework" },
      { name: "Cluster Sync workflow orchestration", project: "mongodb-cluster-sync" },
      { name: "Cloud subscription onboarding", project: "cloud-subscription-onboarding" },
      { name: "Replication-state events → Kafka", project: "replication-state-events" },
      { name: "DR configuration & discovery APIs", project: "dr-configuration-apis" },
      { name: "Cross-cluster log retrieval tooling", project: "log-retrieval-tooling" },
    ],
    highlights: [
      "Built a rule-driven asynchronous validation framework that pre-validates inputs from multiple external APIs — 12.8× throughput via parallel rule execution, in-memory correlation and JDBC batch updates, reducing downstream errors by 25% and validation latency by ~90% (validated via JMeter).",
      "Architected a pluggable async orchestration framework in Java/Spring Boot for MongoDB Cluster Sync, moving workflow state into the owning service and removing a centralized CMDB dependency from the orchestration path — 60% fewer sync failures and no single point of failure across 8+ services.",
      "Implemented enterprise cloud subscription onboarding across Order Management, Camunda and a cloud-validation service, using Spring Boot, OpenFeign and async callbacks to manage validation, discovery, state transitions and failure compensation across distributed services.",
      "Built Spring Boot APIs to publish DR replication state to Kafka and observability systems, with idempotent retries and dual-sink synchronization for reliable event propagation.",
      "Designed APIs for DR configuration and hierarchical resource discovery (cloud provider → location → subscription → project) on a reusable query framework built with Builder, Specification and Strategy.",
      "Engineered internal tooling for centralized log retrieval across Kubernetes clusters and databases, reducing debugging time by ~30% across 20+ microservices; adopted by ~200 engineers.",
    ],
    technologies: [
      "Java",
      "Spring Boot",
      "Kafka",
      "Camunda",
      "OpenFeign",
      "CompletableFuture",
      "JPA",
      "JDBC",
      "MongoDB",
      "Kubernetes",
      "Docker",
      "Azure",
      "JMeter",
    ],
    impact: [
      { value: "12.8×", label: "validation throughput", direction: "up" },
      { value: "~90%", label: "validation latency", direction: "down" },
      { value: "25%", label: "downstream errors", direction: "down" },
      { value: "60%", label: "sync failures", direction: "down" },
      { value: "~30%", label: "debugging time", direction: "down" },
    ],
  },
];
