// Product handles curated on ORA’s original Glide & Stack page, reviewed 2026-09-16.
// Source: https://orajewellery.com/pages/build-your-charm-stack
// Other connection systems and products requiring engraving instructions are excluded.
export const stackHandles = [
  "slider-brass-chain",
  "slider-silver-chain",
  "slider-9ct-gold-chain",
  "birthstone-brass-charm",
  "letter-silver-charms",
  "birthstone-silver-charms-1",
  "girl-gold-plated-charm",
  "girl-silver-charm",
  "number-charms",
  "number-silver-charms",
  "heart-charm",
  "heart-silver-charm",
  "star-brass-charm",
  "africa-charm",
  "africa-silver-charm",
  "moon-brass-charm",
  "dog-paw-gold-plated-charm",
  "evil-eye-brass-charm",
] as const;
export const stackBaseHandles = stackHandles.slice(0, 3);
