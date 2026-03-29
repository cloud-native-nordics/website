"use client";

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

export function MobileMenu({ links, onClose }: { links: NavLink[]; onClose: () => void }) {
  return (
    <div className="md:hidden border-t border-gray-200/20 dark:border-white/10 bg-warm-white/95 dark:bg-navy-deep/95 backdrop-blur-md">
      <div className="px-4 py-3 space-y-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            onClick={onClose}
            className="block py-2 text-base font-medium text-navy/70 dark:text-gray-300 hover:text-brand-blue"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
