import type { SiteStats } from "@/lib/types";

const STAT_ICONS = {
  members: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  groups: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  events: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

export function StatsBar({ stats }: { stats: SiteStats }) {
  const items = [
    { icon: STAT_ICONS.members, value: stats.total_members.toLocaleString() + "+", label: "Total Members" },
    { icon: STAT_ICONS.groups, value: stats.active_groups.toString(), label: "Active Groups" },
    { icon: STAT_ICONS.events, value: stats.upcoming_events.toString(), label: "Upcoming Events" },
  ];

  return (
    <section className="relative -mt-8 z-10 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white dark:bg-navy-card shadow-xl dark:shadow-2xl dark:shadow-black/20 border border-gray-100 dark:border-white/5 py-8 px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {items.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <div className="text-brand-pink">{item.icon}</div>
                <div className="text-3xl font-heading font-bold text-navy dark:text-white">
                  {item.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
