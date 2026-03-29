# Cloud Native Nordics Website Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static Hugo website with a modern Next.js 15 app on Cloudflare Pages featuring live Bevy API integration, an interactive Nordic map, dark/light mode, YAML-based group management, and Slack notifications for CFP submissions.

**Architecture:** Next.js 15 App Router with SSR on Cloudflare Pages via `@cloudflare/next-on-pages`. Group definitions live in YAML files; member counts and events are fetched from the Bevy public API at request time. The existing cnnform Cloudflare Worker handles CFP submissions and gets a Slack webhook addition.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Leaflet, `@cloudflare/next-on-pages`, `gray-matter`/`js-yaml` for YAML parsing, Vitest for testing.

**Design Spec:** `docs/superpowers/specs/2026-03-29-website-redesign-design.md`

**Important Bevy API Notes (discovered during research):**
- The public events endpoint is `GET https://community.cncf.io/api/event/?page_size=500`
- Events include embedded chapter info (id, title, city, country, logo, relative_url)
- Chapter-specific lookup by slug returns 404; by numeric ID returns 403
- **Strategy:** Fetch all CNCF events, filter by chapter relative_url matching each group's `platform_url`
- **Member counts** are not available via the public API — store in YAML, update manually or via a future scraper

---

## File Structure

```
website/
├── app/
│   ├── layout.tsx                  # Root layout: metadata, fonts, ThemeProvider, Navbar, Footer
│   ├── page.tsx                    # Homepage: assembles all sections
│   ├── globals.css                 # Tailwind v4 imports + custom properties
│   └── groups/
│       └── [slug]/
│           └── page.tsx            # Group detail page
├── components/
│   ├── ThemeProvider.tsx            # Dark/light mode context + toggle logic
│   ├── ThemeToggle.tsx              # Sun/moon toggle button
│   ├── Navbar.tsx                   # Sticky nav with links + theme toggle
│   ├── MobileMenu.tsx              # Mobile hamburger menu
│   ├── Hero.tsx                     # Hero section with animated counter
│   ├── AnimatedCounter.tsx          # Count-up animation (client component)
│   ├── StatsBar.tsx                 # Total members / groups / events
│   ├── InteractiveMap.tsx           # Leaflet map (client component)
│   ├── GroupCard.tsx                # Single group preview card
│   ├── GroupsGrid.tsx               # Responsive grid of GroupCards
│   ├── EventCard.tsx                # Single event card
│   ├── UpcomingEvents.tsx           # Aggregated upcoming events section
│   ├── CfpSection.tsx               # CFP call-to-action section
│   ├── CommunitySection.tsx         # Slack/GitHub/social links
│   └── Footer.tsx                   # CNCF attribution, links, copyright
├── lib/
│   ├── types.ts                     # Shared TypeScript types
│   ├── groups.ts                    # YAML loader for group definitions
│   └── bevy.ts                      # Bevy API client
├── data/
│   └── groups/                      # One YAML file per group
│       ├── aarhus.yaml
│       ├── aalborg.yaml
│       ├── copenhagen.yaml
│       ├── helsinki.yaml
│       ├── tampere.yaml
│       ├── turku.yaml
│       ├── reykjavik.yaml
│       ├── bergen.yaml
│       ├── oslo.yaml
│       ├── stavanger.yaml
│       ├── goteborg.yaml
│       ├── stockholm.yaml
│       └── umea.yaml
├── public/
│   ├── logo.svg                     # Existing logo (copy from current static/)
│   ├── favicon.ico                  # Existing favicon
│   └── images/                      # City photos (copy from current static/)
├── __tests__/
│   ├── lib/
│   │   ├── groups.test.ts
│   │   └── bevy.test.ts
│   └── components/
│       └── ThemeProvider.test.tsx
├── tailwind.config.ts
├── next.config.ts
├── wrangler.toml
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `wrangler.toml`, `vitest.config.ts`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `.gitignore`
- Copy: `static/logo.svg` → `public/logo.svg`, `static/favicon.ico` → `public/favicon.ico`

- [ ] **Step 1: Initialize Next.js project**

Run from the **website/** directory (this will overwrite the Hugo project):

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src=false --import-alias="@/*" --use-npm
```

Select defaults when prompted. This creates the base Next.js project.

- [ ] **Step 2: Install dependencies**

```bash
npm install @cloudflare/next-on-pages js-yaml leaflet react-leaflet
npm install -D @types/js-yaml @types/leaflet vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom wrangler
```

- [ ] **Step 3: Configure wrangler.toml**

Create `wrangler.toml`:

```toml
name = "cloud-native-nordics-website"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"
```

- [ ] **Step 4: Configure next.config.ts for Cloudflare**

