// Everything the site says about the bar lives here: contacts, hours, menu, rules, reviews.

export const club = {
  name: "PODVAL",
  kind: "Кальян-бар",
  city: "Казань",
  address: "ул. Габдуллы Тукая, 7/20",
  addressFull: "Казань, ул. Габдуллы Тукая, 7/20",
  phone: "+7 (962) 556-34-74",
  phoneHref: "tel:+79625563474",
  whatsapp: "https://wa.me/79625563474",
  telegram: "https://t.me/kazanskypodval",
  telegramName: "@kazanskypodval",
  // Google Maps by coordinates of the building (ул. Габдуллы Тукая, 7), so the city and address never get mixed up
  coords: "55.7846821,49.1090369",
  googleMap: "https://www.google.com/maps/search/?api=1&query=55.7846821%2C49.1090369",
  googleRoute: "https://www.google.com/maps/dir/?api=1&destination=55.7846821%2C49.1090369",
  mapWidget: "https://maps.google.com/maps?q=55.7846821,49.1090369&z=17&hl=ru&output=embed",
  // the rating and reviews on the site are taken from Yandex Maps
  yandexReviews: "https://yandex.ru/maps/org/podval/159775749858/reviews/",
  rating: "4,9",
  ratings: 142,
  reviews: 87,
};

/** Opening hours by weekday, Monday first. Close is past midnight, so it is written as 26 = 02:00. */
export const hours: { days: string; from: number; to: number }[] = [
  { days: "Пн–Чт, Вс", from: 16, to: 26 },
  { days: "Пт–Сб", from: 18, to: 28 },
];

/** Opening hour and closing hour (past midnight as 24+) of a date. */
export function openHours(d: Date) {
  const day = d.getDay(); // 0 = Sunday
  return day === 5 || day === 6 ? { from: 18, to: 28 } : { from: 16, to: 26 };
}

export const hh = (h: number) => `${String(h % 24).padStart(2, "0")}:00`;

export const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/about", label: "О заведении" },
  { href: "/menu", label: "Меню" },
  { href: "/booking", label: "Бронь" },
  { href: "/gallery", label: "Галерея" },
  { href: "/rules", label: "Правила" },
];

// ---------- menu ----------

export type MenuItem = {
  id: string;
  name: string;
  /** small line above the name: cocktail strength, volume */
  tag?: string;
  note?: string;
  price: number;
  img?: string;
};

export type MenuCategory = { id: string; name: string; lead: string; items: MenuItem[] };

const m = (id: string, name: string, price: number, extra: Partial<MenuItem> = {}): MenuItem => ({
  id,
  name,
  price,
  ...extra,
});

