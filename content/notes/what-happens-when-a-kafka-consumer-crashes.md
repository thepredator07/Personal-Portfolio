---
title: What happens when a Kafka consumer crashes?
date: 2026-10-01
summary: Offsets, rebalances and why "at-least-once" means your handlers must be idempotent.
tags: [kafka, reliability, distributed-systems]
draft: true
---

> **Draft written as a starter — rewrite in your own words before publishing.**

A consumer in a group owns a set of partitions. It reads records, processes them, and *commits offsets* to record how far it got. A crash is interesting because of the gap between those two steps.

## The sequence

1. The consumer stops sending heartbeats.
2. After `session.timeout.ms`, the group coordinator considers it dead.
3. The group **rebalances**: its partitions are reassigned to surviving members.
4. The new owner resumes from the **last committed offset** — not from the last record the dead consumer processed.

## Why duplicates happen

If the consumer processed records 100–149 but last committed offset 100, the new owner re-reads 100–149. Kafka's default delivery is **at-least-once**, so the handler sees those records twice.

```text
processed:  100 ───────── 149   ✕ crash
committed:  100
replayed:   100 ───────── 149   (new owner)
```

## What to do about it

- **Make handlers idempotent.** Key the side effect by a stable id (event id, or partition + offset) and ignore repeats.
- **Commit after processing**, never before — committing first turns a crash into silent data loss.
- **Keep processing time under `max.poll.interval.ms`**, or a slow-but-alive consumer gets kicked out and triggers the same rebalance.
- Reach for transactions / exactly-once semantics only when the sink is Kafka itself; for external sinks, idempotency is usually simpler.

## Takeaway

A crashed consumer doesn't lose data — it *repeats* it. Design for the repeat.
