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
  chapter_description?: string;
  chapter_relative_url: string;
}

export interface GroupWithData extends GroupDefinition {
  upcoming_events: BevyEvent[];
  past_events: BevyEvent[];
  logo_url?: string;
  description?: string;
}

export interface SiteStats {
  countries: number;
  active_groups: number;
  upcoming_events: number;
}
