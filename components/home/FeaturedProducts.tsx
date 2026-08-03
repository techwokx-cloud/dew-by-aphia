"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";
import { DewMotifDivider } from "@/components/ui/AnkaraMotif";
import { Reveal } from "@/components/ui/Reveal";
import { getAllProducts } from "@/lib/products-data";
import { getProductImage } from "@/lib/product-image";

const featured = getAllProducts()
  .filter((p) => p.featured)
  .slice(0, 4);

export function FeaturedProducts() {
  return (
    <section className="bg-primary/[0.03] py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="text-center max-w-xl mx-auto mb-14">
          <p className="eyebrow text-primary mb-3">New This Season</p>
          <h2 className="font-display text-3xl lg:text-4xl text-ink">Featured Pieces</h2>
          <DewMotifDivider className="w-28 h-3 mx-auto mt-4" tone="gold" />
        </Reveal>

        <Reveal delay={0.1} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p, i) => (
            <FeaturedCard key={p.id} product={p} variant={i} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function FeaturedCard({
  product,
  variant,
}: {
  product: ReturnType<typeof getAllProducts>[number];
  variant: number;
}) {
  const [wishlisted, setWishlisted] = useState(false);
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] rounded-[var(--radius)] border border-line overflow-hidden">
        <Image
          src={getProductImage(product, variant)}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            setWishlisted((v) => !v);
          }}
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
        >
          <Heart size={15} strokeWidth={1.6} className={wishlisted ? "fill-primary text-primary" : ""} />
        </button>
      </div>
      <div className="mt-3">
        <p className="text-ink font-medium text-sm">{product.name}</p>
        <p className="text-ink-soft text-sm">${product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}
