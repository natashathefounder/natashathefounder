import { products, type Product } from "@/lib/products";
import { stackBaseHandles } from "@/lib/commerce/stack-selection";

const sliderPhoto =
  products.find((p) => p.id === "halo-snake-chain")?.image ||
  products.find((p) => p.category === "Necklaces")?.image ||
  "";

export const sliderBases: Product[] = [
  {
    id: "slider-brass-chain",
    name: "Slider chain — brass",
    category: "Necklaces",
    price: null,
    image: sliderPhoto,
  },
  {
    id: "slider-silver-chain",
    name: "Slider chain — silver",
    category: "Necklaces",
    price: null,
    image: sliderPhoto,
  },
  {
    id: "slider-9ct-gold-chain",
    name: "Slider chain — 9ct gold",
    category: "Necklaces",
    price: null,
    image: sliderPhoto,
  },
];

export const glideCharms = products.filter((p) => p.category === "Charms");

export const allowedBaseIds = new Set<string>(stackBaseHandles);
