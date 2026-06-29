import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchGroupEvents, fetchGroupData } from "@/lib/ocg";

function json(body: unknown) {
  return new Response(JSON.stringify(body), { status: 200 });
}

// Builds an ocgroups-shaped event. starts_at/ends_at are unix seconds.
function apiEvent(
  overrides: Partial<{
    event_id: string;
    name: string;
    slug: string;
    starts_at: number;
    ends_at: number;
    canceled: boolean;
    published: boolean;
    test_event: boolean;
  }> = {}
) {
  return {
    event_id: "e1",
    name: "Kubernetes 101",
    slug: "k8s101",
    group_slug_pretty: "cncf-aarhus",
    group_name: "Cloud Native Aarhus",
    starts_at: 0,
    ends_at: 0,
    logo_url: "/images/logo.jpg",
    venue_city: "Aarhus",
    canceled: false,
    published: true,
    test_event: false,
    ...overrides,
  };
}

const NOW = new Date("2026-04-01T00:00:00Z");
const FUTURE = Math.floor(new Date("2026-04-15T17:00:00Z").getTime() / 1000);
const PAST = Math.floor(new Date("2026-03-01T17:00:00Z").getTime() / 1000);

describe("fetchGroupEvents", () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it("normalizes events and splits upcoming/past by date", async () => {
    vi.spyOn(global, "fetch").mockImplementation((input) => {
      const url = String(input);
      // First call (sort asc) returns the upcoming event; second (desc) the past one.
      if (url.includes("sort_direction=asc")) {
        return Promise.resolve(
          json({ events: [apiEvent({ event_id: "up", starts_at: FUTURE, ends_at: FUTURE })], total: 1 })
        );
      }
      return Promise.resolve(
        json({ events: [apiEvent({ event_id: "pa", name: "GitOps", slug: "gitops", starts_at: PAST, ends_at: PAST })], total: 1 })
      );
    });

    const { upcoming, past } = await fetchGroupEvents("cncf-aarhus", NOW);

    expect(upcoming).toHaveLength(1);
    expect(upcoming[0].title).toBe("Kubernetes 101");
    expect(upcoming[0].url).toBe("https://ocgroups.dev/cncf/group/cncf-aarhus/event/k8s101");
    expect(upcoming[0].start_date).toBe("2026-04-15T17:00:00.000Z");

    expect(past).toHaveLength(1);
    expect(past[0].title).toBe("GitOps");
  });

  it("excludes canceled, unpublished, and test events", async () => {
    vi.spyOn(global, "fetch").mockImplementation((input) => {
      const url = String(input);
      if (url.includes("sort_direction=asc")) {
        return Promise.resolve(
          json({
            events: [
              apiEvent({ event_id: "ok", starts_at: FUTURE, ends_at: FUTURE }),
              apiEvent({ event_id: "x1", starts_at: FUTURE, ends_at: FUTURE, canceled: true }),
              apiEvent({ event_id: "x2", starts_at: FUTURE, ends_at: FUTURE, published: false }),
              apiEvent({ event_id: "x3", starts_at: FUTURE, ends_at: FUTURE, test_event: true }),
            ],
            total: 4,
          })
        );
      }
      return Promise.resolve(json({ events: [], total: 0 }));
    });

    const { upcoming } = await fetchGroupEvents("cncf-aarhus", NOW);
    expect(upcoming.map((e) => e.id)).toEqual(["ok"]);
  });

  it("returns empty arrays when the API fails", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("timeout"));
    const { upcoming, past } = await fetchGroupEvents("cncf-aarhus", NOW);
    expect(upcoming).toEqual([]);
    expect(past).toEqual([]);
  });
});

describe("fetchGroupData", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("returns no events for groups without an ocg_slug", async () => {
    const spy = vi.spyOn(global, "fetch");
    const data = await fetchGroupData({}, NOW);
    expect(data).toEqual({ upcoming: [], past: [] });
    expect(spy).not.toHaveBeenCalled();
  });
});