Replace `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

- [ ] **Step 5: Configure Tailwind with brand colors**

Replace `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#262F59",
          deep: "#0F1229",
          card: "#1A1F3D",
        },
        brand: {
          blue: "#326CE5",
          pink: "#FF6DAF",
          gold: "#FFB500",
          purple: "#512268",
          hotpink: "#F11F7E",
        },
        warm: {
          white: "#FDF9F9",
        },
      },
      fontFamily: {
        heading: ["Barlow", "sans-serif"],
        body: ["Raleway", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 6: Set up globals.css**

Replace `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-body bg-warm-white text-navy dark:bg-navy-deep dark:text-gray-100;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-heading;
  }
}
```

- [ ] **Step 7: Configure Vitest**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: [],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 8: Add test script to package.json**

Add to the `"scripts"` section of `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 9: Create minimal root layout**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Barlow, Raleway } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-heading",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Cloud Native Nordics",
  description: "Connecting cloud native communities across the Nordics",
  openGraph: {
    title: "Cloud Native Nordics",
    description: "Connecting cloud native communities across the Nordics",
    url: "https://cloudnativenordics.com",
    siteName: "Cloud Native Nordics",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${barlow.variable} ${raleway.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
```

- [ ] **Step 10: Create placeholder homepage**

Replace `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <h1 className="text-4xl font-heading font-bold">
        Cloud Native Nordics
      </h1>
    </main>
  );
}
```

- [ ] **Step 11: Copy static assets**

```bash
cp static/logo.svg public/logo.svg
cp static/favicon.ico public/favicon.ico
mkdir -p public/images
cp static/aarhus.jpeg static/aalborg.jpeg static/copenhagen.jpeg static/göteborg.jpeg static/helsinki.jpeg static/stockholm.jpeg static/tampere.jpeg static/umeå.jpeg public/images/ 2>/dev/null || true
```

- [ ] **Step 12: Update .gitignore**

Ensure `.gitignore` contains:

```
node_modules/
.next/
.vercel/
.wrangler/
out/
public/
*.tsbuildinfo
```

Wait — `public/` should NOT be ignored since it has our static assets. Remove that line. The `.gitignore` from create-next-app is fine, just ensure `.wrangler/` is added.

- [ ] **Step 13: Verify the app runs**

```bash
npm run dev
```

Expected: Next.js dev server starts at `http://localhost:3000`, shows "Cloud Native Nordics" heading.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 project with Tailwind and Cloudflare config"
```

---

## Task 2: TypeScript Types & Group YAML Loader

**Files:**
- Create: `lib/types.ts`, `lib/groups.ts`, `data/groups/aarhus.yaml` (+ 12 more), `__tests__/lib/groups.test.ts`

- [ ] **Step 1: Write shared types**

Create `lib/types.ts`:

```typescript
export interface GroupDefinition {
  slug: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  platform: "bevy" | "meetup";
  platform_url: string;
  slack_channel?: string;
  member_count?: number;
  organizers?: Organizer[];
}

export interface Organizer {
  name: string;
  role?: string;
}

export interface BevyEvent {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  url: string;
  chapter_title: string;
  chapter_city: string;
  chapter_country: string;
  chapter_logo_url?: string;
  chapter_relative_url: string;
}

export interface GroupWithData extends GroupDefinition {
  upcoming_events: BevyEvent[];
  past_events: BevyEvent[];
}

export interface SiteStats {
  total_members: number;
  active_groups: number;
  upcoming_events: number;
}
```

- [ ] **Step 2: Write the failing test for YAML loader**

Create `__tests__/lib/groups.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { loadGroups, loadGroup } from "@/lib/groups";

describe("loadGroups", () => {
  it("loads all group YAML files from data/groups/", async () => {
    const groups = await loadGroups();
    expect(groups.length).toBeGreaterThan(0);
    const aarhus = groups.find((g) => g.slug === "aarhus");
    expect(aarhus).toBeDefined();
    expect(aarhus!.name).toBe("Cloud Native Aarhus");
    expect(aarhus!.city).toBe("Aarhus");
    expect(aarhus!.country).toBe("Denmark");
    expect(aarhus!.latitude).toBeCloseTo(56.1629, 2);
    expect(aarhus!.longitude).toBeCloseTo(10.2039, 2);
    expect(aarhus!.platform).toBe("bevy");
    expect(aarhus!.platform_url).toContain("cloud-native-aarhus");
  });

  it("derives slug from filename", async () => {
    const groups = await loadGroups();
    groups.forEach((g) => {
      expect(g.slug).toMatch(/^[a-z0-9-]+$/);
    });
  });
});

describe("loadGroup", () => {
  it("loads a single group by slug", async () => {
    const group = await loadGroup("aarhus");
    expect(group).toBeDefined();
    expect(group!.name).toBe("Cloud Native Aarhus");
  });

  it("returns null for unknown slug", async () => {
    const group = await loadGroup("nonexistent");
    expect(group).toBeNull();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/groups.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/groups'`

- [ ] **Step 4: Create all group YAML files**

Create `data/groups/aarhus.yaml`:

```yaml
name: Cloud Native Aarhus
city: Aarhus
country: Denmark
latitude: 56.1629
longitude: 10.2039
platform: bevy
platform_url: https://community.cncf.io/cloud-native-aarhus/
slack_channel: "#cloud-native-aarhus"
member_count: 1200
organizers:
  - name: Kasper Nissen
    role: Lead Organizer
```

Create `data/groups/aalborg.yaml`:

```yaml
name: Cloud Native Aalborg
city: Aalborg
country: Denmark
latitude: 57.0488
longitude: 9.9217
platform: bevy
platform_url: https://community.cncf.io/cloud-native-aalborg/
member_count: 300
```

Create `data/groups/copenhagen.yaml`:

```yaml
name: Cloud Native Copenhagen
city: Copenhagen
country: Denmark
latitude: 55.6761
longitude: 12.5683
platform: bevy
platform_url: https://community.cncf.io/cloud-native-copenhagen/
member_count: 1500
```

Create `data/groups/helsinki.yaml`:

```yaml
name: Cloud Native Helsinki
city: Helsinki
country: Finland
latitude: 60.1699
longitude: 24.9384
platform: bevy
platform_url: https://community.cncf.io/cloud-native-helsinki/
member_count: 800
```

Create `data/groups/tampere.yaml`:

```yaml
name: Cloud Native Tampere
city: Tampere
country: Finland
latitude: 61.4978
longitude: 23.7610
platform: bevy
platform_url: https://community.cncf.io/cloud-native-tampere/
member_count: 300
```

Create `data/groups/turku.yaml`:

```yaml
name: Cloud Native Turku
city: Turku
country: Finland
latitude: 60.4518
longitude: 22.2666
platform: bevy
platform_url: https://community.cncf.io/cloud-native-turku/
member_count: 200
```

Create `data/groups/reykjavik.yaml`:

```yaml
name: Cloud Native Reykjavik
city: Reykjavik
country: Iceland
latitude: 64.1466
longitude: -21.9426
platform: bevy
platform_url: https://community.cncf.io/cloud-native-reykjavik/
member_count: 150
```

Create `data/groups/bergen.yaml`:

```yaml
name: Cloud Native Bergen
city: Bergen
country: Norway
latitude: 60.3913
longitude: 5.3221
platform: bevy
platform_url: https://community.cncf.io/cloud-native-bergen/
member_count: 300
```

Create `data/groups/oslo.yaml`:

```yaml
name: Cloud Native Oslo
city: Oslo
country: Norway
latitude: 59.9139
longitude: 10.7522
platform: bevy
platform_url: https://community.cncf.io/cloud-native-oslo/
member_count: 600
```

Create `data/groups/stavanger.yaml`:

```yaml
name: Cloud Native Stavanger
city: Stavanger
country: Norway
latitude: 58.9700
longitude: 5.7331
platform: bevy
platform_url: https://community.cncf.io/cloud-native-stavanger/
member_count: 200
```

Create `data/groups/goteborg.yaml`:

```yaml
name: Cloud Native Goteborg
city: Goteborg
country: Sweden
latitude: 57.7089
longitude: 11.9746
platform: bevy
platform_url: https://community.cncf.io/cloud-native-goteborg/
member_count: 400
```

Create `data/groups/stockholm.yaml`:

```yaml
name: Cloud Native Stockholm
city: Stockholm
country: Sweden
latitude: 59.3293
longitude: 18.0686
platform: bevy
platform_url: https://community.cncf.io/cloud-native-stockholm/
member_count: 800
```

Create `data/groups/umea.yaml`:

```yaml
name: Cloud Native Umea
city: Umea
country: Sweden
latitude: 63.8258
longitude: 20.2630
platform: bevy
platform_url: https://community.cncf.io/cloud-native-umea/
member_count: 150
```

- [ ] **Step 5: Implement the YAML loader**

Create `lib/groups.ts`:

```typescript
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
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npx vitest run __tests__/lib/groups.test.ts
```

Expected: All 4 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add lib/types.ts lib/groups.ts data/groups/ __tests__/lib/groups.test.ts
git commit -m "feat: add TypeScript types and YAML group loader with tests"
```

---

## Task 3: Bevy API Client

**Files:**
- Create: `lib/bevy.ts`, `__tests__/lib/bevy.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/bevy.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchBevyEvents, getEventsForChapter } from "@/lib/bevy";
import type { BevyEvent } from "@/lib/types";

const mockEventsResponse = {
  count: 2,
  results: [
    {
      id: 100,
      title: "Kubernetes 101",
      start_date: "2026-04-15T17:00:00Z",
      end_date: "2026-04-15T20:00:00Z",
      url: "https://community.cncf.io/events/details/cncf-cloud-native-aarhus-presents-kubernetes-101/",
      status: "Published",
      chapter: {
        id: 120,
        title: "Cloud Native Aarhus",
        city: "Aarhus",
        country: "DK",
        country_name: "Denmark",
        logo: { url: "https://example.com/logo.png", thumbnail_url: "" },
        relative_url: "/cloud-native-aarhus/",
        url: "https://community.cncf.io/cloud-native-aarhus/",
      },
    },
    {
      id: 101,
      title: "GitOps Deep Dive",
      start_date: "2026-03-01T17:00:00Z",
      end_date: "2026-03-01T20:00:00Z",
      url: "https://community.cncf.io/events/details/cncf-cloud-native-aarhus-presents-gitops/",
      status: "Published",
      chapter: {
        id: 120,
        title: "Cloud Native Aarhus",
        city: "Aarhus",
        country: "DK",
        country_name: "Denmark",
        logo: { url: "https://example.com/logo.png", thumbnail_url: "" },
        relative_url: "/cloud-native-aarhus/",
        url: "https://community.cncf.io/cloud-native-aarhus/",
      },
    },
  ],
  links: { next: null, previous: null },
  pagination: { current_page: 1, next_page: null, previous_page: null, page_size: 500 },
};

describe("fetchBevyEvents", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and normalizes events from Bevy API", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify(mockEventsResponse), { status: 200 })
    );

    const events = await fetchBevyEvents();
    expect(events).toHaveLength(2);
    expect(events[0].title).toBe("Kubernetes 101");
    expect(events[0].chapter_relative_url).toBe("/cloud-native-aarhus/");
  });

  it("returns empty array on API failure", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("timeout"));

    const events = await fetchBevyEvents();
    expect(events).toEqual([]);
  });
});

