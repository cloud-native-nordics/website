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
    description?: string;
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
    chapter_description: raw.chapter.description,
    chapter_relative_url: raw.chapter.relative_url,
  };
}

export async function fetchBevyEvents(): Promise<BevyEvent[]> {
  try {
    const res = await fetch(`${BEVY_API_BASE}/event/?page_size=500`);

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