export const menu: MenuCategory[] = [
  {
    id: "hookah",
    name: "Кальян",
    lead: "Табак подберём под настроение: от лёгких фруктовых до плотных и дымных.",
    items: [
      m("hookah-tea", "Кальян + чай", 799, { tag: "до 19:00", note: "Дневное предложение: кальян и чайник чая", img: "/menu/hookah-tea.jpg" }),
      m("hookah", "Кальян", 1200, { img: "/menu/hookah.jpg" }),
      m("hookah-sticker", "Кальян со стикером", 1100, { img: "/menu/hookah-sticker.jpg" }),
      m("hookah-party", "Кальян на вечеринке", 1500, { img: "/menu/hookah-party.jpg" }),
    ],
  },
  {
    id: "tea",
    name: "Чаи",
    lead: "Большие чайники на компанию.",
    items: [
      m("tea-classic", "Классический чай", 200, { note: "Ну это уж совсем просто, но будет сделано с душой)", img: "/menu/tea-classic.png" }),
      m("tea-buckthorn", "Облепиховый чай", 500, { note: "Облепиха, мёд, апельсин, чёрный чай", img: "/menu/tea-buckthorn.jpg" }),
      m("tea-strawberry", "Клубничная апельсинка", 500, { note: "Клубника, апельсин, сироп апельсина, чёрный чай", img: "/menu/tea-strawberry.jpg" }),
      m("tea-currant", "Смородина с чабрецом", 500, { note: "Смородина, сироп гренадин, чабрец, чёрный чай", img: "/menu/tea-currant.jpg" }),
    ],
  },
  {
    id: "soft",
    name: "Б/А напитки",
    lead: "Газировка, энергетики, лимонады и соки.",
    items: [
      m("cola", "Coca-Cola", 250, { tag: "0,33 л", img: "/menu/cola.jpg" }),
      m("sprite", "Sprite", 250, { tag: "0,33 л", img: "/menu/sprite.jpg" }),
      m("fanta", "Fanta", 250, { tag: "0,33 л", img: "/menu/fanta.jpg" }),
      m("lit", "Энергетик LIT Energy", 350, { img: "/menu/lit.jpg" }),
      m("adrenaline", "Энергетик Adrenaline", 350, { img: "/menu/adrenaline.jpg" }),
      m("lemonade", "Лимонад", 250, { tag: "стакан 0,4 л", note: "Сироп, лимонный фреш, газированная вода. Вкус уточните у официанта" }),
      m("lemonade-1l", "Лимонад в графине", 600, { tag: "1 л", note: "Сироп, лимонный фреш, газированная вода. Вкус уточните у официанта" }),
      m("juice", "Сок", 200, { tag: "стакан" }),
      m("juice-1l", "Сок", 400, { tag: "1 л" }),
      m("cola-2l", "Кола", 400, { tag: "2 л" }),
      m("lime-fresh", "Лаймовый фреш", 250),
      m("water-sparkling", "Вода газированная", 150),
      m("water", "Вода без газа", 100),
      m("borjomi", "Боржоми", 300),
      m("clausthaler", "Clausthaler", 400, { tag: "безалкогольное пиво" }),
    ],
  },
  {
    id: "beer",
    name: "Пиво и настойки",
    lead: "Разливное, бутылочное, медовуха и фирменные настойки.",
    items: [
      m("beer-light", "Светлое «Мягкий солод»", 300, { tag: "разливное", img: "/menu/beer-light.jpg" }),
      m("beer-cherry", "Вишнёвое", 350, { tag: "разливное", img: "/menu/beer-cherry.jpg" }),
      m("corona", "Corona", 500, { img: "/menu/corona.jpg" }),
      m("bud", "BUD", 350),
      m("mead", "Медовуха", 350, { note: "Гранат-малина, дыня с мятой, кокосовый цитрус" }),
      m("shot", "Настойка", 170, { tag: "1 шот", note: "Водка, сироп. Вкусы уточните у официанта" }),
      m("shots-10", "Сет настоек", 1400, { tag: "10 шотов", note: "Водка, сироп. Вкусы уточните у официанта", img: "/menu/shots-10.jpg" }),
    ],
  },
  {
    id: "cocktails",
    name: "Коктейли",
    lead: "Easy, medium и hard: чем выше уровень, тем крепче.",
    items: [
      m("gin-tonic", "Джин-тоник", 500, { tag: "easy", note: "Джин, тоник, фреш лимона", img: "/menu/gin-tonic.jpg" }),
      m("clover-club", "Clover Club", 500, { tag: "easy", note: "Джин, фреш лимона, сахарный сироп, сироп малины, яичный белок", img: "/menu/clover-club.jpg" }),
      m("apple-highball", "Apple Highball", 500, { tag: "easy", note: "Яблочный виски, яблочный сок", img: "/menu/apple-highball.jpg" }),
      m("pornstar", "Pornstar Martini", 550, { tag: "easy", note: "Водка, ванильный сироп, маракуйя, фреш лимона, игристое", img: "/menu/pornstar.jpg" }),
      m("campari", "Campari Spritz", 500, { tag: "easy", note: "Кампари, игристое, газированная вода", img: "/menu/campari.jpg" }),
      m("sunrise", "Tequila Sunrise", 600, { tag: "easy", note: "Текила, апельсиновый сок, сироп гренадин", img: "/menu/sunrise.jpg" }),
      m("aperol", "Aperol Spritz", 550, { tag: "easy", note: "Апероль, игристое, газированная вода", img: "/menu/aperol.jpg" }),
      m("white-russian", "Белый русский", 500, { tag: "easy", note: "Водка, кофейный ликёр, сливки", img: "/menu/white-russian.jpg" }),
      m("whiskey-sour", "Whiskey Sour", 550, { tag: "easy", note: "Виски, фреш лимона, сахарный сироп, яичный белок", img: "/menu/whiskey-sour.jpg" }),
      m("slippers", "Japanese Slipper", 500, { tag: "easy", note: "Трипл сек, дынный сироп, сок лимона", img: "/menu/slippers.jpg" }),
      m("blue-lagoon", "Голубая лагуна", 550, { tag: "easy", note: "Водка, спрайт, блю кюрасао", img: "/menu/blue-lagoon.jpg" }),
      m("whisky-cola", "Виски-кола", 600, { tag: "medium", note: "Виски, кола", img: "/menu/whisky-cola.jpg" }),
      m("margarita", "Margarita", 600, { tag: "medium", note: "Текила, трипл сек, сок лимона, сахарный сироп", img: "/menu/margarita.jpg" }),
      m("paloma", "Paloma", 600, { tag: "medium", note: "Текила, сахарный сироп, фреш лимона, грейпфрутовый сок", img: "/menu/paloma.jpg" }),
      m("daiquiri", "Daiquiri", 550, { tag: "medium", note: "Джин, трипл сек, фреш лимона, сахарный сироп", img: "/menu/daiquiri.jpg" }),
      m("mai-tai", "Mai Tai", 600, { tag: "hard", note: "Ром, трипл сек, миндальный сироп, фреш лимона, ананасовый сок", img: "/menu/mai-tai.jpg" }),
      m("negroni", "Negroni", 550, { tag: "hard", note: "Джин, кампари, красный вермут", img: "/menu/negroni.jpg" }),
      m("long-island", "Long Island", 650, { tag: "hard", note: "Джин, текила, водка, ром, трипл сек, лимон, кола", img: "/menu/long-island.jpg" }),
      m("electro-long", "Electro Long", 700, { tag: "hard", note: "Водка, джин, текила, трипл сек, лимон, блю кюрасао, спрайт", img: "/menu/electro-long.jpg" }),
      m("signature", "Авторский коктейль", 700, { tag: "от бармена", note: "Расскажите бармену, что любите, остальное он придумает сам" }),
    ],
  },
  {
    id: "bottles",
    name: "Бутылки",
    lead: "Вино, игристое и крепкий алкоголь на стол.",
    items: [
      m("kindzmarauli", "Киндзмараули", 3000, { tag: "вино", note: "Красное полусладкое, Грузия", img: "/menu/kindzmarauli.jpg" }),
      m("moet", "Moët & Chandon", 12000, { tag: "игристое", note: "Брют, Франция", img: "/menu/moet.jpg" }),
      m("espolon", "Espolòn", 6600, { tag: "текила", img: "/menu/espolon.jpg" }),
      m("jim-beam", "Jim Beam", 7000, { tag: "бурбон", note: "США", img: "/menu/jim-beam.jpg" }),
      m("singleton", "Singleton", 8000, { tag: "виски", note: "12 лет, односолодовый, Шотландия", img: "/menu/singleton.jpg" }),
      m("chivas", "Chivas Regal", 8000, { tag: "виски", note: "12 лет, купажированный, Шотландия", img: "/menu/chivas.jpg" }),
      m("macallan", "Macallan", 25000, { tag: "виски", note: "12 лет, односолодовый, Шотландия", img: "/menu/macallan.jpg" }),
      m("william-lawsons", "William Lawson's", 3500, { tag: "виски" }),
      m("red-label", "Red Label", 5000, { tag: "виски" }),
      m("jager", "Jägermeister", 5000, { tag: "ликёр", img: "/menu/jager.jpg" }),
      m("beluga", "Beluga Transatlantic", 5000, { tag: "водка", img: "/menu/beluga.jpg" }),
      m("courvoisier", "Courvoisier VS", 10000, { tag: "коньяк", note: "Франция", img: "/menu/courvoisier.jpg" }),
      m("oakheart", "Oakheart", 3500, { tag: "ром" }),
    ],
  },
];

