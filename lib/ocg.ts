import type { CommunityEvent } from "./types";

// CNCF migrated all community groups from Bevy to the Open Community Groups
// platform (https://ocgroups.dev), built on cncf/open-community-groups. It is
// an htmx app, but its explore search endpoints return JSON.
const OCG_BASE = "https://ocgroups.dev";
const COMMUNITY = "cncf";
const FETCH_TIMEOUT_MS = 10000;
const PAGE_SIZE = 10; // explore search endpoints page in tens
const PAST_LIMIT = 10; // group pages only ever display the 10 most recent past events

interface OcgApiEvent {
  event_id: string;
  name: string;
  slug: string;
  group_slug_pretty: string;
  group_name: string;
  starts_at: number; // unix seconds
  ends_at: number; // unix seconds
  logo_url?: string;
  venue_city?: string;
  canceled: boolean;
  published: boolean;
  test_event: boolean;
}

interface OcgEventsResponse {
  events: OcgApiEvent[];
  total: number;
}

export interface GroupData {
  upcoming: CommunityEvent[];
  past: CommunityEvent[];
}

async function fetchJson<T>(url: string): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function isVisible(e: OcgApiEvent): boolean {
  return e.published && !e.canceled && !e.test_event;
}

function normalizeEvent(raw: OcgApiEvent): CommunityEvent {
  return {
    id: raw.event_id,
    title: raw.name,
    start_date: new Date(raw.starts_at * 1000).toISOString(),
    end_date: new Date(raw.ends_at * 1000).toISOString(),
    url: `${OCG_BASE}/${COMMUNITY}/group/${raw.group_slug_pretty}/event/${raw.slug}`,
    group_slug: raw.group_slug_pretty,
    chapter_title: raw.group_name,
    chapter_city: raw.venue_city || "",
  };
}

function eventsSearchUrl(
  ocgSlug: string,
  params: Record<string, string>
): string {
  const search = new URLSearchParams({
    entity: "events",
    "community[0]": COMMUNITY,
    "group[0]": ocgSlug,
    ...params,
  });
  return `${OCG_BASE}/explore/events/search?${search.toString()}`;
}

// The events endpoint applies an implicit `date_from = today` filter, so past
// events must be requested with an explicit wide lower bound.
const PAST_FROM = "1900-01-01";
const FUTURE_TO = "2100-01-01";

export async function fetchGroupEvents(
  ocgSlug: string,
  now: Date = new Date()
): Promise<{ upcoming: CommunityEvent[]; past: CommunityEvent[] }> {
  const today = now.toISOString().slice(0, 10);
  const nowMs = now.getTime();

  // Upcoming: ascending from today, paginated fully (usually a single page).
  const upcoming: CommunityEvent[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const data = await fetchJson<OcgEventsResponse>(
      eventsSearchUrl(ocgSlug, {
        date_from: today,
        date_to: FUTURE_TO,
        sort_direction: "asc",
        offset: String(offset),
      })
    );
    const page = data?.events ?? [];
    upcoming.push(...page.filter(isVisible).map(normalizeEvent));
    if (page.length < PAGE_SIZE) break;
  }

  // Past: descending up to today; only the most recent page is ever displayed.
  const pastData = await fetchJson<OcgEventsResponse>(
    eventsSearchUrl(ocgSlug, {
      date_from: PAST_FROM,
      date_to: today,
      sort_direction: "desc",
    })
  );
  const past = (pastData?.events ?? [])
    .filter(isVisible)
    .map(normalizeEvent)
    .filter((e) => new Date(e.start_date).getTime() < nowMs)
    .slice(0, PAST_LIMIT);

  const futureUpcoming = upcoming
    .filter((e) => new Date(e.start_date).getTime() >= nowMs)
    .sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );

  return { upcoming: futureUpcoming, past };
}

// Fetch events for a single group. Logo and description are resolved at build
// time (scripts/build-groups.mjs) and live on the group object. Groups without
// an `ocg_slug` (e.g. Meetup-hosted, or not yet on the platform) yield no events.
export async function fetchGroupData(
  group: { ocg_slug?: string },
  now: Date = new Date()
): Promise<GroupData> {
  if (!group.ocg_slug) return { upcoming: [], past: [] };
  return fetchGroupEvents(group.ocg_slug, now);
}
