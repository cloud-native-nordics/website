# Cloud Native Nordics Website

The official website for Cloud Native Nordics — connecting cloud native communities across the Nordic countries.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
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

The Call for Papers form is managed separately at [cfp.cloudnativenordics.com](https://cfp.cloudnativenordics.com).
