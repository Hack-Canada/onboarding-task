/** Beaver / voyage mascot asset keys — rendered as inline SVG (transparent) */
export const BEAVER_ASSET_KEYS = ['boat', 'mascot', 'lighthouse'] as const;

export type BeaverAssetKey = (typeof BEAVER_ASSET_KEYS)[number];
