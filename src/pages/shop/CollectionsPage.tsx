import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero, Reveal } from "@/components/common/ui";
import { ProductCard } from "@/components/product/ProductCard";
import { collections } from "@/data/collections";
import { IMG } from "@/data/images";
import { products } from "@/data/products";
import { useDocumentTitle } from "@/hooks";
import type { Product } from "@/types";

const rule: Record<string, (p: Product) => boolean> = {
  "wedding-edit": (p) => p.occasion === "Wedding" || p.occasion === "Bridal",
  "festive-glow": (p) => p.occasion === "Festive",
  "everyday-luxe": (p) => p.occasion === "Daily Wear",
  "gemstone-stories": (p) => p.category === "Gemstone",
  engagement: (p) => p.occasion === "Engagement",
  "party-after-dark": (p) => p.occasion === "Party",
};

export default function CollectionsPage() {
  useDocumentTitle("Collections");
  return (
    <>
      <PageHero eyebrow="Collections" title="Curated for Every Chapter" sub="Editorial edits from across our 20 brands — for weddings, festivals, evenings and everyday." image={IMG.set} />
      <div className="container-x space-y-24 py-16 md:py-24">
        {collections.map((c, i) => {
          const items = products.filter(rule[c.id]).slice(0, 4);
          return (
            <section key={c.id} id={c.id}>
              <Reveal>
                <div className={`grid items-center gap-8 lg:grid-cols-[1fr_1.4fr] ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                  <div className="relative aspect-[5/4] overflow-hidden rounded-md"><img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover" /><span className="absolute top-4 left-4 rounded-sm bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-widest text-burgundy uppercase">{c.tag}</span></div>
                  <div><p className="eyebrow">Collection 0{i + 1}</p><h2 className="mt-2 font-serif text-5xl text-burgundy-dark">{c.name}</h2><p className="mt-3 max-w-md text-muted">{c.blurb}</p><Link to={c.to} className="btn btn-outline mt-6">Shop the collection <ArrowRight size={16} /></Link></div>
                </div>
              </Reveal>
              <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">{items.map((p, k) => (<ProductCard key={p.id} p={p} index={k} compact />))}</div>
            </section>
          );
        })}
      </div>
    </>
  );
}