export const allItems = menu.flatMap((c) => c.items);
export const itemById = (id: string) => allItems.find((i) => i.id === id);

/** The best value on the menu, with what the same costs bought one by one. */
export const deals: { id: string; title: string; was: number; why: string }[] = [
  { id: "hookah-tea", title: "Кальян + чай до 19:00", was: 1400, why: "Кальян и чайник чая за 799 ₽ вместо 1 400 ₽, если прийти до семи вечера." },
  { id: "shots-10", title: "10 настоек сетом", was: 1700, why: "Десять шотов на компанию дешевле, чем брать их по одному." },
  { id: "lemonade-1l", title: "Лимонад в графине", was: 625, why: "Литр на стол: выходит дешевле, чем два с половиной стакана." },
  { id: "cola-2l", title: "Кола 2 литра", was: 1500, why: "Два литра на стол за 400 ₽: шесть баночек по 0,33 обошлись бы в 1 500 ₽." },
];

export const rub = (n: number) => `${n.toLocaleString("ru-RU")} ₽`;

// ---------- rules (fees moved from the menu's "Прочее") ----------

export const fees: { name: string; note?: string; price: number }[] = [
  { name: "Пробковый сбор: вино и шампанское", note: "За бутылку, которую вы принесли с собой", price: 200 },
  { name: "Пробковый сбор: крепкий алкоголь", note: "За бутылку, которую вы принесли с собой", price: 400 },
  { name: "Бой посуды", note: "Бокал, кальянная колба, тарелка", price: 2000 },
  { name: "Порча мебели", note: "Диваны, столы, декор зала", price: 5000 },
  { name: "Уборка туалета после гостя", note: "Если гость не рассчитал силы", price: 3000 },
  { name: "Продление работы на 1 час", note: "Для закрытых мероприятий после закрытия", price: 10000 },
];

