---
title: Designing idempotent APIs
date: 2026-09-20
summary: Retries are inevitable in distributed systems. Idempotency keys make them safe.
tags: [api-design, reliability, distributed-systems]
draft: true
---

> **Draft written as a starter — rewrite in your own words before publishing.**

Networks fail *after* the server did the work but *before* the client heard back. The client can't tell the difference between "never happened" and "happened, response lost" — so it retries. An idempotent operation is one where that retry is harmless.

## Naturally idempotent vs. not

| Operation | Idempotent? |
| --- | --- |
| `GET /orders/42` | yes |
| `PUT /orders/42 {status: "PAID"}` | yes — same final state |
| `DELETE /orders/42` | yes — gone is gone |
| `POST /orders` | **no** — each call creates a new order |

## Idempotency keys

The client generates a unique key per *logical* operation and sends it with every attempt:

```http
POST /payments
Idempotency-Key: 6f1c2b0e-...
```

The server stores `key → result`. On a repeat it returns the stored result instead of executing again.

## Details that matter

- **Store the key and the side effect atomically** — in the same transaction, or the guarantee has a hole.
- **Handle concurrent duplicates.** Two retries can arrive at once; a unique constraint on the key decides the winner.
- **Expire keys** after a window that comfortably exceeds the client's retry horizon.
- **Reject a reused key with a different payload** — that's a client bug, not a retry.

## Takeaway

Retries are a client decision; idempotency is a server guarantee. You need both.
