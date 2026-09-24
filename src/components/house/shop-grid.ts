/**
 * Product listing grid shared by /shop, category shelves, and homepage rails.
 *
 * Kept out of the client card module: Server Components cannot read non-component
 * exports from a "use client" file, and interpolating that client reference into
 * className drops the grid classes (tiles then stack full width).
 *
 * Phones stay two-up. Tablets step to three, desktops to four, wide screens to five.
 */
export const shopTileGrid =
  "grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
