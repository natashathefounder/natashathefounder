export type Product = {
  id: string;
  name: string;
  category: string;
  price: number | null;
  image: string;
};

export const SHOP_ORIGIN = "https://orajewellery.com";

export const products: Product[] = [
  { id: "deco-white-gold-plated-hoops-copy", name: "Deco Green Gold Plated Hoops", category: "Earrings", price: 650.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/20_24832f1e-1e44-4311-bfc3-1991c5559bd0.png?v=1783427247" },
  { id: "glitter-gold-plated-hoops", name: "Glitter Gold Plated Hoops", category: "Earrings", price: 650.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/ClipCharmsonchain_33.png?v=1783436231" },
  { id: "deco-gold-plated-hoops-copy", name: "Rio Gold Plated Hoops", category: "Earrings", price: 650.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/ClipCharmsonchain_30.png?v=1783429378" },
  { id: "deco-gold-plated-hoops", name: "Deco White Gold Plated Hoops", category: "Earrings", price: 650.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/ClipCharmsonchain_29.png?v=1783428363" },
  { id: "deco-hoops-gold-plated-hoops", name: "Fiesta Gold Plated Hoops", category: "Earrings", price: 650.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/ClipCharmsonchain_28.png?v=1783427711" },
  { id: "orbit-gold-plated-hoops", name: "Orbit Gold Plated Hoops", category: "Earrings", price: 650.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/18_2b010f79-7d57-4d81-b896-b6fc01fc93ce.png?v=1783426692" },
  { id: "gemstone-cross-gold-plated-hoops", name: "Gemstone Cross Gold Plated Hoops", category: "Earrings", price: 650.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/ClipCharmsonchain_27.png?v=1783356931" },
  { id: "palette-gold-plated-hoops", name: "Palette Gold Plated Hoops", category: "Earrings", price: 650.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/ClipCharmsonchain_26.png?v=1783356981" },
  { id: "crush-gold-plated-hoops", name: "Crush Gold Plated Hoops", category: "Earrings", price: 650.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/16_e4eec414-adfe-4ca8-839f-299233135ca2.png?v=1783357000" },
  { id: "kaleido-gold-plated-hoops", name: "Kaleido Gold Plated Hoops", category: "Earrings", price: 650.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/17_484ec44e-6a56-445b-a2c8-e880a69ed2e2.png?v=1783419801" },
  { id: "link-gold-plated-hoops", name: "Link Gold Plated Hoops", category: "Earrings", price: 495.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/ClipCharmsonchain_15.png?v=1780489468" },
  { id: "classic-fingerprint-signet-ring", name: "Classic Fingerprint Signet Ring", category: "Rings", price: 4700.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/1_5fdb66a0-ce41-41c1-a23d-84a9cc5c1f2a.png?v=1778253309" },
  { id: "finger-print-signet-ring", name: "Fingerprint Signet Ring", category: "Rings", price: 4500.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/ClipCharmsonchain_13.png?v=1778251519" },
  { id: "mini-birthstone-signet-ring", name: "Mini Birthstone Signet Ring", category: "Rings", price: 1950.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/CustomMiniSignetDesign_1d767d99-4add-4bfc-838e-f574ff0252ea.png?v=1777550284" },
  { id: "mosaic-bracelet", name: "Mosaic Bracelet", category: "Bracelets", price: 850.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/JewelryBrandPhotographyShoot_25.jpg?v=1776776111" },
  { id: "tennis-bracelet", name: "Tennis Bracelet", category: "Bracelets", price: 945.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/JewelryBrandPhotographyShoot_24.jpg?v=1776775080" },
  { id: "motion-bracelet-chain", name: "Motion Bracelet Chain", category: "Bracelets", price: 795.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/JewelryBrandPhotographyShoot_6.png?v=1776683971" },
  { id: "bone-bracelet-chain", name: "Bone Bracelet Chain", category: "Bracelets", price: 595.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/Professionalbraceletmacroshot-3.jpg?v=1775646097" },
  { id: "ace-of-hearts-gold-plated-charm", name: "Ace of Hearts Gold Plated Charm", category: "Charms", price: 695.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/7_964cab5a-dd97-46f6-8abb-6fabe8025e72.png?v=1772541585" },
  { id: "eiffel-tower-gold-plated-charm", name: "Eiffel Tower Gold Plated Charm", category: "Charms", price: 695.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/23_07d6948a-b015-4edc-9a52-76a508c23c03.png?v=1772629723" },
  { id: "croissant-gold-plated-charm", name: "Croissant Gold Plated Charm", category: "Charms", price: 695.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/17_bce3d38b-e981-425d-91e4-bc13c4342400.png?v=1772537356" },
  { id: "teddy-gold-plated-charm", name: "Teddy Gold Plated Charm", category: "Charms", price: 695.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/11_adcecdf4-d274-4ea3-99b9-346eac49a509.png?v=1772547447" },
  { id: "girl-gold-plated-charm", name: "Girl Birthstone Gold Plated Charm", category: "Charms", price: 795.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/49_563db8ca-d132-430a-a579-42a4f9639bb0.png?v=1772531042" },
  { id: "boy-gold-plated-charm", name: "Boy Birthstone Gold Plated Charm", category: "Charms", price: 795.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/16_33b80e65-8476-43b7-9249-1f573300628a.png?v=1772531107" },
  { id: "halo-snake-chain", name: "Bone Chain", category: "Necklaces", price: 695.0, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/ClipCharmsonchain_20.png?v=1783094631" },
  { id: "slider-brass-chain", name: "Slider Gold Plated Chain", category: "Necklaces", price: null, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/NG-06710_3878b378-e7ef-4036-8389-f51cebd998cd.jpg?v=1707748235" },
  { id: "slider-silver-chain", name: "Slider Silver Chain", category: "Necklaces", price: null, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/NG-06710b.jpg?v=1756370800" },
  { id: "slider-9ct-gold-chain", name: "Slider 9ct Gold Chain", category: "Necklaces", price: null, image: "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/NG-06710_3878b378-e7ef-4036-8389-f51cebd998cd.jpg?v=1707748235" },
];

export function productUrl(id: string) {
  return `${SHOP_ORIGIN}/products/${id}`;
}

export const productCategories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
