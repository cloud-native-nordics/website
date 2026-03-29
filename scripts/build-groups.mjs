import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const GROUPS_DIR = path.join(process.cwd(), "data", "groups");
const OUTPUT = path.join(process.cwd(), "lib", "groups-data.json");

const files = fs.readdirSync(GROUPS_DIR).filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"));

const groups = files.map((file) => {
  const slug = file.replace(/\.ya?ml$/, "");
  const content = fs.readFileSync(path.join(GROUPS_DIR, file), "utf-8");
  const data = yaml.load(content);
  return { slug, ...data };
}).sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(OUTPUT, JSON.stringify(groups, null, 2));
console.log(`Built ${groups.length} groups → ${OUTPUT}`);
