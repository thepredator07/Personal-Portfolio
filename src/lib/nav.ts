export type NavItem = { id: string; label: string; href: string };

/** Sidebar / palette sections. `id` must match a section id on the home page. */
export const sections: NavItem[] = [
  { id: "home", label: "Home", href: "/#home" },
  { id: "about", label: "About", href: "/#about" },
  { id: "experience", label: "Experience", href: "/#experience" },
  { id: "projects", label: "Projects", href: "/#projects" },
  { id: "architecture", label: "Architecture", href: "/#architecture" },
  { id: "stack", label: "Stack", href: "/#stack" },
  { id: "notes", label: "Notes", href: "/#notes" },
  { id: "contact", label: "Contact", href: "/#contact" },
];
