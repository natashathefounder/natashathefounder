export type Money = { amount: string; currencyCode: string };
export type Media = { url: string; altText: string | null; width: number; height: number };
export type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: { name: string; value: string }[];
  image: Media | null;
};
export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  vendor: string;
  availableForSale: boolean;
  featuredImage: Media | null;
  images: { nodes: Media[] };
  priceRange: { minVariantPrice: Money };
  seo: { title: string | null; description: string | null };
  options: { name: string; values: string[] }[];
  variants: { nodes: Variant[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
};
export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: Media | null;
};
export type PageInfo = { hasNextPage: boolean; endCursor: string | null };
export type Catalogue = {
  products: Product[];
  collections: Collection[];
  pageInfo: PageInfo;
  unavailable: boolean;
};
export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: {
    nodes: {
      id: string;
      quantity: number;
      cost: { totalAmount: Money };
      merchandise: Variant & { product: { title: string; handle: string } };
    }[];
    pageInfo: PageInfo;
  };
};
export const money = (m: Money) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: m.currencyCode }).format(
    Number(m.amount),
  );
export function imageUrl(url: string, width: number) {
  const u = new URL(url);
  if (u.hostname === "cdn.shopify.com") u.searchParams.set("width", String(width));
  return u.toString();
}
