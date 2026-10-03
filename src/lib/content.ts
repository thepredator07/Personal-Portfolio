/**
 * Single import point for structured content, plus small derived helpers.
 * Components import from here, never from /content directly.
 */
import { profile } from "@content/profile";
import { experience } from "@content/experience";
import { projects } from "@content/projects";
import { skills } from "@content/skills";
import { education, certifications, achievements } from "@content/education";
import { site } from "@content/site";
import type { Project } from "@content/types";

export { profile, experience, projects, skills, education, certifications, achievements, site };

/** Prefix for raw <a href> / window.open paths (next/link adds it by itself). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Public URL of the resume PDF, base-path aware. */
export const resumeUrl = `${basePath}${profile.resume}`;

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Whole years since careerStart, e.g. 3. Computed at build time. */
export function yearsOfExperience(now = new Date()): number {
  const start = new Date(profile.careerStart);
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  return Math.max(0, Math.floor(months / 12));
}

/** Experience label, e.g. "3 yrs" or "2 yrs 7 mo" */
export function experienceLabel(now = new Date()): string {
  const start = new Date(profile.careerStart);
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} mo`;
  return m === 0 ? `${y} yrs` : `${y} yrs ${m} mo`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2023-10" → "Oct 2023", "present" → "Present" */
export function formatMonth(value: string): string {
  if (value === "present") return "Present";
  const [y, m] = value.split("-").map(Number);
  return m ? `${MONTHS[m - 1]} ${y}` : String(y);
}

/** "2026-10-01" → "01 Oct 2026" */
export function formatDate(value: string): string {
  const [y, m, d] = value.split("-").map(Number);
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y}`;
}

export const currentRole = experience[0];

export const kindLabel: Record<Project["kind"], string> = {
  professional: "Professional",
  personal: "Personal",
  experiment: "Experiment",
  learning: "Learning",
};

export const statusLabel: Record<Project["status"], string> = {
  production: "In production",
  shipped: "Shipped",
  "in-progress": "In progress",
  archived: "Archived",
};
