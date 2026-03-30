import type { BevyEvent } from "@/lib/types";

export function EventCard({ event }: { event: BevyEvent }) {
  const date = new Date(event.start_date);

  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 p-4 rounded-lg bg-white dark:bg-charcoal border border-gray-200 dark:border-white/10 hover:border-amber dark:hover:border-amber transition-colors"
    >
      <div className="flex-shrink-0 w-14 text-center">
        <div className="text-xs uppercase font-medium text-amber">
          {date.toLocaleDateString("en-US", { month: "short" })}
        </div>
        <div className="text-2xl font-heading font-bold text-slate dark:text-white">
          {date.getDate()}
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500">
          {date.getFullYear()}
        </div>
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-slate dark:text-white truncate">
          {event.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {event.chapter_title} &middot; {event.chapter_city}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {date.toLocaleDateString("en-US", {
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </a>
  );
}
