import type { CollectionSlug } from "@/lib/types";

export interface CollectionInfo {
  slug: CollectionSlug;
  name: string;
  tagline: string;
  images: [string, string];
}

export const COLLECTIONS: CollectionInfo[] = [
  {
    slug: "executive-wear",
    name: "Executive Wear",
    tagline: "Power. Presence. Purpose.",
    images: ["/collections/executive-1.avif", "/collections/executive-2.avif"],
  },
  {
    slug: "evening-wear",
    name: "Evening Wear",
    tagline: "Elegance for every special moment.",
    images: ["/collections/evening-1.avif", "/collections/evening-2.avif"],
  },
  {
    slug: "bridal",
    name: "Bridal",
    tagline: "Timeless beauty for your forever.",
    images: ["/collections/bridal-1.avif", "/collections/bridal-2.avif"],
  },
  {
    slug: "corporate-chic",
    name: "Corporate Chic",
    tagline: "Refined style for the modern career woman.",
    images: ["/collections/corporate-chic-1.avif", "/collections/corporate-chic-2.avif"],
  },
  {
    slug: "accessories",
    name: "Accessories",
    tagline: "The perfect finishing touch.",
    images: ["/collections/accessories-1.avif", "/collections/accessories-2.avif"],
  },
];

export const HERO_IMAGES = ["/collections/hero-1.avif", "/collections/hero-2.avif"];
