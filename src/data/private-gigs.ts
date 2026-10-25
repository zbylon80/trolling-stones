import type { Gig } from "./gigs";

// Fictional private-event entries requested by the site owner.
// Kept separate from source-verified shows; no invented photographs or reports.
export const privateGigs: Gig[] = [
  "2026-10-02",
  "2026-08-22",
  "2026-03-13",
  "2026-01-17",
  "2025-10-10",
  "2025-08-23",
  "2025-06-20",
  "2025-03-15"
].map((date) => ({
  date,
  privateEvent: true,
  city: "Impreza zamknięta",
  cityEn: "Private event",
  venue: "Koncert prywatny",
  venueEn: "Private show"
}));
