import type { NextConfig } from "next";

/**
 * Fully static export → `out/` can be hosted anywhere
 * (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3 + CloudFront).
 */
if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn(
    "\n⚠  NEXT_PUBLIC_SITE_URL is not set — canonical URLs, sitemap and OG tags will point at localhost.\n   Set it (or edit content/site.ts) before deploying.\n",
  );
}

/**
 * Sub-path the site is served from. Empty for a root domain
 * (thepredator07.github.io, a custom domain, Vercel); "/<repo>" for a
 * GitHub Pages project site. The deploy workflow sets it automatically.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
