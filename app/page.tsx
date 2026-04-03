import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { InteractiveMap } from "@/components/InteractiveMap";
import { GroupsGrid } from "@/components/GroupsGrid";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { About } from "@/components/About";
import { CfpSection } from "@/components/CfpSection";
import { CommunitySection } from "@/components/CommunitySection";
import { Partners } from "@/components/Partners";
import { loadGroups } from "@/lib/groups";
import { fetchBevyEvents, getEventsForChapter } from "@/lib/bevy";
import type { SiteStats, GroupWithData } from "@/lib/types";

export default async function Home() {
  const groups = await loadGroups();
  const allEvents = await fetchBevyEvents();

  const totalMembers = groups.reduce((sum, g) => sum + (g.member_count || 0), 0);

  const groupsWithEvents: GroupWithData[] = groups.map((group) => {
    const { upcoming, past } = getEventsForChapter(allEvents, group.platform_url);
    const firstEvent = upcoming[0] || past[0];
    const logo_url = firstEvent?.chapter_logo_url;
    const description = firstEvent?.chapter_description;
    return { ...group, upcoming_events: upcoming, past_events: past, logo_url, description };
  });

  const totalUpcoming = groupsWithEvents.reduce((sum, g) => sum + g.upcoming_events.length, 0);

  const countries = new Set(groups.map((g) => g.country)).size;

  const stats: SiteStats = {
    countries,
    active_groups: groups.length,
    upcoming_events: totalUpcoming,
  };

  const allUpcoming = groupsWithEvents
    .flatMap((g) => g.upcoming_events)
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  return (
    <>
      <Hero totalMembers={totalMembers} />
      <StatsBar stats={stats} />
      <InteractiveMap groups={groupsWithEvents} />
      <About />
      <GroupsGrid groups={groupsWithEvents} />
      <UpcomingEvents events={allUpcoming} />
      <CfpSection />
      <Partners />
      <CommunitySection />
    </>
  );
}
