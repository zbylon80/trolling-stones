export type Gig = {
  date: string;
  city: string;
  cityEn?: string;
  venue: string;
  venueEn?: string;
  tickets?: string;
  startTime?: string;
  source?: string;
  privateEvent?: boolean;
  preview?: string;
  previewCredit?: string;
  headline?: string;
  headlineEn?: string;
  description?: string;
  descriptionEn?: string;
  photo?: string;
  photoAlt?: string;
  photoAltEn?: string;
  photoPosition?: string;
  story?: string;
  storyEn?: string;
};

export const upcomingGigs: Gig[] = [
  {
    date: "2026-12-05",
    city: "Gdynia",
    venue: "Blues Club",
    startTime: "2026-12-05T19:30:00+01:00",
    tickets: "https://www.bluesclub.pl/project/trolling-stones-out-of-control-tour-2024/",
    headline: "Wracamy do Blues Clubu",
    headlineEn: "Back at the Blues Club",
    description: "Stonesowe riffy. Klubowy klimat. Widzimy się pod sceną.",
    descriptionEn: "Stones riffs. An intimate club. See you in front of the stage.",
    photo: "/images/concert-promo.jpg"
  }
];

export const pastGigs: Gig[] = [
  {
    date: "2026-07-11",
    preview: "/images/concerts/2026-07-11-polchowo.webp",
    city: "Połchowo",
    venue: "Rock na Fali — boisko przy ul. Dworcowej",
    venueEn: "Rock na Fali — sports ground on Dworcowa Street",
    source: "https://ckgminapuck.pl/kalendarz/rock-na-fali-polchowo/"
  },
  {
    date: "2026-07-10",
    city: "Stężyca",
    venue: "Przystań",
    venueEn: "Marina"
  },
  {
    date: "2026-05-23",
    preview: "/images/concerts/2026-05-23-sycowa-huta.webp",
    city: "Sycowa Huta",
    venue: "Pomorska Majówka — OW Kormoran",
    venueEn: "Pomorska Majówka — Kormoran holiday resort",
    source: "https://www.facebook.com/photo.php?fbid=1652734803523974"
  },
  {
    date: "2025-12-06",
    city: "Gdynia",
    venue: "Blues Club",
    photo: "/images/blues.jpg",
    photoAlt: "TRolling Stones z publicznością w Blues Clubie w Gdyni",
    photoAltEn: "TRolling Stones with the audience at Blues Club in Gdynia",
    photoPosition: "50% 45%",
    story: "/aktualnosci#2025-12-07-blues-club-podziekowania",
    storyEn: "/aktualnosci#2025-12-07-blues-club-thank-you"
  },
  {
    date: "2025-05-18",
    preview: "/images/concerts/2025-05-18-sopot.webp",
    city: "Sopot",
    venue: "Classic Moto Story — Skwer Kuracyjny",
    venueEn: "Classic Moto Story — Skwer Kuracyjny",
    source: "https://karta.sopot.pl/pl/wydarzenia/classic-moto-story---%20nie-tylko-zachod%20-11331810"
  },
  {
    date: "2025-01-26",
    preview: "/images/concerts/2025-01-26-gdansk.webp",
    city: "Gdańsk",
    venue: "33. Finał WOŚP — scena przy ECS",
    venueEn: "33rd WOŚP Grand Finale — stage by the European Solidarity Centre",
    source: "https://radiogdansk.pl/wiadomosci/region/trojmiasto/2025/01/23/33-final-wielkiej-orkiestry-swiatecznej-pomocy-w-trojmiescie-plany-miejskich-wydarzen/"
  },
  {
    date: "2025-01-10",
    city: "Koszalin",
    // The date is confirmed by the ticket platform. The venue is not yet confirmed.
    venue: "",
    source: "https://www.kupbilecik.pl/pl/comments/3509/trolling-stones"
  },
  {
    date: "2024-12-13",
    preview: "/images/concerts/2024-12-13-chorzow.webp",
    city: "Chorzów",
    venue: "Leśniczówka Rock’n’Roll Cafe",
    source: "https://lesniczowka.art.pl/event/trolling-stones/"
  },
  {
    date: "2024-12-07",
    preview: "/images/concerts/2024-12-07-gdynia.webp",
    city: "Gdynia",
    venue: "Blues Club",
    source: "https://www.facebook.com/events/366339302610116/"
  },
  {
    date: "2024-12-06",
    preview: "/images/concerts/2024-12-06-malbork.webp",
    city: "Malbork",
    venue: "CieKawa KluboKawiarnia",
    source: "https://www.facebook.com/events/957201925679461/"
  },
  {
    date: "2024-09-21",
    preview: "/images/concerts/2024-09-21-torun.webp",
    city: "Toruń",
    venue: "Kombinat Kultury",
    source: "https://www.facebook.com/events/445531104514585/"
  },
  {
    date: "2024-09-20",
    preview: "/images/concerts/2024-09-20-bialystok.webp",
    city: "Białystok",
    venue: "Klub Muzyczny Sześcian",
    source: "https://www.facebook.com/events/1866469713773979/"
  },
  {
    date: "2024-08-30",
    city: "Gdańsk",
    venue: "Paszcza Lwa — Babilońskie zakończenie lata",
    venueEn: "Paszcza Lwa — Babylonian End of Summer",
    source: "https://www.facebook.com/events/773034784982480/"
  },
  {
    date: "2024-07-20",
    city: "Kaliska",
    venue: "Dni Kalisk — Lato na Kociewiu",
    venueEn: "Dni Kalisk — Summer in Kociewie",
    source: "https://archiwum.kaliska.pl/festyn-dni-kalisk-lato-na-kociewiu-2024"
  },
  {
    date: "2024-05-05",
    preview: "/images/concerts/2024-05-05-bydgoszcz.webp",
    city: "Bydgoszcz",
    venue: "Over the Under Pub",
    source: "https://www.facebook.com/events/1112620403194052/"
  },
  {
    date: "2023-11-18",
    preview: "/images/concerts/2023-11-18-gdynia.webp",
    city: "Gdynia",
    venue: "Blues Club",
    source: "https://www.facebook.com/events/1498859417617767/"
  },
  {
    date: "2022-11-19",
    preview: "/images/concerts/2022-11-19-gdynia.webp",
    city: "Gdynia",
    venue: "Blues Club",
    source: "https://www.facebook.com/events/1153344715307482/"
  },
  {
    date: "2021-08-07",
    preview: "/images/concerts/2021-08-07-zukowo.webp",
    city: "Żukowo",
    venue: "Muza nad Jeziorkiem — Park nad Jeziorkiem",
    venueEn: "Muza nad Jeziorkiem — Park nad Jeziorkiem",
    source: "https://www.facebook.com/events/367737331420527/"
  },
  {
    date: "2019-12-07",
    preview: "/images/concerts/2019-12-07-gdynia.webp",
    city: "Gdynia",
    venue: "Blues Club",
    source: "https://www.facebook.com/events/464796297423245/"
  },
  {
    date: "2019-09-07",
    preview: "/images/concerts/2019-09-07-gdansk.webp",
    city: "Gdańsk",
    venue: "Paszcza Lwa — Stones in Lion’s Mouth",
    source: "https://www.facebook.com/events/440093386844743/"
  },
  {
    date: "2019-04-26",
    preview: "/images/concerts/2019-04-26-lebork.webp",
    previewCredit: "Adam Chmara",
    city: "Lębork",
    venue: "Kino Fregata",
    venueEn: "Fregata cinema",
    source: "https://www.facebook.com/media/set/?set=a.2285942688399167&type=3"
  },
  {
    date: "2019-01-26",
    preview: "/images/concerts/2019-01-26-gdynia.webp",
    city: "Gdynia",
    venue: "Blues Club",
    source: "https://www.facebook.com/events/370246233729565/"
  }
];
