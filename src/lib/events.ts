// Publish only owner-confirmed events. No dates, venues or capacity are seeded.
export type HouseEvent = {
  slug: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  venue: string;
  membersOnly: boolean;
  capacity: number | null;
  remaining: number | null;
  state: "upcoming" | "past" | "waitlist";
  rsvpUrl: string | null;
};
export const events: HouseEvent[] = [];
export function eventDate(event: HouseEvent) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: event.timezone,
  }).format(new Date(event.startsAt));
}
