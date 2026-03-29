const PARTNERS = [
  {
    name: "Cloud Native Denmark",
    href: "https://cloudnativedenmark.dk/",
  },
  {
    name: "Cloud Native Days Norway",
    href: "https://2026.cloudnativedays.no/",
  },
];

export function Partners() {
  return (
    <section className="py-16 bg-warm-white dark:bg-navy-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-heading font-bold mb-4 text-navy dark:text-white">
          Partners
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Organizations we collaborate with across the Nordics
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {PARTNERS.map((partner) => (
            <a
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-5 rounded-xl bg-white dark:bg-navy-card border border-gray-200 dark:border-white/10 hover:border-brand-pink dark:hover:border-brand-pink transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <span className="font-heading font-bold text-navy dark:text-white">
                {partner.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
