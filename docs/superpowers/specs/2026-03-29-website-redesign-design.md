# Cloud Native Nordics Website Redesign — Design Spec

## Overview

Complete redesign of the Cloud Native Nordics website from a static Hugo site to a modern Next.js application with live Bevy API integration, interactive Nordic map, dark/light mode, and Slack-integrated CFP workflow.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 15 (App Router) |
| Deployment | Cloudflare Pages via `@cloudflare/next-on-pages` |
| Styling | Tailwind CSS v4 |
| Map | Leaflet + OpenStreetMap/CartoDB tiles |
| Data source | Bevy API (SSR) + YAML group definitions |
| CFP backend | Existing cnnform (Hono on Cloudflare Workers, D1) |
| Slack | Incoming webhook added to cnnform |

## Project Structure

```
website/
├── app/
│   ├── layout.tsx              # Root layout: nav, footer, theme provider
│   ├── page.tsx                # Homepage
│   ├── groups/
│   │   └── [slug]/
│   │       └── page.tsx        # Individual group page
│   └── globals.css             # Tailwind imports + custom properties
├── components/
│   ├── Navbar.tsx              # Sticky nav with theme toggle
│   ├── Hero.tsx                # Full-width hero with animated stats
│   ├── StatsBar.tsx            # Total members, groups, events
│   ├── InteractiveMap.tsx      # Leaflet map (client component)
│   ├── GroupCard.tsx           # Group preview card
│   ├── GroupsGrid.tsx          # Grid of GroupCards
│   ├── EventCard.tsx           # Single event card
│   ├── UpcomingEvents.tsx      # Aggregated upcoming events
│   ├── CfpSection.tsx          # CFP call-to-action
│   ├── CommunitySection.tsx    # Slack/GitHub/social links
│   ├── Footer.tsx              # CNCF attribution, links
│   └── ThemeProvider.tsx       # Dark/light mode context
├── lib/
│   ├── bevy.ts                 # Bevy API client with TypeScript types
│   ├── groups.ts               # YAML loader for group definitions
│   └── types.ts                # Shared TypeScript types
├── data/
│   └── groups/                 # One YAML file per group
│       ├── aarhus.yaml
│       ├── copenhagen.yaml
│       ├── helsinki.yaml
│       └── ...
├── public/
│   ├── logo.svg                # Existing Cloud Native Nordics logo
│   ├── images/                 # City photos, icons
│   └── favicon.ico
├── tailwind.config.ts
├── next.config.ts
└── wrangler.toml               # Cloudflare Pages config
```

## Color Palette

### Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Dark Navy | `#262F59` | Dark mode background, headings |
| Deep Navy | `#0F1229` | Dark mode page background |
| Card Navy | `#1A1F3D` | Dark mode card/surface background |
| Kubernetes Blue | `#326CE5` | Logo accent, links, interactive elements |
| Pink | `#FF6DAF` | Gradient start, accents |
| Gold | `#FFB500` | Gradient end, accents |
| Purple | `#512268` | Depth accent (sparingly) |
| Hot Pink | `#F11F7E` | Secondary accent |

### Light Mode

| Element | Value |
|---------|-------|
| Page background | `#FDF9F9` (warm white) |
| Card background | `#FFFFFF` |
| Primary text | `#262F59` |
| Secondary text | `#6B7280` |

### Dark Mode

| Element | Value |
|---------|-------|
| Page background | `#0F1229` |
| Card background | `#1A1F3D` |
| Primary text | `#F0F0F0` |
| Secondary text | `#9E9E9E` |

### Gradient

Primary accent gradient: `linear-gradient(135deg, #FF6DAF, #FFB500)` — used for CTA buttons, decorative elements, hover states.

## Typography

| Role | Font | Weight |
|------|------|--------|
| Headings | Barlow | Bold / ExtraBold (700/800) |
| Body | Raleway | Regular / Medium (400/500) |

Both loaded via Google Fonts. Barlow brings a modern, punchy feel from the presentation deck; Raleway maintains continuity with the existing brand.

## Dark/Light Mode

- Tailwind `class` strategy: `dark` class on `<html>` element
- On first load: check `localStorage` for saved preference, fall back to `prefers-color-scheme`
- Toggle button in navbar (sun/moon icon), saves to `localStorage`
- Inline `<script>` in `<head>` sets class before first paint (no flash)
- Map tiles swap: CartoDB Positron (light) / CartoDB Dark Matter (dark)

## Homepage Sections

### 1. Navigation Bar

- Sticky, backdrop blur background
- Logo (left), navigation links (center/right): Groups, Events, CFP, Slack
- Dark/light mode toggle (right)
- Mobile: hamburger menu

### 2. Hero

- Full-width, dark navy background
- Subtle gradient mesh or aurora effect (CSS-only, no heavy animation)
- Logo large and centered
- Tagline: "Cloud Native Nordics"
- Subtitle: "Connecting cloud native communities across the Nordics"
- Animated counter showing total members (count-up on scroll into view)

### 3. Stats Bar

