import { notFound } from "next/navigation";
import Link from "next/link";
import { loadGroup, loadGroups } from "@/lib/groups";
import { fetchBevyEvents, getEventsForChapter } from "@/lib/bevy";
import { EventCard } from "@/components/EventCard";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const group = await loadGroup(slug);
  if (!group) return { title: "Group Not Found" };

  return {
    title: `${group.name} — Cloud Native Nordics`,
    description: `Join ${group.name} in ${group.city}, ${group.country}. ${group.member_count ? group.member_count + " members." : ""}`,
  };
}

export default async function GroupPage({ params }: PageProps) {
  const { slug } = await params;
  const group = await loadGroup(slug);
  if (!group) notFound();

  const allEvents = await fetchBevyEvents();
  const { upcoming, past } = getEventsForChapter(allEvents, group.platform_url);
  const firstEvent = upcoming[0] || past[0];
  const logoUrl = firstEvent?.chapter_logo_url;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy-deep py-16 sm:py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-brand-pink/15 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/#groups"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Groups
          </Link>
          <div className="flex items-center gap-4 mb-2">
            {logoUrl && (
              <img
                src={logoUrl}
                alt=""
                className="w-16 h-16 rounded-xl object-cover"
              />
            )}
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
              {group.name}
            </h1>
          </div>
          <p className="text-lg text-gray-300 mb-4">
            {group.city}, {group.country}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {group.member_count && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-pink/20 text-brand-pink">
                {group.member_count.toLocaleString()} members
              </span>
            )}
            <a
              href={group.platform_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
            >
              View on Bevy
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Organizers */}
        {group.organizers && group.organizers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-heading font-bold text-navy dark:text-white mb-4">
              Organizers
            </h2>
            <div className="flex flex-wrap gap-4">
              {group.organizers.map((org) => (
                <div
                  key={org.name}
                  className="px-4 py-3 rounded-lg bg-white dark:bg-navy-card border border-gray-200 dark:border-white/10"
                >
                  <div className="font-medium text-navy dark:text-white">{org.name}</div>
                  {org.role && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">{org.role}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        <div className="mb-12">
          <h2 className="text-xl font-heading font-bold text-navy dark:text-white mb-4">
            Upcoming Events
          </h2>
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No upcoming events scheduled.</p>
          )}
        </div>

        {/* Past Events */}
        {past.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-heading font-bold text-navy dark:text-white mb-4">
              Past Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {past.slice(0, 10).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* CFP CTA */}
        <div className="text-center py-8 px-6 rounded-xl bg-gradient-to-br from-brand-pink/10 to-brand-gold/10 border border-brand-pink/20">
          <h3 className="text-lg font-heading font-bold text-navy dark:text-white mb-2">
            Want to speak at {group.name}?
          </h3>
          <a
            href="https://cfp.cloudnativenordics.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 px-6 py-3 rounded-full bg-gradient-to-r from-brand-pink to-brand-gold text-white font-heading font-bold hover:opacity-90 transition-opacity"
          >
            Submit a Talk Proposal
          </a>
        </div>
      </div>
    </>
  );
}
