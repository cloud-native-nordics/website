import { notFound } from "next/navigation";
import Link from "next/link";
import { loadGroup, loadGroups } from "@/lib/groups";
import { fetchBevyEvents, getEventsForChapter } from "@/lib/bevy";
import { EventCard } from "@/components/EventCard";
import { GroupMap } from "@/components/GroupMap";
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
          <img
            src={logoUrl || "/logo-icon.svg"}
            alt=""
            className="w-16 h-16 rounded-xl object-cover mb-4"
          />
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-2">
            {group.name}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {group.city}, {group.country}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {group.member_count && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-brand-pink to-brand-gold text-white">
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
        {/* Location Map */}
        <div className="mb-12">
          <h2 className="text-xl font-heading font-bold text-navy dark:text-white mb-4">
            Location
          </h2>
          <div className="max-w-md">
            <GroupMap latitude={group.latitude} longitude={group.longitude} name={group.name} />
          </div>
        </div>

        {/* Organizers */}
        {group.organizers && group.organizers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-heading font-bold text-navy dark:text-white mb-4">
              Organizers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {group.organizers.map((org) => (
                <div
                  key={org.name}
                  className="flex flex-col items-center text-center p-6 rounded-xl bg-white dark:bg-navy-card border border-gray-200 dark:border-white/10 hover:border-brand-pink/50 transition-colors"
                >
                  {org.photo ? (
                    <img
                      src={org.photo}
                      alt={org.name}
                      className="w-20 h-20 rounded-full object-cover mb-3"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-pink to-brand-gold flex items-center justify-center text-white font-heading font-bold text-xl mb-3">
                      {org.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                  )}
                  <div className="font-heading font-bold text-navy dark:text-white text-sm">{org.name}</div>
                  {org.role && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{org.role}</div>
                  )}
                  {org.company && (
                    <div className="text-xs text-brand-pink font-medium mt-0.5">{org.company}</div>
                  )}
                  <div className="flex items-center gap-3 mt-3">
                    {org.linkedin && (
                      <a href={org.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-pink transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                    )}
                    {org.github && (
                      <a href={org.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-pink transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      </a>
                    )}
                    {org.bluesky && (
                      <a href={org.bluesky} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-pink transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.785 2.627 3.584 3.493 6.173 3.26-.895.152-3.476.73-3.476 2.683 0 3.559 5.463 3.378 6.588 1.088.093-.19.149-.333.168-.384.019.051.075.194.168.384 1.125 2.29 6.588 2.471 6.588-1.088 0-1.953-2.581-2.531-3.476-2.683 2.589.233 5.388-.633 6.173-3.26C19.622 9.418 20 4.458 20 3.768c0-.69-.139-1.861-.902-2.203-.659-.299-1.664-.621-4.3 1.24C12.046 4.747 9.087 8.686 8 10.8h4z"/></svg>
                      </a>
                    )}
                    {org.twitter && (
                      <a href={org.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-pink transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </a>
                    )}
                    </div>
                  </div>
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
