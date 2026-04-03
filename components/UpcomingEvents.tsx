import { EventCard } from "./EventCard";
import type { BevyEvent } from "@/lib/types";

export function UpcomingEvents({ events }: { events: BevyEvent[] }) {
  if (events.length === 0) {
    return (
      <section id="events" className="py-16 bg-nord6 dark:bg-nord0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4 text-nord0 dark:text-white">
            Upcoming Events
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            No upcoming events at the moment. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-16 bg-nord6 dark:bg-nord0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-heading font-bold text-center mb-4 text-nord0 dark:text-white">
          Upcoming Events
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Join us at an upcoming meetup near you
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {events.slice(0, 6).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
