export type Gig = {
  date: string;
  city: string;
  cityEn?: string;
  venue: string;
  venueEn?: string;
  tickets?: string;
  headline?: string;
  headlineEn?: string;
  description?: string;
  descriptionEn?: string;
  photo?: string;
  photoAlt?: string;
  photoAltEn?: string;
  photoPosition?: string;
  story?: string;
};

export const upcomingGigs: Gig[] = [
  {
    date: "2026-12-05",
    city: "Gdynia",
    venue: "Blues Club",
    headline: "Wracamy do Blues Clubu!",
    headlineEn: "Back at the Blues Club!",
    description: "Stonesowe riffy. Klubowy klimat. Widzimy się pod sceną.",
    descriptionEn: "Stones riffs. An intimate club. See you in front of the stage.",
    photo: "/images/concert-promo.jpg"
  }
];

export const pastGigs: Gig[] = [
  {
    date: "2026-07-11",
    city: "Gmina Puck",
    cityEn: "Puck municipality",
    venue: ""
  },
  {
    date: "2026-07-10",
    city: "Stężyca",
    venue: "Przystań",
    venueEn: "Marina"
  },
  {
    date: "2025-12-06",
    city: "Gdynia",
    venue: "Blues Club",
    photo: "/images/blues.jpg",
    photoAlt: "TRolling Stones z publicznością w Blues Clubie w Gdyni",
    photoAltEn: "TRolling Stones with the audience at Blues Club in Gdynia",
    photoPosition: "50% 45%",
    story: "/aktualnosci"
  }
];
