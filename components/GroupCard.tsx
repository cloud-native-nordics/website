import Link from "next/link";
import type { GroupWithData } from "@/lib/types";

export function GroupCard({ group }: { group: GroupWithData }) {
  const nextEvent = group.upcoming_events[0];

  return (
    <Link
      href={`/groups/${group.slug}`}
      className="group relative block rounded-xl overflow-hidden bg-white dark:bg-navy-card border border-gray-200 dark:border-white/10 hover:border-brand-pink dark:hover:border-brand-pink transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl bg-gradient-to-br from-brand-pink/5 to-brand-gold/5" />

      <div className="relative p-6">
        {group.member_count && (
          <span className="absolute top-4 right-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-brand-pink to-brand-gold text-white">
            {group.member_count.toLocaleString()} members
          </span>
        )}
        <img
          src={group.logo_url || "/logo-icon.svg"}
          alt=""
          className="w-12 h-12 rounded-lg object-cover mb-3"
        />
        <h3 className="text-lg font-heading font-bold text-navy dark:text-white group-hover-gradient transition-colors">
          {group.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {group.city}, {group.country}
        </p>

        {nextEvent ? (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Next Event
            </p>
            <p className="text-sm font-medium text-navy dark:text-gray-200 truncate">
              {nextEvent.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(nextEvent.start_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">
              No upcoming events
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
