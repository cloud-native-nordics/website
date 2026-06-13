export interface GroupDefinition {
  slug: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  platform: "ocgroups" | "meetup" | "bevy";
  platform_url: string;
  // Slug on the Open Community Groups platform (ocgroups.dev), used to fetch
  // events. Absent for groups hosted elsewhere (e.g. Meetup).
  ocg_slug?: string;
  // Populated by scripts/build-groups.mjs from ocgroups: a locally-downloaded
  // logo path and the group's short description.
  logo?: string;
  description?: string;
  slack_channel?: string;
  slack_channel_id?: string;
  member_count?: number;
  organizers?: Organizer[];
}

export interface Organizer {
  name: string;
  role?: string;
  company?: string;
  photo?: string;
  linkedin?: string;
  github?: string;
  bluesky?: string;
  twitter?: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  url: string;
  group_slug: string;
  chapter_title: string;
  chapter_city: string;
}

export interface GroupWithData extends GroupDefinition {
  upcoming_events: CommunityEvent[];
  past_events: CommunityEvent[];
}

export interface SiteStats {
  countries: number;
  active_groups: number;
  upcoming_events: number;
}
