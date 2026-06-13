import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const GROUPS_DIR = path.join(process.cwd(), "data", "groups");
const OUTPUT = path.join(process.cwd(), "lib", "groups-data.json");
const LOGO_DIR = path.join(process.cwd(), "public", "images", "group-logos");
const OCG_BASE = "https://ocgroups.dev";

const files = fs
  .readdirSync(GROUPS_DIR)
  .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"));

const groups = files
  .map((file) => {
    const slug = file.replace(/\.ya?ml$/, "");
    const content = fs.readFileSync(path.join(GROUPS_DIR, file), "utf-8");
    const data = yaml.load(content);
    return { slug, ...data };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

// Fetch logo + short description for every European CNCF group on ocgroups,
// keyed by its slug. (region/community brackets are percent-encoded.)
async function fetchGroupMeta() {
  const meta = new Map();
  for (let offset = 0; offset < 300; offset += 10) {
    let data;
    try {
      const res = await fetch(
        `${OCG_BASE}/explore/groups/search?community%5B0%5D=cncf&region%5B0%5D=europe&offset=${offset}`
      );
      if (!res.ok) break;
      data = await res.json();
    } catch {
      break;
    }
    const page = data.groups ?? [];
    for (const g of page) {
      const slug = g.slug_pretty || g.slug;
      meta.set(slug, {
        logo_url: g.logo_url,
        description: g.description_short || undefined,
      });
    }
    if (page.length < 10 || offset + 10 >= (data.total ?? 0)) break;
  }
  return meta;
}

// ocgroups hotlink-protects /images (403 unless Referer is ocgroups.dev), so we
// download logos at build time and serve them as first-party assets.
async function downloadLogo(slug, logoPath) {
  const ext = (logoPath.match(/\.([a-z0-9]+)(?:\?|$)/i)?.[1] || "png").toLowerCase();
  const url = logoPath.startsWith("http") ? logoPath : `${OCG_BASE}${logoPath}`;
  const res = await fetch(url, { headers: { Referer: `${OCG_BASE}/` } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(LOGO_DIR, { recursive: true });
  const file = `${slug}.${ext}`;
  fs.writeFileSync(path.join(LOGO_DIR, file), buf);
  return `/images/group-logos/${file}`;
}

const meta = await fetchGroupMeta();
let logos = 0;
for (const group of groups) {
  if (!group.ocg_slug) continue;
  const info = meta.get(group.ocg_slug);
  if (!info) continue;
  if (info.description) group.description = info.description;
  if (info.logo_url) {
    try {
      group.logo = await downloadLogo(group.slug, info.logo_url);
      logos++;
    } catch (err) {
      console.warn(`  logo download failed for ${group.slug}: ${err.message}`);
    }
  }
}

fs.writeFileSync(OUTPUT, JSON.stringify(groups, null, 2));
console.log(`Built ${groups.length} groups (${logos} logos) → ${OUTPUT}`);
