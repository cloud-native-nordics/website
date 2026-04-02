import { GroupCard } from "./GroupCard";
import type { GroupWithData } from "@/lib/types";

export function GroupsGrid({ groups }: { groups: GroupWithData[] }) {
  return (
    <section id="groups" className="py-16 bg-nord5 dark:bg-nord0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-heading font-bold text-center mb-4 text-nord0 dark:text-white">
          Community Groups
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Find your local cloud native community across the Nordic countries
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groups.map((group) => (
            <GroupCard key={group.slug} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}
