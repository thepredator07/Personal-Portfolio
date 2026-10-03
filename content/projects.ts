import type { Project } from "./types";

/**
 * Projects, in display order.
 *
 * To add one: copy an object, give it a unique `slug`, save. A detail page is
 * generated at /projects/<slug>/ automatically. Any section you omit is hidden.
 *
 * Accuracy rule: content comes from the resume and my own design write-ups.
 * Internal class names, table names and service names are deliberately kept
 * out — this is a public page about proprietary systems.
 * Lines marked `REVIEW` are reasoning I haven't verified in code — confirm or cut.
 */
export const projects: Project[] = [
  {
    slug: "async-validation-framework",
    title: "Rule-Driven Validation Engine",
    description:
      "Concurrent, config-driven pre-validation across M nodes × N rules — 12.8× throughput, ~90% lower latency.",
    kind: "professional",
    status: "production",
    category: "Concurrency · Performance",
    organisation: "Jio Platforms",
    technologies: ["Java", "Spring Boot", "CompletableFuture", "ExecutorService", "Apache Velocity", "JDBC", "JMeter"],
    featured: true,
    problem: {
      body: "Disaster-recovery prechecks for database clusters run roughly M nodes × N validations, and each validation talks to a different external system with its own request/response contract — some synchronous, some completing later via callback. A hardcoded, sequential design meant latency grew with every rule, every new validation needed a code change and a deploy, and results were hard to audit or re-run.",
    },
    solution: {
      body: "A rule-driven engine with a fixed pipeline: resolve the applicable rules, expand them rule × node into concrete executions, persist each one as IN_PROGRESS, transform to the provider's contract, call out, and correlate completions — synchronously or via callback.",
      points: [
        "Rules live in the database and request/response transformation lives in templates, so a new validation is configuration, not code.",
        "Independent I/O-bound calls fan out concurrently, then join at a barrier and aggregate deterministically.",
        "Callbacks are stateless: a UUID in the callback URL maps straight to a database row, so any pod can handle any callback.",
      ],
    },
    architecture: {
      lanes: [
        [{ id: "req", label: "Precheck request", detail: "cluster · nodes", kind: "client" }],
        [{ id: "rules", label: "Rule resolver", detail: "rule × node expansion", kind: "service" }],
        [{ id: "exec", label: "Executor", detail: "CompletableFuture fan-out", kind: "service" }],
        [
          { id: "ext1", label: "External validator", detail: "sync", kind: "external" },
          { id: "ext2", label: "External validator", detail: "async · callback", kind: "external" },
        ],
        [{ id: "db", label: "Execution state", detail: "UUID-keyed rows · batch update", kind: "store" }],
      ],
      caption: "Resolve → expand → persist → transform → call → correlate → update.",
    },
    engineering: {
      points: [
        "Rule metadata and transformation templates (Apache Velocity, selected per stage) stored in the DB — the core engine stays closed for modification.",
        "Fan-out with CompletableFuture on an explicit, bounded ExecutorService; allOf().join() as the barrier, then deterministic aggregation.",
        "Each expanded execution gets a UUID embedded in its callback URL; completion is a direct DB lookup — no in-memory correlation map.",
        "Removed an N+1 pattern on the result path: one bulk SELECT, nested HashMaps for O(1) correlation, one JDBC batch UPDATE.",
        "Safe re-runs: triggering again soft-deletes the previous run's rows, so there's a clean run and an intact audit trail.",
      ],
    },
    tradeoffs: {
      points: [
        "Explicit ExecutorService over parallelStream() — the common ForkJoinPool is shared JVM-wide and gives no isolation or sizing control for I/O-heavy calls.",
        "CompletableFuture over @Async — this isn't fire-and-forget; it needs fan-out, a barrier and aggregation.",
        "UUID + durable DB state over a message queue for callbacks — the integration contract was callback-based and bounded, so a queue would add infrastructure without removing the callback.",
        "Templates in the DB make new validations config-only, at the cost of compile-time safety — template errors surface at runtime.",
        "JDBC batching over per-row ORM writes for high-volume state rows: far fewer round-trips.",
      ],
    },
    failureModes: {
      points: [
        "A pod restarts mid-run → state is in the DB, and callbacks find their row by UUID on any pod.",
        "A user re-triggers validation while one is running → previous rows are deactivated, so a clean run never mixes with a stale one.",
        // REVIEW — only keep if you're comfortable discussing timeouts in an interview.
        "One slow external validator → the bounded pool caps the blast radius; a per-call timeout is what fully protects it.",
      ],
    },
    results: [
      { value: "12.8×", label: "throughput", direction: "up", source: "JMeter" },
      { value: "~90%", label: "validation latency", direction: "down", source: "JMeter" },
      { value: "25%", label: "downstream errors", direction: "down" },
    ],
    resultNotes: [
      "New validations ship as configuration and templates instead of engine changes.",
      "Result persistence went from per-rule database calls to a constant bulk SELECT + batch UPDATE.",
    ],
    linkNote: "Internal system — source is proprietary.",
  },
  {
    slug: "mongodb-cluster-sync",
    title: "Cluster Sync Orchestration",
    description:
      "Pluggable, callback-driven async workflow that took a central CMDB off the critical path — 60% fewer sync failures.",
    kind: "professional",
    status: "production",
    category: "Distributed workflows",
    organisation: "Jio Platforms",
    technologies: ["Java", "Spring Boot", "REST", "Async callbacks", "MongoDB"],
    featured: true,
    problem: {
      body: "Synchronizing database-cluster membership depended on a centralized CMDB path that 8+ services relied on. When that path failed, sync failed with it — a single point of failure, with no durable record of where a long-running sync had got to.",
    },
    solution: {
      body: "Moved orchestration and workflow state into the DR core service as a pluggable async framework. A shared lifecycle (persist → trigger → callback → update → next step) runs any operation; which operation runs is decided by configurable rules.",
    },
    architecture: {
      lanes: [
        [{ id: "ui", label: "UI / BFF", detail: "sync request", kind: "client" }],
        [{ id: "core", label: "Orchestration engine", detail: "persist · trigger · correlate", kind: "service" }],
        [
          { id: "op1", label: "Step 1 · Cluster sync", detail: "external API · callback", kind: "external" },
          { id: "op2", label: "Step 2 · Role update", detail: "CMDB API · callback", kind: "external" },
        ],
        [{ id: "state", label: "Workflow state", detail: "UUID per step · shared group ID", kind: "store" }],
      ],
      caption: "Step 2 needs the primary/secondary roles returned by step 1's callback.",
    },
    engineering: {
      points: [
        "Each async operation gets a UUID correlation ID, persisted as IN_PROGRESS before the external call and embedded in the callback URL.",
        "On callback: look up by UUID, store the payload, update state, extract primary/secondary roles, then start the dependent step with a new UUID.",
        "Both steps share a group ID, so the system tracks one overall sync while each step keeps independent state.",
        "Reused the existing generic validation-request lifecycle instead of inventing workflow-specific tables.",
        "Request threads return immediately — nothing waits on the long-running external operation.",
      ],
    },
    tradeoffs: {
      points: [
        "Service-level orchestration over a workflow engine (e.g. Camunda) — a bounded two-step callback flow didn't justify timers, BPMN and engine operations.",
        "Callbacks over Kafka — the external contract was already callback-based; a broker would add infrastructure without replacing it.",
        "CMDB still participates in specific operations; it's no longer the centralized dependency every sync runs through.",
      ],
    },
    failureModes: {
      points: [
        "Step 1 fails → marked failed; step 2 never starts, because it depends on step 1's output.",
        "Step 2 fails → step 1 stays SUCCESS; the failure is localized to one step instead of the whole sync.",
        "Service restarts mid-workflow → state is durable; the callback finds its row by UUID.",
        // REVIEW — design consideration from your notes, not a verified implementation detail.
        "Duplicate callback → the persisted UUID gives a stable key to check current state before applying it again.",
      ],
    },
    results: [
      { value: "60%", label: "sync failures", direction: "down" },
      { value: "8+", label: "services off the single point of failure" },
    ],
    linkNote: "Internal system — source is proprietary.",
  },
  {
    slug: "cloud-subscription-onboarding",
    title: "Cloud Subscription Onboarding",
    description:
      "Multi-service onboarding workflow — orders, Camunda, async cloud validation, discovery and compensation on failure.",
    kind: "professional",
    status: "production",
    category: "Distributed workflows",
    organisation: "Jio Platforms",
    technologies: ["Java", "Spring Boot", "OpenFeign", "Camunda", "JPA", "CompletableFuture", "Azure"],
    featured: true,
    problem: {
      body: "Onboarding a customer's cloud subscription isn't one request. It spans order creation, a workflow engine, cloud-credential validation that completes asynchronously, and resource discovery — each owned by a different service. Any step can fail after earlier ones have succeeded.",
    },
    solution: {
      body: "A Spring Boot orchestration layer that persists the request, books the order and starts the Camunda workflow, then runs cloud validation asynchronously with a callback. State transitions are explicit, discovery runs only after validation succeeds, and partial failures are compensated instead of left behind.",
    },
    architecture: {
      lanes: [
        [{ id: "req", label: "Onboarding request", kind: "client" }],
        [{ id: "svc", label: "Onboarding service", detail: "Spring Boot · OpenFeign", kind: "service" }],
        [
          { id: "om", label: "Order Management", kind: "external" },
          { id: "cam", label: "Camunda workflow", kind: "external" },
          { id: "val", label: "Cloud validation", detail: "async · callback", kind: "external" },
        ],
        [{ id: "state", label: "Subscription state", detail: "in-progress → discovery / failed", kind: "store" }],
        [{ id: "disc", label: "Discovery job", kind: "service" }],
      ],
      caption: "Two tracks: order + workflow, and async validation → discovery.",
    },
    engineering: {
      points: [
        "OpenFeign clients for Order Management, Camunda and the validation service.",
        "Kept the workflow reference so an order can always be traced to its process instance.",
        "Validation callback correlated by subscription ID in the callback URL, normalized, then applied as a state transition.",
        "Success moves the subscription to discovery and triggers the discovery job; failure moves it to Validation Failed.",
        "Compensation when a later step fails after an earlier one succeeded — no orphaned orders.",
        "CompletableFuture to resolve tenant and default-project data in parallel during order creation.",
      ],
    },
    tradeoffs: {
      points: [
        "Async callback over blocking or polling — validation can take a while, and blocking would tie our availability and latency to the downstream service.",
        "Camunda for the order workflow — it's long-lived and multi-step; the service starts it and keeps the reference rather than re-implementing it.",
        "Explicit persisted state over one big transaction — a database transaction can't span external services, so state + compensation is the honest model.",
      ],
    },
    failureModes: {
      points: [
        "Order booked but workflow start fails → compensation cleans up the earlier step.",
        "Validation fails → subscription marked Validation Failed; discovery never runs.",
        // REVIEW — phrased as a known gap, which reads as maturity; cut if you'd rather not.
        "Callback never arrives → subscription stays in progress; a timeout + reconciliation sweep is the next thing I'd add.",
      ],
    },
    linkNote: "Internal system — source is proprietary.",
  },
  {
    slug: "replication-state-events",
    title: "DR Replication-State Events",
    description:
      "Publishing disaster-recovery replication state to Kafka and observability systems with idempotent retries.",
    kind: "professional",
    status: "production",
    category: "Event-driven",
    organisation: "Jio Platforms",
    technologies: ["Java", "Spring Boot", "Kafka"],
    problem: {
      body: "Replication state of customer DR workloads had to reach both Kafka consumers and observability systems reliably.",
    },
    solution: {
      body: "Spring Boot APIs that publish replication state to two sinks — Kafka and observability — with idempotent retries and dual-sink synchronization.",
    },
    architecture: {
      lanes: [
        [{ id: "dr", label: "DR replication", detail: "state changes", kind: "external" }],
        [{ id: "api", label: "Publisher API", detail: "Spring Boot", kind: "service" }],
        [
          { id: "kafka", label: "Kafka", kind: "queue" },
          { id: "obs", label: "Observability", kind: "infra" },
        ],
      ],
      caption: "One state change, two sinks, kept in sync.",
    },
    engineering: {
      points: [
        "Idempotent retries so a retried publish doesn't produce a duplicate state change.",
        "Dual-sink synchronization between Kafka and observability systems.",
      ],
    },
    failureModes: {
      points: [
        // REVIEW
        "Publish fails after a partial write → retried; idempotency makes the retry safe.",
        // REVIEW
        "One sink succeeds and the other fails → dual-sink synchronization keeps the two views consistent.",
      ],
    },
    linkNote: "Internal system — source is proprietary.",
  },
  {
    slug: "dr-configuration-apis",
    title: "DR Configuration & Discovery APIs",
    description:
      "Hierarchical resource discovery across cloud providers, locations, subscriptions and projects — without query explosion.",
    kind: "professional",
    status: "production",
    category: "API design",
    organisation: "Jio Platforms",
    technologies: ["Java", "Spring Boot", "Builder", "Specification", "Strategy"],
    problem: {
      body: "Customers configuring disaster recovery need to discover and map resources down a hierarchy — cloud provider → location → subscription → project — with any combination of optional filters. Each new filter threatened another if/else branch or another repository method.",
    },
    solution: {
      body: "Spring Boot APIs on a reusable query framework built from three patterns, each with one job: Builder constructs, Specification filters, Strategy chooses.",
    },
    architecture: {
      lanes: [
        [{ id: "client", label: "DR console", kind: "client" }],
        [{ id: "api", label: "Discovery APIs", detail: "Spring Boot", kind: "service" }],
        [{ id: "strat", label: "Strategy", detail: "pick discovery behaviour", kind: "service" }],
        [{ id: "qf", label: "Builder + Specifications", detail: "composable predicates", kind: "service" }],
        [{ id: "db", label: "Resource data", kind: "store" }],
      ],
      caption: "Cloud provider → location → subscription → project.",
    },
    engineering: {
      points: [
        "Builder constructs query criteria from the request, step by step.",
        "Specifications encapsulate individual predicates and compose with AND/OR.",
        "Strategy isolates different discovery behaviours behind one interface.",
      ],
    },
    tradeoffs: {
      points: [
        "More abstractions up front, in exchange for no conditional query branching and no repository-method explosion.",
        "New filter = new Specification; new discovery behaviour = new Strategy. The orchestration doesn't change (Open/Closed).",
      ],
    },
    linkNote: "Internal system — source is proprietary.",
  },
  {
    slug: "log-retrieval-tooling",
    title: "Centralized Log Retrieval",
    description: "Internal tool for pulling logs across Kubernetes clusters and databases — adopted by ~200 engineers.",
    kind: "professional",
    status: "production",
    category: "Developer tooling",
    organisation: "Jio Platforms",
    technologies: ["Kubernetes"],
    problem: {
      body: "Debugging across 20+ microservices meant gathering logs from multiple Kubernetes clusters and databases by hand.",
    },
    solution: {
      body: "Internal tooling that retrieves logs centrally across Kubernetes clusters and databases.",
    },
    results: [
      { value: "~30%", label: "debugging time", direction: "down" },
      { value: "20+", label: "microservices covered" },
      { value: "~200", label: "engineers using it" },
    ],
    linkNote: "Internal tool — source is proprietary.",
  },
  {
    slug: "ntpc-naari-shakti",
    title: "NTPC Naari Shakti Platform",
    description: "Multi-role marketplace backend in Go — 40+ REST APIs, JWT + RBAC, transactional orders.",
    kind: "personal",
    status: "shipped",
    category: "Backend · Go",
    period: "Mar 2026 – May 2026",
    technologies: ["Go", "Gin", "GORM", "PostgreSQL", "Redis", "JWT", "Nginx", "Docker"],
    featured: true,
    problem: {
      body: "A marketplace with three kinds of users — admins, captains and artisans — needed product listings, inventory, orders and artisan onboarding, with approvals before anything went live.",
    },
    solution: {
      body: "A Go backend using Gin and a clean three-layer architecture (Controller → Service → Repository), exposing 40+ REST APIs.",
    },
    architecture: {
      lanes: [
        [{ id: "client", label: "Clients", detail: "Admin · Captain · Artisan", kind: "client" }],
        [{ id: "nginx", label: "Nginx", kind: "infra" }],
        [{ id: "api", label: "Gin API", detail: "JWT · RBAC middleware", kind: "service" }],
        [
          { id: "pg", label: "PostgreSQL", detail: "GORM", kind: "store" },
          { id: "redis", label: "Redis", detail: "token revocation", kind: "store" },
        ],
      ],
      caption: "Controller → Service → Repository, containerised with Docker behind Nginx.",
    },
    engineering: {
      points: [
        "Controller–Service–Repository layering in Gin.",
        "JWT authentication with Redis-backed token revocation.",
        "Three-role RBAC (Admin, Captain, Artisan) with a two-level approval workflow enforced in Gin middleware.",
        "Transactional order processing with GORM for atomic inventory updates under concurrent requests.",
        "Docker + Nginx for production deployment.",
      ],
    },
    tradeoffs: {
      points: [
        "Redis-backed revocation gives stateless JWTs a way to be invalidated, at the cost of a Redis check per request.",
      ],
    },
    failureModes: {
      points: [
        "Concurrent orders for the same item → the order and its inventory update commit atomically in one GORM transaction.",
        "Stolen or logged-out token → revoked in Redis and rejected by middleware.",
      ],
    },
    results: [{ value: "40+", label: "REST APIs" }, { value: "3", label: "roles with 2-level approval" }],
    github: "https://github.com/NTPC-NARISHAKTI/narishakti",
  },
];
