export type Collection = {
  id: string;
  name: string;
  blurb: string;
  href: string;
  image: string;
  tag: string;
};

export type Charm = {
  id: string;
  name: string;
  kind: "story" | "star" | "stone" | "letter";
  glyph: string;
  shop: string;
};

export const SHOP = "https://orajewellery.com";
export const INSTAGRAM_FOUNDER = "https://www.instagram.com/natasha.thefounder/";
export const INSTAGRAM_SHOP = "https://www.instagram.com/orajewellerysa/";
export const EMAIL = "hello@orajewellery.com";
export const PHONE = "+27 76 547 2991";
export const STUDIO = "604, 125 Buitengracht Street, Cape Town CBD";
/** Live Stripe Payment Link — Founder Coaching Session £75 */
export const COACHING_CHECKOUT_URL = "https://book.stripe.com/7sY5kCdHdfK3aWJ1qZ53O08";
export const COACHING_PRICE_GBP = 75;

export const collections: Collection[] = [
  {
    id: "charms",
    name: "Charm stacks",
    blurb: "Glide. Stack. Lock in. No clasps.",
    href: `${SHOP}/pages/build-your-charm-stack`,
    image: "/media/hoop-charms.jpg",
    tag: "Hero",
  },
  {
    id: "hoops",
    name: "Hoop earrings",
    blurb: "Rio, Deco, Orbit, Kaleido.",
    href: `${SHOP}/collections/hoop-earrings`,
    image: "/media/hoop-charms.jpg",
    tag: "Everyday",
  },
  {
    id: "bangles",
    name: "Bangles",
    blurb: "A base you live in.",
    href: `${SHOP}/collections/bangles`,
    image: "/media/bangles.jpg",
    tag: "Stack",
  },
  {
    id: "necklaces",
    name: "Necklaces",
    blurb: "Fine chain. One story at the throat.",
    href: `${SHOP}/collections/necklaces`,
    image: "/media/necklace.jpg",
    tag: "Layer",
  },
  {
    id: "signets",
    name: "Signet rings",
    blurb: "A mark that is yours.",
    href: `${SHOP}/collections/signet-rings`,
    image: "/media/signet.jpg",
    tag: "Heirloom",
  },
  {
    id: "rings",
    name: "Rings",
    blurb: "Gemstone, fusion, everyday gold.",
    href: `${SHOP}/collections/rings`,
    image: "/media/signet.jpg",
    tag: "Hand",
  },
];

export const charms: Charm[] = [
  {
    id: "hearts",
    name: "Ace of hearts",
    kind: "story",
    glyph: "♥",
    shop: `${SHOP}/products/ace-of-hearts-gold-plated-charm`,
  },
  {
    id: "flute",
    name: "Champagne flute",
    kind: "story",
    glyph: "Y",
    shop: `${SHOP}/products/champagne-glass-gold-plated-charm`,
  },
  {
    id: "croissant",
    name: "Croissant",
    kind: "story",
    glyph: "C",
    shop: `${SHOP}/products/croissant-gold-plated-charm`,
  },
  {
    id: "eiffel",
    name: "Eiffel tower",
    kind: "story",
    glyph: "A",
    shop: `${SHOP}/products/eiffel-tower-gold-plated-charm`,
  },
  {
    id: "letter",
    name: "Letter clip",
    kind: "letter",
    glyph: "N",
    shop: `${SHOP}/collections/new-charms-1`,
  },
  {
    id: "boy",
    name: "Boy birthstone",
    kind: "stone",
    glyph: "B",
    shop: `${SHOP}/products/boy-gold-plated-charm`,
  },
  {
    id: "jan",
    name: "January",
    kind: "stone",
    glyph: "1",
    shop: `${SHOP}/products/january-birthstone-clip-charm`,
  },
  {
    id: "feb",
    name: "February",
    kind: "stone",
    glyph: "2",
    shop: `${SHOP}/products/february-birthstone-clip-charm`,
  },
  {
    id: "mar",
    name: "March",
    kind: "stone",
    glyph: "3",
    shop: `${SHOP}/products/march-birthstone-clip-charm`,
  },
  {
    id: "apr",
    name: "April",
    kind: "stone",
    glyph: "4",
    shop: `${SHOP}/products/april-birthstone-clip-charm`,
  },
  {
    id: "may",
    name: "May",
    kind: "stone",
    glyph: "5",
    shop: `${SHOP}/products/may-birthstone-clip-charm`,
  },
  {
    id: "jun",
    name: "June",
    kind: "stone",
    glyph: "6",
    shop: `${SHOP}/products/june-birthstone-clip-charm`,
  },
  {
    id: "aries",
    name: "Aries",
    kind: "star",
    glyph: "♈",
    shop: `${SHOP}/products/aries-silver-charm`,
  },
  {
    id: "taurus",
    name: "Taurus",
    kind: "star",
    glyph: "♉",
    shop: `${SHOP}/products/taurus-silver-charm`,
  },
  {
    id: "gemini",
    name: "Gemini",
    kind: "star",
    glyph: "♊",
    shop: `${SHOP}/products/gemini-silver-charm`,
  },
  {
    id: "cancer",
    name: "Cancer",
    kind: "star",
    glyph: "♋",
    shop: `${SHOP}/collections/star-sign-charms`,
  },
  {
    id: "leo",
    name: "Leo",
    kind: "star",
    glyph: "♌",
    shop: `${SHOP}/collections/star-sign-charms`,
  },
  {
    id: "pisces",
    name: "Pisces",
    kind: "star",
    glyph: "♓",
    shop: `${SHOP}/collections/star-sign-charms`,
  },
];

export const chapters = [
  {
    num: "01",
    title: "The spark",
    body: "Natasha Collins made her first piece of jewellery at fifteen and never quite put the bench down. The work began as instinct — metal, story, a little fire.",
  },
  {
    num: "02",
    title: "Natasha G",
    body: "Before ORA, she designed as Natasha G Jewellery from Cape Town. Japanese form, handmade rings and pendants. A chapter of exploration that helped shape the work to come.",
  },
  {
    num: "03",
    title: "Saying no to no",
    body: "ORA was born from that refusal to wait for permission. Collectable, stackable jewellery designed to be worn every day and still mean something years later.",
  },
  {
    num: "04",
    title: "Here. Now. Always.",
    body: "ORA Jewellery, custom work, and the conversations that happen around building a business. Still making. Still learning. Still saying no to no.",
  },
];