- Horizontal strip below hero
- Three stats: Total Members | Active Groups | Upcoming Events
- Clean layout: icon + number + label
- Numbers fetched live from Bevy API (aggregated across all groups)

### 4. Interactive Map

- Leaflet map centered on the Nordics (~62N, 15E), zoomed to fit all groups
- Custom-styled markers for each group (using brand colors)
- Click marker: popup with group name, member count, next event, link to group page
- Map tiles match current theme (light/dark)
- Client component (`"use client"`) since Leaflet requires DOM access

### 5. Groups Grid

- Responsive card grid (1 col mobile, 2 col tablet, 3-4 col desktop)
- Each card: city photo background with overlay, group name, member count badge, next event date
- Hover: subtle lift/glow with pink-to-gold gradient border
- Click: navigates to `/groups/[slug]`

### 6. Upcoming Events

- Next 6 events across all groups, sorted by date
- Card or timeline layout: event title, group name, date, location
- Each links out to the Bevy event page
- "View all events" link per group

### 7. CFP Section

- Strong visual section with gradient background
- Headline: "Share your knowledge"
- Brief description of the CFP process
- Prominent CTA button linking to `cfp.cloudnativenordics.com`
- Mention of topic areas and available locations

### 8. Join the Community

- Slack invite link (prominent button)
- GitHub link
- Twitter/X hashtag
- Clean icon-based layout

### 9. Footer

- CNCF attribution/logo
- Social links
- Copyright
- Links to key sections

## Group Detail Page (`/groups/[slug]`)

- Hero section with city photo
- Group name, member count, platform badge (Bevy)
- Organizers list (from YAML)
- Upcoming events list (from Bevy API)
- Past events (recent 10, from Bevy API)
- Link to Bevy page
- CTA to submit a talk (link to CFP)

## Group YAML Schema

Each group is defined in `data/groups/{slug}.yaml`:

```yaml
name: Cloud Native Aarhus
city: Aarhus
country: Denmark
latitude: 56.1629
longitude: 10.2039
platform: bevy
platform_url: https://community.cncf.io/cloud-native-aarhus/
slack_channel: "#cloud-native-aarhus"
organizers:
  - name: Kasper Nissen
    role: Lead Organizer
```

Required fields: `name`, `city`, `country`, `latitude`, `longitude`, `platform`, `platform_url`
Optional fields: `slack_channel`, `organizers`

The `platform_url` is used to derive the Bevy chapter slug for API calls.

## Bevy API Integration

### Client (`lib/bevy.ts`)

Wraps the Bevy public API at `https://community.cncf.io/api/`:

- `getChapterInfo(slug: string)` — chapter name, description, member count
- `getChapterEvents(slug: string)` — upcoming and past events

### Data Flow

1. On page request, server component reads all YAML files from `data/groups/`
2. For each group, fetches chapter info and events from Bevy API
3. Aggregates totals (members, events) for stats bar
4. Passes data to client components (map, cards, event lists)

### Error Handling

- If Bevy API is down or slow (>5s timeout), gracefully degrade
- Show group info from YAML, display "Events temporarily unavailable"
- Individual group failures don't break the whole page

## Slack Integration (cnnform addition)

### What Changes in cnnform

Add to the existing `POST /api/submissions` handler in cnnform:

1. After successful D1 insert, send Slack notification via incoming webhook
2. New Cloudflare Worker secret: `SLACK_WEBHOOK_URL`
3. Slack message format: rich block with speaker name, talk title, talk type, preferred locations, link to admin detail page

### Message Format

```
New CFP Submission
Speaker: {name}
Talk: {title}
Type: {talk_type}
Locations: {locations}
[View in Dashboard →]
```

### Future: Per-Group Routing

Group YAML includes `slack_channel`. Currently all notifications go to one webhook. Can later be extended to route by location preference using multiple webhooks or Slack's `channel` parameter with a bot token.

## Deployment

### Website (Next.js)

- Cloudflare Pages via `@cloudflare/next-on-pages`
- `wrangler.toml` configures the Pages project
- Custom domain: `cloudnativenordics.com`
- SSR functions run on Cloudflare's edge network

### CFP Backend (cnnform)

- Already deployed on Cloudflare Workers at `cfp.cloudnativenordics.com`
- Only change: add `SLACK_WEBHOOK_URL` secret and webhook code

### CI/CD

- GitHub Actions workflow: on push to `master`, build and deploy to Cloudflare Pages
- Uses `npx @cloudflare/next-on-pages` for the build step
- Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets

## Migration Plan

This is a full rewrite — the Hugo site is replaced entirely. Key steps:

1. Set up Next.js project with Tailwind and Cloudflare Pages config
2. Create group YAML files for all current chapters
3. Build Bevy API client
4. Build homepage components (hero, stats, map, groups, events, CFP, community)
5. Build group detail page
6. Implement dark/light mode
7. Add Slack webhook to cnnform
8. Set up Cloudflare Pages deployment
9. Test with real Bevy data
10. Switch DNS / update GitHub Pages to Cloudflare Pages
