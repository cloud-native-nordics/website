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
import { fetchGroupData } from "@/lib/ocg";
import type { SiteStats, GroupWithData } from "@/lib/types";

export default async function Home() {
  const groups = await loadGroups();

  const totalMembers = groups.reduce((sum, g) => sum + (g.member_count || 0), 0);

  const groupsWithEvents: GroupWithData[] = await Promise.all(
    groups.map(async (group) => {
      const { upcoming, past } = await fetchGroupData(group);
      return { ...group, upcoming_events: upcoming, past_events: past };
    })
  );

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
