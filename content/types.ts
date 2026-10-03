/**
 * Content model for the whole site.
 *
 * Every page reads from the files in /content. To change what the site says,
 * edit those files — you should never need to touch /src/components.
 *
 * Optional fields are optional on purpose: if you leave one out, the UI simply
 * hides that block instead of rendering an empty heading.
 */

export type IconName =
  | "github"
  | "linkedin"
  | "mail"
  | "leetcode"
  | "file"
  | "globe"
  | "x";

export type Link = {
  label: string;
  href: string;
  icon?: IconName;
  /** Shown as secondary text, e.g. "@thepredator07" */
  handle?: string;
};

export type Metric = {
  /** The number as it should be displayed, e.g. "12.8×" or "~90%" */
  value: string;
  /** What moved, e.g. "validation latency" */
  label: string;
  /** Direction of change, renders ↑ / ↓ */
  direction?: "up" | "down";
  /** Where the number comes from, e.g. "JMeter" */
  source?: string;
};

export type Profile = {
  name: string;
  initials: string;
  role: string;
  /** One-line focus areas, rendered with separators */
  focus: string[];
  /** Short engineering statement shown under the name */
  statement: string;
  /** 2–3 sentence summary for the About block */
  summary: string;
  location: string;
  email: string;
  /** ISO date your professional career started. Years of experience is computed from it. */
  careerStart: string;
  /** Public path of the resume PDF (lives in /public) */
  resume: string;
  /** What you are open to — used in the Contact section */
  openTo: string[];
  /** Headline metrics on the home screen. Keep these to real, sourced numbers. */
  highlights: Metric[];
  /** Domains you have worked in */
  domains: string[];
  /** Ordered list of social/profile links */
  links: Link[];
};

export type Experience = {
  company: string;
  title: string;
  /** "YYYY-MM" */
  start: `${number}-${number}`;
  /** "YYYY-MM" or "present" */
  end: `${number}-${number}` | "present";
  location?: string;
  /** Team / product area */
  team?: string;
  /** Domains, e.g. ["Disaster Recovery", "DRaaS"] */
  domains?: string[];
  summary?: string;
  /**
   * Systems you worked on (rendered as a ● list).
   * Plain string, or { name, project } to link to a project's case study.
   */
  systems: (string | { name: string; project: string })[];
  /** Full achievement bullets */
  highlights: string[];
  technologies: string[];
  impact?: Metric[];
};

export type ProjectKind = "professional" | "personal" | "experiment" | "learning";
export type ProjectStatus = "production" | "shipped" | "in-progress" | "archived";

/** A node in a simple left→right / top→bottom architecture flow. */
export type ArchNode = {
  id: string;
  label: string;
  /** small mono caption under the label */
  detail?: string;
  kind?: "client" | "service" | "queue" | "store" | "external" | "infra";
};

export type ArchitectureFlow = {
  /** Columns rendered left→right (stacked top→bottom on mobile). Each column can hold several nodes. */
  lanes: ArchNode[][];
  caption?: string;
};

export type Section = {
  /** Paragraph text (optional) */
  body?: string;
  /** Bullet list (optional) */
  points?: string[];
};

export type Project = {
  slug: string;
  title: string;
  /** One line */
  description: string;
  kind: ProjectKind;
  status: ProjectStatus;
  category: string;
  /** Where it was built, e.g. "Jio Platforms" — leave empty for personal work */
  organisation?: string;
  period?: string;
  technologies: string[];
  featured?: boolean;

  problem?: Section;
  solution?: Section;
  architecture?: ArchitectureFlow;
  engineering?: Section;
  tradeoffs?: Section;
  failureModes?: Section;
  results?: Metric[];
  resultNotes?: string[];

  github?: string;
  demo?: string;
  /** Explain why a link is missing (e.g. "Internal — proprietary code") */
  linkNote?: string;
};

export type SkillGroup = {
  /** Short uppercase-ish heading, e.g. "Languages" */
  name: string;
  /** Mono label, e.g. "lang" */
  key: string;
  items: { name: string; note?: string }[];
};

export type Education = {
  degree: string;
  institution: string;
  start: string;
  end: string;
  notes?: string[];
};

export type Certification = {
  name: string;
  issuer: string;
  date?: string;
  url?: string;
};

export type Achievement = {
  title: string;
  date?: string;
  description?: string;
  url?: string;
};

export type NoteFrontmatter = {
  title: string;
  /** "YYYY-MM-DD" */
  date: string;
  summary: string;
  tags: string[];
  /** Drafts are hidden in production unless NEXT_PUBLIC_SHOW_DRAFTS=1 */
  draft?: boolean;
};

export type SiteConfig = {
  /** Public URL the site is deployed at — used for SEO, sitemap and OG tags */
  url: string;
  title: string;
  description: string;
  keywords: string[];
};