// ---------- reviews (short excerpts from Yandex Maps) ----------

export const reviews: { name: string; date: string; text: string }[] = [
  { name: "Евгений", date: "13 ноября 2025", text: "Отличное место для отдыха как с большой компанией, так и посидеть одной. Обслуживание 10/10." },
  { name: "BLOK FIRE", date: "4 февраля 2025", text: "Много настольных игр для компаний, есть караоке, вкуснейшие кальяны и PS5 с новыми играми." },
  { name: "Ильмира", date: "12 ноября 2025", text: "Пришли с подругами: кальяны, бар, плейстейшн и караоке. Интерьер очень красивый и уютный." },
  { name: "Лера П.", date: "25 января 2026", text: "Кальян мягкий, курится легко, кальянщик учитывает все пожелания. Будем приходить снова!" },
  { name: "Надежда", date: "8 октября 2025", text: "Хорошая музыка, вкусный кальян, приятные цены, чисто. Всегда найдёшь себе занятие." },
  { name: "Наиля", date: "23 августа 2025", text: "Каждый раз мой вечер проходит приятно и эстетично. Душевное обслуживание и современная музыка." },
  { name: "Юля", date: "9 августа 2025", text: "Интересный дизайн, настольные игры, книги, вай-фай. Пробковый сбор недорогой, цены огонь." },
  { name: "Эльвина", date: "30 марта 2026", text: "Кальян супер, обслуживание на высоте, атмосфера вайбовая. Особенно голубая лагуна!" },
];

// ---------- gallery ----------

export type Photo = { src: string; alt: string; w: number; h: number };

export const gallery: { id: string; name: string; text: string; photos: Photo[] }[] = [
  {
    id: "bar",
    name: "Бар",
    text: "Стойка из светящихся брусков, неоновая вывеска и стена в граффити-монстрах.",
    photos: [
      { src: "/photos/bar-wide.webp", alt: "Барная стойка с подсветкой, три высоких стула и оранжевая неоновая вывеска bar", w: 1280, h: 853 },
      { src: "/photos/bar-sign.webp", alt: "Неон bar над полками с табаком и краны разливного пива", w: 960, h: 1280 },
    ],
  },
  {
    id: "hall",
    name: "Гостевой зал",
    text: "Диваны, столы из слэбов, светильники-шишки и неон «Где родился, там и прикурился».",
    photos: [
      { src: "/photos/hall-bar.webp", alt: "Стол из слэба и диваны, вдали бар с неоновой вывеской", w: 960, h: 1280 },
      { src: "/photos/hall-lamp.webp", alt: "Светильник-шишка над столом, розовый неон на стене с граффити", w: 960, h: 1280 },
      { src: "/photos/hall-wide.webp", alt: "Зал в розовом свете: диваны, книжный стеллаж и неон 18+", w: 1280, h: 853 },
    ],
  },
  {
    id: "lounge",
    name: "Лаунж за цепями",
    text: "Приватные места за занавесом из цепей, книги и тёплые лампы.",
    photos: [
      { src: "/photos/lounge-chains.webp", alt: "Синий диван, стеллаж с книгами и занавес из металлических цепей", w: 1280, h: 853 },
    ],
  },
  {
    id: "ps5",
    name: "PlayStation 5",
    text: "Большой экран на стене-коллаже, диваны напротив и свежие игры.",
    photos: [
      { src: "/photos/ps5.webp", alt: "Телевизор с меню PlayStation 5 на стене из фотографий, диваны напротив", w: 1280, h: 853 },
    ],
  },
  {
    id: "retro",
    name: "Ретро-стена",
    text: "Стена из постеров хип-хопа и кино девяностых, зелёная ниша и стол на двоих.",
    photos: [
      { src: "/photos/retro-wall.webp", alt: "Два дивана у стены, обклеенной постерами, светильник-шишка над столом", w: 1280, h: 853 },
    ],
  },
];