describe("getEventsForChapter", () => {
  it("filters and splits events into upcoming and past", () => {
    const now = new Date("2026-04-01T00:00:00Z");
    const allEvents: BevyEvent[] = [
      {
        id: 100,
        title: "Kubernetes 101",
        start_date: "2026-04-15T17:00:00Z",
        end_date: "2026-04-15T20:00:00Z",
        url: "https://example.com/event/100",
        chapter_title: "Cloud Native Aarhus",
        chapter_city: "Aarhus",
        chapter_country: "Denmark",
        chapter_logo_url: "https://example.com/logo.png",
        chapter_relative_url: "/cloud-native-aarhus/",
      },
      {
        id: 101,
        title: "GitOps Deep Dive",
        start_date: "2026-03-01T17:00:00Z",
        end_date: "2026-03-01T20:00:00Z",
        url: "https://example.com/event/101",
        chapter_title: "Cloud Native Aarhus",
        chapter_city: "Aarhus",
        chapter_country: "Denmark",
        chapter_logo_url: "https://example.com/logo.png",
        chapter_relative_url: "/cloud-native-aarhus/",
      },
    ];

    const platformUrl = "https://community.cncf.io/cloud-native-aarhus/";
    const { upcoming, past } = getEventsForChapter(allEvents, platformUrl, now);

    expect(upcoming).toHaveLength(1);
    expect(upcoming[0].title).toBe("Kubernetes 101");
    expect(past).toHaveLength(1);
    expect(past[0].title).toBe("GitOps Deep Dive");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/bevy.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/bevy'`

- [ ] **Step 3: Implement the Bevy API client**

Create `lib/bevy.ts`:

```typescript
import type { BevyEvent } from "./types";

const BEVY_API_BASE = "https://community.cncf.io/api";
const FETCH_TIMEOUT_MS = 8000;

interface BevyApiEvent {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  url: string;
  status: string;
  chapter: {
    id: number;
    title: string;
    city: string;
    country: string;
    country_name: string;
    logo?: { url: string; thumbnail_url: string };
    relative_url: string;
    url: string;
  };
}

interface BevyApiResponse {
  count: number;
  results: BevyApiEvent[];
  links: { next: string | null; previous: string | null };
  pagination: {
    current_page: number;
    next_page: number | null;
    previous_page: number | null;
    page_size: number;
  };
}

function normalizeEvent(raw: BevyApiEvent): BevyEvent {
  return {
    id: raw.id,
    title: raw.title,
    start_date: raw.start_date,
    end_date: raw.end_date,
    url: raw.url,
    chapter_title: raw.chapter.title,
    chapter_city: raw.chapter.city,
    chapter_country: raw.chapter.country_name || raw.chapter.country,
    chapter_logo_url: raw.chapter.logo?.url,
    chapter_relative_url: raw.chapter.relative_url,
  };
}

export async function fetchBevyEvents(): Promise<BevyEvent[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const res = await fetch(`${BEVY_API_BASE}/event/?page_size=500`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return [];

    const data: BevyApiResponse = await res.json();
    return data.results
      .filter((e) => e.status === "Published")
      .map(normalizeEvent);
  } catch {
    return [];
  }
}

function chapterSlugFromUrl(platformUrl: string): string {
  // "https://community.cncf.io/cloud-native-aarhus/" → "/cloud-native-aarhus/"
  const url = new URL(platformUrl);
  return url.pathname.endsWith("/") ? url.pathname : url.pathname + "/";
}

export function getEventsForChapter(
  allEvents: BevyEvent[],
  platformUrl: string,
  now: Date = new Date()
): { upcoming: BevyEvent[]; past: BevyEvent[] } {
  const chapterPath = chapterSlugFromUrl(platformUrl);

  const chapterEvents = allEvents.filter(
    (e) => e.chapter_relative_url === chapterPath
  );

  const upcoming = chapterEvents
    .filter((e) => new Date(e.start_date) >= now)
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  const past = chapterEvents
    .filter((e) => new Date(e.start_date) < now)
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

  return { upcoming, past };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run __tests__/lib/bevy.test.ts
```

Expected: All 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/bevy.ts __tests__/lib/bevy.test.ts
git commit -m "feat: add Bevy API client with event fetching and chapter filtering"
```

---

## Task 4: Theme Provider (Dark/Light Mode)

**Files:**
- Create: `components/ThemeProvider.tsx`, `components/ThemeToggle.tsx`, `__tests__/components/ThemeProvider.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `__tests__/components/ThemeProvider.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";

function TestConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("defaults to light when no preference is set", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme").textContent).toBe("light");
  });

  it("toggles theme and persists to localStorage", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByText("Toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/components/ThemeProvider.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/ThemeProvider'`

- [ ] **Step 3: Implement ThemeProvider**

Create `components/ThemeProvider.tsx`:

```tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

- [ ] **Step 4: Implement ThemeToggle**

Create `components/ThemeToggle.tsx`:

```tsx
"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-navy/10 dark:hover:bg-white/10 transition-colors"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx vitest run __tests__/components/ThemeProvider.test.tsx
```

Expected: All 2 tests PASS.

- [ ] **Step 6: Wire ThemeProvider into root layout**

Update `app/layout.tsx` — wrap `{children}` with `ThemeProvider`:

Add import at top:
```tsx
import { ThemeProvider } from "@/components/ThemeProvider";
```

Change the body to:
```tsx
<body className="min-h-screen">
  <ThemeProvider>{children}</ThemeProvider>
</body>
```

- [ ] **Step 7: Commit**

```bash
git add components/ThemeProvider.tsx components/ThemeToggle.tsx __tests__/components/ThemeProvider.test.tsx app/layout.tsx
git commit -m "feat: add dark/light theme provider with toggle and localStorage persistence"
```

---

## Task 5: Navbar

**Files:**
- Create: `components/Navbar.tsx`, `components/MobileMenu.tsx`

- [ ] **Step 1: Implement Navbar**

Create `components/Navbar.tsx`:

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

const NAV_LINKS = [
  { href: "#groups", label: "Groups" },
  { href: "#events", label: "Events" },
  { href: "https://cfp.cloudnativenordics.com", label: "CFP", external: true },
  {
    href: "https://join.slack.com/t/cloud-native-nordics/shared_invite/zt-2ge0c6cmo-SDDeFUDeEU~TUkZTDcis8w",
    label: "Slack",
    external: true,
  },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-warm-white/80 dark:bg-navy-deep/80 border-b border-gray-200/20 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Cloud Native Nordics"
              width={160}
              height={52}
              className="dark:brightness-100 brightness-0"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-sm font-medium text-navy/70 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue transition-colors"
              >
                {link.label}
              </a>
            ))}
            <ThemeToggle />
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-navy/10 dark:hover:bg-white/10"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && <MobileMenu links={NAV_LINKS} onClose={() => setMobileOpen(false)} />}
    </nav>
  );
}
```

- [ ] **Step 2: Implement MobileMenu**

Create `components/MobileMenu.tsx`:

```tsx
"use client";

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

export function MobileMenu({ links, onClose }: { links: NavLink[]; onClose: () => void }) {
  return (
    <div className="md:hidden border-t border-gray-200/20 dark:border-white/10 bg-warm-white/95 dark:bg-navy-deep/95 backdrop-blur-md">
      <div className="px-4 py-3 space-y-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            onClick={onClose}
            className="block py-2 text-base font-medium text-navy/70 dark:text-gray-300 hover:text-brand-blue"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add Navbar to root layout**

Update `app/layout.tsx` — add import and place `<Navbar />` inside the body before children:

```tsx
import { Navbar } from "@/components/Navbar";
```

Update body:
```tsx
<body className="min-h-screen">
  <ThemeProvider>
    <Navbar />
    <main className="pt-16">{children}</main>
  </ThemeProvider>
</body>
```

- [ ] **Step 4: Verify visually**

```bash
npm run dev
```

Expected: Sticky navbar with logo, links, theme toggle. Mobile hamburger menu works. Dark/light toggle works.

- [ ] **Step 5: Commit**

```bash
git add components/Navbar.tsx components/MobileMenu.tsx app/layout.tsx
git commit -m "feat: add responsive navbar with mobile menu and theme toggle"
```

---

## Task 6: Hero Section

**Files:**
- Create: `components/Hero.tsx`, `components/AnimatedCounter.tsx`

- [ ] **Step 1: Implement AnimatedCounter**

Create `components/AnimatedCounter.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const startTime = performance.now();

          function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          }

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}
```

- [ ] **Step 2: Implement Hero**

Create `components/Hero.tsx`:

```tsx
import Image from "next/image";
import { AnimatedCounter } from "./AnimatedCounter";

interface HeroProps {
  totalMembers: number;
}

export function Hero({ totalMembers }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-deep py-24 sm:py-32">
      {/* Aurora gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-brand-purple/20 blur-[120px]" />
        <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-brand-pink/15 blur-[100px]" />
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-brand-blue/10 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Image
          src="/logo.svg"
          alt="Cloud Native Nordics"
          width={320}
          height={104}
          className="mx-auto mb-8"
          priority
        />
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white mb-4">
          Cloud Native Nordics
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Connecting cloud native communities across the Nordics
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <span className="text-3xl font-heading font-bold text-white">
            <AnimatedCounter target={totalMembers} suffix="+" />
          </span>
          <span className="text-gray-300 text-sm">community members</span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire into homepage**

Update `app/page.tsx`:

```tsx
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
```

- [ ] **Step 4: Verify visually**

```bash
npm run dev
```

Expected: Dark hero section with aurora gradient blobs, logo, title, subtitle, and animated member counter.

- [ ] **Step 5: Commit**

```bash
git add components/Hero.tsx components/AnimatedCounter.tsx app/page.tsx
git commit -m "feat: add hero section with aurora gradient and animated member counter"
```

---

## Task 7: Stats Bar

**Files:**
- Create: `components/StatsBar.tsx`

- [ ] **Step 1: Implement StatsBar**

Create `components/StatsBar.tsx`:

```tsx
import type { SiteStats } from "@/lib/types";

const STAT_ICONS = {
  members: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  groups: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  events: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

export function StatsBar({ stats }: { stats: SiteStats }) {
  const items = [
    { icon: STAT_ICONS.members, value: stats.total_members.toLocaleString() + "+", label: "Total Members" },
    { icon: STAT_ICONS.groups, value: stats.active_groups.toString(), label: "Active Groups" },
    { icon: STAT_ICONS.events, value: stats.upcoming_events.toString(), label: "Upcoming Events" },
  ];

  return (
    <section className="py-12 bg-white dark:bg-navy-card border-b border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <div className="text-brand-blue">{item.icon}</div>
              <div className="text-3xl font-heading font-bold text-navy dark:text-white">
                {item.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into homepage**

Update `app/page.tsx` — add import and component after Hero:

```tsx
import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { loadGroups } from "@/lib/groups";
import { fetchBevyEvents, getEventsForChapter } from "@/lib/bevy";
import type { SiteStats } from "@/lib/types";

export default async function Home() {
  const groups = await loadGroups();
  const allEvents = await fetchBevyEvents();

  const totalMembers = groups.reduce((sum, g) => sum + (g.member_count || 0), 0);

  let totalUpcoming = 0;
  const groupsWithEvents = groups.map((group) => {
    const { upcoming, past } = getEventsForChapter(allEvents, group.platform_url);
    totalUpcoming += upcoming.length;
    return { ...group, upcoming_events: upcoming, past_events: past };
  });

  const stats: SiteStats = {
    total_members: totalMembers,
    active_groups: groups.length,
    upcoming_events: totalUpcoming,
  };

  return (
    <>
      <Hero totalMembers={totalMembers} />
      <StatsBar stats={stats} />
    </>
  );
}
```

- [ ] **Step 3: Verify visually**

```bash
npm run dev
```

Expected: Stats bar with three items showing real numbers from YAML and Bevy data.

- [ ] **Step 4: Commit**

```bash
git add components/StatsBar.tsx app/page.tsx
git commit -m "feat: add stats bar with live member, group, and event counts"
```

---

## Task 8: Interactive Map

**Files:**
- Create: `components/InteractiveMap.tsx`

- [ ] **Step 1: Implement InteractiveMap**

Create `components/InteractiveMap.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";
import type { GroupWithData } from "@/lib/types";

const LIGHT_TILES = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

export function InteractiveMap({ groups }: { groups: GroupWithData[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const tileLayer = useRef<L.TileLayer | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    let cancelled = false;

    async function initMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [62, 15],
        zoom: 4,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      const tiles = L.tileLayer(
        theme === "dark" ? DARK_TILES : LIGHT_TILES,
        { attribution: TILE_ATTRIBUTION }
      ).addTo(map);

      tileLayer.current = tiles;

      const markerIcon = L.divIcon({
        html: `<div style="background: linear-gradient(135deg, #FF6DAF, #FFB500); width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        className: "",
      });

      groups.forEach((group) => {
        const nextEvent = group.upcoming_events[0];
        const popupContent = `
          <div style="font-family: Raleway, sans-serif; min-width: 180px;">
            <strong style="font-size: 14px;">${group.name}</strong>
            <div style="color: #6B7280; font-size: 12px; margin: 4px 0;">
              ${group.member_count ? group.member_count.toLocaleString() + " members" : ""}
            </div>
            ${nextEvent ? `<div style="font-size: 12px; margin: 4px 0;">Next: ${nextEvent.title}<br/>${new Date(nextEvent.start_date).toLocaleDateString()}</div>` : ""}
            <a href="/groups/${group.slug}" style="color: #326CE5; font-size: 12px; text-decoration: none;">View group &rarr;</a>
          </div>
        `;

        L.marker([group.latitude, group.longitude], { icon: markerIcon })
          .addTo(map)
          .bindPopup(popupContent);
      });

      const bounds = L.latLngBounds(groups.map((g) => [g.latitude, g.longitude]));
      map.fitBounds(bounds, { padding: [40, 40] });

      mapInstance.current = map;
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [groups]);

  useEffect(() => {
    if (tileLayer.current) {
      tileLayer.current.setUrl(theme === "dark" ? DARK_TILES : LIGHT_TILES);
    }
  }, [theme]);

  return (
    <section id="map" className="py-16 bg-warm-white dark:bg-navy-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-heading font-bold text-center mb-8 text-navy dark:text-white">
          Our Communities
        </h2>
        <div
          ref={mapRef}
          className="h-[400px] sm:h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-white/10"
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into homepage**

Update `app/page.tsx` — add import and component after StatsBar:

Add import:
```tsx
import { InteractiveMap } from "@/components/InteractiveMap";
```

Add after `<StatsBar stats={stats} />`:
```tsx
<InteractiveMap groups={groupsWithEvents} />
```

- [ ] **Step 3: Verify visually**

```bash
npm run dev
```

Expected: Interactive Nordic map with gradient markers for each group. Click marker to see popup with group info and next event. Map tiles change with theme toggle.

- [ ] **Step 4: Commit**

```bash
git add components/InteractiveMap.tsx app/page.tsx
git commit -m "feat: add interactive Leaflet map with themed tiles and group markers"
```

---

## Task 9: Groups Grid

**Files:**
- Create: `components/GroupCard.tsx`, `components/GroupsGrid.tsx`

- [ ] **Step 1: Implement GroupCard**

Create `components/GroupCard.tsx`:

```tsx
import Link from "next/link";
import type { GroupWithData } from "@/lib/types";

export function GroupCard({ group }: { group: GroupWithData }) {
  const nextEvent = group.upcoming_events[0];

  return (
    <Link
      href={`/groups/${group.slug}`}
      className="group relative block rounded-xl overflow-hidden bg-white dark:bg-navy-card border border-gray-200 dark:border-white/10 hover:border-brand-pink dark:hover:border-brand-pink transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl bg-gradient-to-br from-brand-pink/5 to-brand-gold/5" />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-heading font-bold text-navy dark:text-white group-hover:text-brand-blue transition-colors">
              {group.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {group.city}, {group.country}
            </p>
          </div>
          {group.member_count && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20">
              {group.member_count.toLocaleString()} members
            </span>
          )}
        </div>

        {nextEvent ? (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Next Event
            </p>
            <p className="text-sm font-medium text-navy dark:text-gray-200 truncate">
              {nextEvent.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(nextEvent.start_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">
              No upcoming events
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Implement GroupsGrid**

Create `components/GroupsGrid.tsx`:

```tsx
import { GroupCard } from "./GroupCard";
import type { GroupWithData } from "@/lib/types";

export function GroupsGrid({ groups }: { groups: GroupWithData[] }) {
  return (
    <section id="groups" className="py-16 bg-gray-50 dark:bg-navy-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-heading font-bold text-center mb-4 text-navy dark:text-white">
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
```

- [ ] **Step 3: Wire into homepage**

Update `app/page.tsx` — add import and component after InteractiveMap:

Add import:
```tsx
import { GroupsGrid } from "@/components/GroupsGrid";
```

Add after `<InteractiveMap groups={groupsWithEvents} />`:
```tsx
<GroupsGrid groups={groupsWithEvents} />
```

- [ ] **Step 4: Verify visually**

```bash
npm run dev
```

Expected: Responsive card grid showing all 13 groups with member count badges and next event info. Cards have hover effects.

- [ ] **Step 5: Commit**

```bash
git add components/GroupCard.tsx components/GroupsGrid.tsx app/page.tsx
git commit -m "feat: add groups grid with group cards showing member counts and next events"
```

---

## Task 10: Upcoming Events Section

**Files:**
- Create: `components/EventCard.tsx`, `components/UpcomingEvents.tsx`

- [ ] **Step 1: Implement EventCard**

Create `components/EventCard.tsx`:

```tsx
import type { BevyEvent } from "@/lib/types";

export function EventCard({ event }: { event: BevyEvent }) {
  const date = new Date(event.start_date);

  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 p-4 rounded-lg bg-white dark:bg-navy-card border border-gray-200 dark:border-white/10 hover:border-brand-blue dark:hover:border-brand-blue transition-colors"
    >
      <div className="flex-shrink-0 w-14 text-center">
        <div className="text-xs uppercase font-medium text-brand-pink">
          {date.toLocaleDateString("en-US", { month: "short" })}
        </div>
        <div className="text-2xl font-heading font-bold text-navy dark:text-white">
          {date.getDate()}
        </div>
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-navy dark:text-white truncate">
          {event.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {event.chapter_title} &middot; {event.chapter_city}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {date.toLocaleDateString("en-US", {
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </a>
  );
}
```

- [ ] **Step 2: Implement UpcomingEvents**

Create `components/UpcomingEvents.tsx`:

```tsx
import { EventCard } from "./EventCard";
import type { BevyEvent } from "@/lib/types";

export function UpcomingEvents({ events }: { events: BevyEvent[] }) {
  if (events.length === 0) {
    return (
      <section id="events" className="py-16 bg-warm-white dark:bg-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4 text-navy dark:text-white">
            Upcoming Events
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            No upcoming events at the moment. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-16 bg-warm-white dark:bg-navy-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-heading font-bold text-center mb-4 text-navy dark:text-white">
          Upcoming Events
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Join us at an upcoming meetup near you
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {events.slice(0, 6).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire into homepage**

Update `app/page.tsx` — add imports and compute upcoming events. After `groupsWithEvents` is built, add:

Add imports:
```tsx
import { UpcomingEvents } from "@/components/UpcomingEvents";
```

Before the `return`, add:
```tsx
const allUpcoming = groupsWithEvents
  .flatMap((g) => g.upcoming_events)
  .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
```

Add after `<GroupsGrid groups={groupsWithEvents} />`:
```tsx
<UpcomingEvents events={allUpcoming} />
```

- [ ] **Step 4: Verify visually**

```bash
npm run dev
```

Expected: Upcoming events section with up to 6 event cards showing date, title, group, and time.

- [ ] **Step 5: Commit**

```bash
git add components/EventCard.tsx components/UpcomingEvents.tsx app/page.tsx
git commit -m "feat: add upcoming events section with event cards"
```

---

## Task 11: CFP Section, Community Section & Footer

**Files:**
- Create: `components/CfpSection.tsx`, `components/CommunitySection.tsx`, `components/Footer.tsx`

- [ ] **Step 1: Implement CfpSection**

Create `components/CfpSection.tsx`:

```tsx
export function CfpSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-pink to-brand-gold opacity-90" />
      <div className="absolute inset-0 bg-navy-deep/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
          Share Your Knowledge
        </h2>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          Got a talk idea? Submit a proposal to speak at any of our Nordic meetups.
          We welcome topics on Kubernetes, DevOps, Security, Observability, Platform Engineering, and more.
        </p>
        <a
          href="https://cfp.cloudnativenordics.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-navy font-heading font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
        >
          Submit a Talk
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Implement CommunitySection**

Create `components/CommunitySection.tsx`:

```tsx
const COMMUNITY_LINKS = [
  {
    name: "Slack",
    description: "Join the conversation",
    href: "https://join.slack.com/t/cloud-native-nordics/shared_invite/zt-2ge0c6cmo-SDDeFUDeEU~TUkZTDcis8w",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    description: "Contribute to our projects",
    href: "https://github.com/cloud-native-nordics",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "Twitter / X",
    description: "Follow #CloudNativeNordics",
    href: "https://twitter.com/hashtag/CloudNativeNordics",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export function CommunitySection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-navy-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-heading font-bold mb-4 text-navy dark:text-white">
          Join the Community
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Connect with cloud native enthusiasts across the Nordics
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {COMMUNITY_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-6 py-4 rounded-xl bg-white dark:bg-navy-deep border border-gray-200 dark:border-white/10 hover:border-brand-blue dark:hover:border-brand-blue transition-colors w-full sm:w-auto"
            >
              <div className="text-navy dark:text-white">{link.icon}</div>
              <div className="text-left">
                <div className="font-heading font-bold text-navy dark:text-white">
                  {link.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {link.description}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Implement Footer**

Create `components/Footer.tsx`:

```tsx
export function Footer() {
  return (
    <footer className="py-8 bg-navy-deep text-gray-400 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm">
            &copy; {new Date().getFullYear()} Cloud Native Nordics. Part of the{" "}
            <a
              href="https://www.cncf.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue hover:underline"
            >
              CNCF
            </a>{" "}
            community.
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#groups" className="hover:text-white transition-colors">Groups</a>
            <a href="#events" className="hover:text-white transition-colors">Events</a>
            <a
              href="https://cfp.cloudnativenordics.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              CFP
            </a>
            <a
              href="https://github.com/cloud-native-nordics"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Wire all three into homepage and layout**

Update `app/page.tsx` — add imports and components:

Add imports:
```tsx
import { CfpSection } from "@/components/CfpSection";
import { CommunitySection } from "@/components/CommunitySection";
```

Add after `<UpcomingEvents events={allUpcoming} />`:
```tsx
<CfpSection />
<CommunitySection />
```

Update `app/layout.tsx` — add Footer after `</main>`:

Add import:
```tsx
import { Footer } from "@/components/Footer";
```

Update body:
```tsx
<body className="min-h-screen">
  <ThemeProvider>
    <Navbar />
    <main className="pt-16">{children}</main>
    <Footer />
  </ThemeProvider>
</body>
```

- [ ] **Step 5: Verify visually**

```bash
npm run dev
```

Expected: Full homepage with all sections. CFP section has gradient background with "Submit a Talk" button. Community section shows Slack, GitHub, X links. Footer at bottom with CNCF attribution.

- [ ] **Step 6: Commit**

```bash
git add components/CfpSection.tsx components/CommunitySection.tsx components/Footer.tsx app/page.tsx app/layout.tsx
git commit -m "feat: add CFP section, community links, and footer"
```

---

## Task 12: Group Detail Page

**Files:**
- Create: `app/groups/[slug]/page.tsx`

- [ ] **Step 1: Implement group detail page**

Create `app/groups/[slug]/page.tsx`:

```tsx
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
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-2">
            {group.name}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {group.city}, {group.country}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {group.member_count && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-blue/20 text-brand-blue">
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
```

- [ ] **Step 2: Verify visually**

```bash
npm run dev
```

Navigate to `http://localhost:3000/groups/aarhus`.

Expected: Group detail page with hero, organizers, upcoming/past events, and CFP CTA.

- [ ] **Step 3: Commit**

```bash
git add app/groups/
git commit -m "feat: add group detail page with events and organizer info"
```

---

## Task 13: Assemble Final Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Write the final homepage assembly**

Replace `app/page.tsx` with the complete version bringing all sections together:

```tsx
import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { InteractiveMap } from "@/components/InteractiveMap";
import { GroupsGrid } from "@/components/GroupsGrid";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { CfpSection } from "@/components/CfpSection";
import { CommunitySection } from "@/components/CommunitySection";
import { loadGroups } from "@/lib/groups";
import { fetchBevyEvents, getEventsForChapter } from "@/lib/bevy";
import type { SiteStats, GroupWithData } from "@/lib/types";

export default async function Home() {
  const groups = await loadGroups();
  const allEvents = await fetchBevyEvents();

  const totalMembers = groups.reduce((sum, g) => sum + (g.member_count || 0), 0);

  const groupsWithEvents: GroupWithData[] = groups.map((group) => {
    const { upcoming, past } = getEventsForChapter(allEvents, group.platform_url);
    return { ...group, upcoming_events: upcoming, past_events: past };
  });

  const totalUpcoming = groupsWithEvents.reduce((sum, g) => sum + g.upcoming_events.length, 0);

  const stats: SiteStats = {
    total_members: totalMembers,
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
      <GroupsGrid groups={groupsWithEvents} />
      <UpcomingEvents events={allUpcoming} />
      <CfpSection />
      <CommunitySection />
    </>
  );
}
```

- [ ] **Step 2: Run full test suite**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 3: Verify full site visually**

```bash
npm run dev
```

Walk through: Hero → Stats → Map → Groups → Events → CFP → Community → Footer. Toggle dark/light mode. Click a group card to see the detail page. Check mobile responsiveness.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble complete homepage with all sections"
```

---

## Task 14: Add Slack Webhook to cnnform

**Files:**
- Modify: `/Users/kaspernissen/kaspernissen/cnnform/src/index.ts` (around line 98-126)

- [ ] **Step 1: Add SLACK_WEBHOOK_URL to Env type**

In `cnnform/src/index.ts`, update the `Env` type (line 12-18):

```typescript
type Env = {
  Bindings: {
    DB: D1Database;
    ADMIN_PASSWORD_HASH: string;
    SESSION_SECRET: string;
    SLACK_WEBHOOK_URL?: string;
  };
};
```

- [ ] **Step 2: Add Slack notification function**

Add this function after the `escapeHtml` function (after line 42) in `cnnform/src/index.ts`:

```typescript
async function sendSlackNotification(
  webhookUrl: string,
  submission: { id: string; name: string; title: string; talk_type: string; locations: string[] }
) {
  const talkTypeLabel = { lightning: "Lightning Talk", full: "Full Talk", workshop: "Workshop" }[submission.talk_type] || submission.talk_type;

  const payload = {
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "New CFP Submission", emoji: true },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Speaker:*\n${submission.name}` },
          { type: "mrkdwn", text: `*Type:*\n${talkTypeLabel}` },
        ],
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: `*Talk:*\n${submission.title}` },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Locations:*\n${submission.locations.join(", ")}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "View in Dashboard" },
            url: `https://cfp.cloudnativenordics.com/admin/submissions/${submission.id}`,
          },
        ],
      },
    ],
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Slack notification failure should not break the submission
    console.error("Failed to send Slack notification");
  }
}
```

- [ ] **Step 3: Call Slack notification after successful submission**

In the `POST /api/submissions` handler, after line 123 (`);` closing `createSubmission`), add before `return c.json({ id });`:

```typescript
  // Send Slack notification (fire-and-forget)
  if (c.env.SLACK_WEBHOOK_URL) {
    const notifyLocations = openToAny ? ['Any location'] : locations;
    c.executionCtx.waitUntil(
      sendSlackNotification(c.env.SLACK_WEBHOOK_URL, {
        id,
        name,
        title,
        talk_type: talkType,
        locations: notifyLocations,
      })
    );
  }
```

- [ ] **Step 4: Test locally**

```bash
cd /Users/kaspernissen/kaspernissen/cnnform
npm run dev
```

Submit a test form. If `SLACK_WEBHOOK_URL` is not set, it should still work normally (no Slack notification sent, no error).

- [ ] **Step 5: Commit in cnnform repo**

```bash
cd /Users/kaspernissen/kaspernissen/cnnform
git add src/index.ts
git commit -m "feat: add Slack webhook notification on new CFP submissions"
```

- [ ] **Step 6: Set the secret for production**

```bash
cd /Users/kaspernissen/kaspernissen/cnnform
npx wrangler secret put SLACK_WEBHOOK_URL
```

Paste the Slack incoming webhook URL when prompted. (Create the webhook at https://api.slack.com/messaging/webhooks for the target channel.)

---

## Task 15: Cloudflare Pages Deployment

**Files:**
- Modify: `package.json` (add build script)
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Add Cloudflare Pages build script**

Update `package.json` scripts in the website project:

```json
"pages:build": "npx @cloudflare/next-on-pages",
"pages:dev": "npx wrangler pages dev .vercel/output/static --compatibility-flag=nodejs_compat",
"pages:deploy": "npx wrangler pages deploy .vercel/output/static"
```

- [ ] **Step 2: Test the Cloudflare Pages build**

```bash
npm run build && npm run pages:build
```

Expected: Next.js builds successfully, then `@cloudflare/next-on-pages` converts the output.

- [ ] **Step 3: Create GitHub Actions workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - run: npm ci

      - run: npm run build
        env:
          NODE_ENV: production

      - run: npx @cloudflare/next-on-pages

      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy .vercel/output/static --project-name=cloud-native-nordics-website
```

- [ ] **Step 4: Verify build locally**

```bash
npm run build && npm run pages:build && npm run pages:dev
```

Expected: Site runs locally via Wrangler Pages dev server with SSR working.

- [ ] **Step 5: Commit**

```bash
git add package.json .github/workflows/deploy.yml wrangler.toml
git commit -m "feat: add Cloudflare Pages deployment config and GitHub Actions workflow"
```

- [ ] **Step 6: Set GitHub repository secrets**

In the GitHub repository settings, add:
- `CLOUDFLARE_API_TOKEN` — API token with Cloudflare Pages edit permissions
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID (from wrangler.toml in cnnform: `0e70f20f3af12cb1b561ed2927cf2499`)

---

## Task 16: Cleanup & Polish

- [ ] **Step 1: Remove old Hugo files**

```bash
rm -rf archetypes/ assets/ content/ layouts/ static/ config.yml Makefile
```

- [ ] **Step 2: Update README.md**

Replace `README.md` with:

```markdown
# Cloud Native Nordics Website

The official website for Cloud Native Nordics — connecting cloud native communities across the Nordic countries.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Map:** Leaflet with CartoDB tiles
- **Data:** Bevy API (events) + YAML (group definitions)
- **Deployment:** Cloudflare Pages

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Managing Groups

Groups are defined as YAML files in `data/groups/`. Each file represents one community chapter:

```yaml
name: Cloud Native Aarhus
city: Aarhus
country: Denmark
latitude: 56.1629
longitude: 10.2039
platform: bevy
platform_url: https://community.cncf.io/cloud-native-aarhus/
slack_channel: "#cloud-native-aarhus"
member_count: 1200
organizers:
  - name: Kasper Nissen
    role: Lead Organizer
```

To add a new group, create a new YAML file and push to master.

## Deployment

Pushes to `master` automatically deploy to Cloudflare Pages via GitHub Actions.

## CFP

The Call for Papers form is managed separately at [cfp.cloudnativenordics.com](https://cfp.cloudnativenordics.com) (see the [cnnform repo](https://github.com/cloud-native-nordics/cnnform)).
```

- [ ] **Step 3: Run all tests one final time**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 4: Final visual check**

```bash
npm run dev
```

Walk through the full site on desktop and mobile. Verify dark/light toggle, map interaction, group detail pages, all links.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove Hugo files, update README for Next.js project"
```
