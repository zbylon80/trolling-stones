export type NewsLink = {
  label: string;
  url: string;
};

export type NewsItem = {
  id: string;
  date: string;
  title: string;
  summary: string;
  eventDate?: string;
  image?: string;
  video?: string;
  links?: NewsLink[];
};

export const news: NewsItem[] = [
  {
    id: "2025-12-07-blues-club-podziekowania",
    date: "2025-12-07",
    title: "Dziękujemy za ogień w Blues Clubie!",
    summary:
      "Dziękujemy z całą mocą za ten wczorajszy ogień! To, co wydarzyło się na scenie, przeszło nasze najśmielsze oczekiwania. Wasza energia, wasze głosy i ta fala dźwięku wracająca do nas ze sceny – coś absolutnie nie do podrobienia. Jeszcze długo będziemy żyć tym, co razem odpaliliśmy. Ogromne ukłony dla naszych wyjątkowych gości: Paula Szczepkowska, która dołożyła do naszego grania serce i magię oraz słodkie dźwięki z nieba; Krzysztof Jaryczewski, za jego moc i charyzmę – to zaszczyt wystąpić na jednej scenie z legendą; oraz Oskara Abraham, naszego wcześniej nieogłoszonego gościa, który rozpalił atmosferę jeszcze bardziej. Oskar jesteś sigmą! Wielkie, szczere dzięki dla ludzi, bez których ten wieczór nie brzmiałby i nie wyglądał tak epicko: Emil Kohnke – nasz realizator, który jak nikt potrafi okiełznać dźwięk i zrobić z niego ścianę ognia; Klaudia Czyżewska – odpowiedzialna za światła, dzięki której każdy riff i każdy refren miał swój własny blask; Krzysiek i cała ekipa Blues Club Gdynia – za profesjonalizm, klimat i wsparcie na każdym kroku. Jesteście niesamowici. Do zobaczenia na kolejnych koncertach – po takim wieczorze wiemy jedno: dopiero się rozkręcamy! 🔥🎸",
    image: "/images/blues.jpg"
  },
  {
    id: '2025-12-06-gdynia',
    date: '2025-12-06',
    eventDate: '2025-12-06',
    title: 'Blues Club Gdynia – koncert z gośćmi',
    summary:
      '6 grudnia wracamy do Blues Clubu w Gdyni na specjalny koncert, podczas którego wystąpią z nami bardziej lub mniej znani goście. Przygotowujemy energetyczny, świąteczny set i kilka niespodzianek. Jak widać na załączonym filmie, nie obyło się bez drobnych komplikacji 🙂',
    video: '/videos/pool-party.mp4',
    links: [
      {
        label: 'Kup bilety',
        url: 'https://www.kupbilecik.pl/imprezy/178393/gdynia/trolling.stones/?fbclid=IwY2xjawNHhslleHRuA2FlbQIxMABicmlkETBPN1BKejlTMDkzQ2I0dzFyAR4W4ngcY4VxRQ4ienRv9TzSDmHQbZ_GLHKyZcAfwTbdOuTJY2OmlqjwSig9Yw_aem_y9hSvaAwf86E_6Zy5wFcRQ'
      }
    ]
  },
  {
    id: '2025-03-06-yt-cyhkm',
    date: '2025-03-06',
    title: "Nowe wideo: Can't You Hear Me Knocking (live)",
    summary:
      'Na naszym kanale YouTube znajdziesz świeże nagranie z marcowej próby – sięgnęliśmy po "Can\'t You Hear Me Knocking" w wersji na żywo pełnej improwizacji.',
    links: [
      {
        label: 'Obejrzyj na YouTube',
        url: 'https://www.youtube.com/watch?v=Va2NqLJPnkw'
      }
    ]
  },
  {
    id: '2025-01-12-wosp',
    date: '2025-01-12',
    title: 'Paint It Black na WOŚP w Gdańsku',
    summary:
      'Udostępniliśmy zapis naszego wykonania "Paint It Black" z finału WOŚP 2025 w Gdańsku. Dziękujemy wszystkim, którzy byli z nami i wsparli zbiórkę!',
    links: [
      {
        label: 'Zobacz nagranie',
        url: 'https://www.youtube.com/watch?v=P7VS3KmmEVk'
      }
    ]
  }
];
