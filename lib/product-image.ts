import type { Product } from "./types";
import { COLLECTIONS } from "./collections-data";

/**
 * Until per-product photography exists, every product is represented by a
 * real photo from its category's editorial set (not a placeholder gradient).
 * This is intentionally NOT a claim that the photo shows the exact garment —
 * swap in real product photography per SKU before this goes live for sale.
 */
export function getProductImage(product: Pick<Product, "category" | "id">, variant = 0): string {
  const collection = COLLECTIONS.find((c) => c.slug === product.category);
  if (!collection) return "/collections/hero-1.avif";
  return collection.images[variant % collection.images.length];
}

export function getProductImages(product: Pick<Product, "category" | "id">): [string, string] {
  const collection = COLLECTIONS.find((c) => c.slug === product.category);
  return collection ? collection.images : ["/collections/hero-1.avif", "/collections/hero-2.avif"];
}
