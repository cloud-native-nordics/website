const CONFERENCES = [
  {
    name: "KCD Helsinki",
    location: "Helsinki",
    date: "May 20, 2026",
    href: "https://community.cncf.io/events/details/cncf-kcd-helsinki-presents-kubernetes-community-days-helsinki-2026/",
    logo: "/logo-icon.svg",
  },
  {
    name: "Cloud Native Days Norway",
    location: "Bergen",
    date: "October 26-27, 2026",
    href: "https://2026.cloudnativedays.no/",
    logo: "/images/partner-norway.svg",
  },
  {
    name: "Cloud Native Denmark",
    location: "Copenhagen",
    date: "November 19-20, 2026",
    href: "https://cloudnativedenmark.dk/",
    logo: "/images/partner-denmark.svg",
  },
];

export function Partners() {
  return (
    <section className="py-16 bg-warm-white dark:bg-navy-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-heading font-bold mb-4 text-navy dark:text-white">
          Conferences
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Cloud native conferences across the Nordics
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {CONFERENCES.map((conf) => (
            <a
              key={conf.name}
              href={conf.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 px-8 py-6 rounded-xl bg-white dark:bg-navy-card border border-gray-200 dark:border-white/10 hover:border-brand-pink dark:hover:border-brand-pink transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full sm:w-auto sm:min-w-[280px]"
            >
              <img src={conf.logo} alt={conf.name} className="h-14 w-auto" />
              <div>
                <div className="font-heading font-bold text-sm text-navy dark:text-white">
                  {conf.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {conf.location} &middot; {conf.date}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
