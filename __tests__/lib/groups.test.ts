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
