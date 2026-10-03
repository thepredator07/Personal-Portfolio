# Khubaib Rahman — portfolio

A static Next.js site for my backend engineering work. All the content lives in `/content`, so editing it never means touching a component.

```bash
npm install
npm run dev          # http://localhost:3000 (drafts visible)
npm run build        # static export → ./out
npm run lint && npm run typecheck
```

## Editing content

| What | File |
| --- | --- |
| Name, statement, headline metrics, links, "open to" | `content/profile.ts` |
| Jobs (timeline) | `content/experience.ts` |
| Projects + case-study pages | `content/projects.ts` |
| Tech stack groups | `content/skills.ts` |
| Education, certifications, achievements | `content/education.ts` |
| SEO title / description / **site URL** | `content/site.ts` |
| Engineering notes | `content/notes/*.md` |
| Resume | `public/resume.pdf` (replace the file and keep the name) |

The types for every field are in `content/types.ts`, so your editor autocompletes them and the build fails on a typo.

**Add a project:** copy an object in `projects.ts`, give it a new `slug`, and save. It appears in the explorer, the ⌘K palette and the sitemap, and gets its own page at `/projects/<slug>/`. Optional sections you leave out (`tradeoffs`, `failureModes`, `architecture`…) are simply hidden.

**Link a job to a case study:** in `experience.ts`, write a system as `{ name: "…", project: "<slug>" }` instead of a plain string.

**Add a note:** create `content/notes/my-note.md`:

```md
---
title: Why Kafka?
date: 2026-11-02
summary: One sentence for the list and for SEO.
tags: [kafka, messaging]
draft: false
---

Markdown body…
```

Notes with `draft: true` are visible in `npm run dev` but are left out of production builds. To preview them in a build, use `NEXT_PUBLIC_SHOW_DRAFTS=1 npm run build`.

**Certifications / achievements:** add entries to the arrays in `education.ts`. Their section appears once an array is non-empty.

## Before the first deploy

1. On GitHub Pages the site URL is set automatically. On other hosts, set `NEXT_PUBLIC_SITE_URL` (the build warns if it's missing).
2. Review every line marked `REVIEW` in `content/projects.ts`, and rewrite or delete the two starter notes in `content/notes/` (both are drafts).
3. `public/resume.pdf` is a copy of the resume with the phone number removed. If you replace it, remove the number again or it will be public.

## Deploy (GitHub Pages, free)

`.github/workflows/deploy.yml` builds and publishes the site on every push to `main`.

1. Push this folder to a GitHub repo. If you name the repo `thepredator07.github.io`, the site is served at `https://thepredator07.github.io/`. Any other name serves it at `https://thepredator07.github.io/<repo>/`; the workflow detects the sub-path automatically.
2. In the repo, open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Push again, or re-run the workflow from the **Actions** tab. It goes live in about a minute.

Custom domain later: add it under Settings → Pages, then set a repo variable `SITE_URL` (Settings → Secrets and variables → Actions → Variables) to `https://your.domain`.

`out/` is plain static files, so Vercel, Netlify and Cloudflare Pages also work: build command `npm run build`, output directory `out`.

## Structure

```
content/            ← everything you edit
src/app/            ← routes: /, /projects/[slug], /notes, /notes/[slug], sitemap, robots, OG image
src/components/     ← UI (home/ = homepage sections)
src/lib/            ← content + markdown loaders
```

Stack: Next.js 16 (App Router, static export), TypeScript, Tailwind CSS v4, Motion (Framer Motion), Lucide, marked + gray-matter for notes. Fonts are self-hosted (IBM Plex Sans, JetBrains Mono).

Easter eggs: open the browser console, or try `sudo rm -rf /` in the home-page terminal.
