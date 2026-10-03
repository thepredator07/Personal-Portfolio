import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { profile, projects, site, currentRole, resumeUrl } from "@/lib/content";
import { getAllNotes } from "@/lib/notes";
import { sections } from "@/lib/nav";
import { Sidebar, MobileNav } from "@/components/sidebar";
import { CommandPalette, type PaletteItem } from "@/components/command-palette";
import { Providers } from "@/components/providers";

const plex = localFont({
  src: [
    { path: "./fonts/ibm-plex-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ibm-plex-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-plex",
  display: "swap",
});

const jetbrains = localFont({
  src: "./fonts/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${profile.name}` },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: profile.name, url: site.url }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: profile.name,
    title: site.title,
    description: site.description,
    firstName: profile.name.split(" ")[0],
    lastName: profile.name.split(" ").slice(1).join(" "),
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
  colorScheme: "dark",
};

function buildPaletteItems(): PaletteItem[] {
  const nav: PaletteItem[] = sections.map((s) => ({ id: `nav-${s.id}`, label: s.label, group: "Navigate", href: s.href, hint: `/${s.id}` }));
  const proj: PaletteItem[] = projects.map((p) => ({
    id: `proj-${p.slug}`,
    label: p.title,
    group: "Projects",
    href: `/projects/${p.slug}/`,
    hint: p.category,
    keywords: [...p.technologies, p.description].join(" "),
  }));
  const notes: PaletteItem[] = getAllNotes().map((n) => ({
    id: `note-${n.slug}`,
    label: n.title,
    group: "Notes",
    href: `/notes/${n.slug}/`,
    hint: `${n.readingMinutes} min`,
    keywords: [...n.tags, n.summary].join(" "),
  }));
  const links: PaletteItem[] = [
    { id: "link-resume", label: "Resume (PDF)", group: "Links", href: resumeUrl, hint: "pdf" },
    ...profile.links.map((l) => ({
      id: `link-${l.label.toLowerCase()}`,
      label: l.label,
      group: "Links" as const,
      href: l.href,
      hint: l.handle,
      external: !l.href.startsWith("mailto:"),
    })),
  ];
  return [...nav, ...proj, ...notes, ...links];
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: currentRole?.title ?? profile.role,
  description: profile.summary,
  url: site.url,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: profile.location },
  worksFor: currentRole ? { "@type": "Organization", name: currentRole.company } : undefined,
  sameAs: profile.links.filter((l) => l.href.startsWith("http")).map((l) => l.href),
  knowsAbout: site.keywords.slice(2),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const github = profile.links.find((l) => l.icon === "github")?.href ?? "";
  return (
    <html lang="en" className={`${plex.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables scroll-reveal only when JS runs. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');setTimeout(function(){if(!window.__revealReady)document.documentElement.classList.remove('js')},3000)",
          }}
        />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-50 rounded bg-fg px-3 py-2 font-mono text-xs text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Providers github={github}>
          <Sidebar initials={profile.initials} name={profile.name} role={profile.role} />
          <MobileNav initials={profile.initials} name={profile.name} />
          <div className="lg:pl-52">
            <main id="main" tabIndex={-1} className="focus:outline-none">
              {children}
            </main>
          </div>
          <CommandPalette items={buildPaletteItems()} />
        </Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </body>
    </html>
  );
}
