import { Hero } from "@/components/Hero";
import { loadGroups } from "@/lib/groups";

export default async function Home() {
  const groups = await loadGroups();
  const totalMembers = groups.reduce((sum, g) => sum + (g.member_count || 0), 0);

  return (
    <>
      <Hero totalMembers={totalMembers} />
    </>
  );
}
