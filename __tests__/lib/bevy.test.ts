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
