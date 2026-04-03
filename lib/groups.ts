import type { GroupDefinition } from "./types";
import groupsData from "./groups-data.json";

const groups = groupsData as GroupDefinition[];

export async function loadGroups(): Promise<GroupDefinition[]> {
  return groups;
}

export async function loadGroup(slug: string): Promise<GroupDefinition | null> {
  return groups.find((g) => g.slug === slug) || null;
}
