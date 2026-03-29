import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";
import type { GroupDefinition } from "./types";

const GROUPS_DIR = path.join(process.cwd(), "data", "groups");

export async function loadGroups(): Promise<GroupDefinition[]> {
  const files = await fs.readdir(GROUPS_DIR);
  const yamlFiles = files.filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"));

  const groups = await Promise.all(
    yamlFiles.map(async (file) => {
      const slug = file.replace(/\.ya?ml$/, "");
      const content = await fs.readFile(path.join(GROUPS_DIR, file), "utf-8");
      const data = yaml.load(content) as Omit<GroupDefinition, "slug">;
      return { slug, ...data } as GroupDefinition;
    })
  );

  return groups.sort((a, b) => a.name.localeCompare(b.name));
}

export async function loadGroup(slug: string): Promise<GroupDefinition | null> {
  try {
    const filePath = path.join(GROUPS_DIR, `${slug}.yaml`);
    const content = await fs.readFile(filePath, "utf-8");
    const data = yaml.load(content) as Omit<GroupDefinition, "slug">;
    return { slug, ...data } as GroupDefinition;
  } catch {
    return null;
  }
}
