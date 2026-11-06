import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { getBrand } from "@/data/brands";
import { toast, useStore } from "@/store/useStore";
import type { Look } from "@/utils/stylist";
import { inr } from "@/utils/format";

export function LookCard({ look, budget }: { look: Look; budget?: number }) {
  const addToCart = useStore((s) => s.addToCart);
  const addAll = () => {
    look.pieces.forEach(({ product: p }) => addToCart({ kind: "product", productId: p.id, name: p.name, brand: getBrand(p.brandSlug)?.name ?? "", image: p.images[0], price: p.price, meta: ["Styled look"] }));
    toast(`${look.title} added to cart`);
  };
  return (
    <div className="card overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-sand bg-champagne/50 p-5">
        <div><p className="eyebrow">Curated look</p><h3 className="mt-1 font-serif text-3xl text-burgundy-dark">{look.title}</h3><p className="mt-1 max-w-md text-sm text-muted">{look.note}</p></div>
        <div className="text-right"><p className="font-serif text-3xl text-burgundy">{inr(look.total)}</p>{budget ? <p className={`text-xs ${look.total <= budget ? "text-emerald-700" : "text-amber-700"}`}>{look.total <= budget ? "Within budget" : `₹${Math.round((look.total - budget) / 1000)}K over`}</p> : null}</div>
      </div>
      <div className="grid grid-cols-2 gap-px bg-sand md:grid-cols-4">
        {look.pieces.map(({ role, product: p }) => (
          <Link key={role} to={`/product/${p.id}`} className="group bg-white p-3">
            <div className="aspect-square overflow-hidden rounded-sm bg-champagne"><img src={p.images[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
            <p className="mt-3 text-[10px] font-semibold tracking-widest text-gold-dark uppercase">{role}</p>
            <p className="font-serif text-lg leading-tight text-burgundy-dark">{p.name}</p>
            <p className="mt-0.5 text-sm">{inr(p.price)}</p>
          </Link>
        ))}
      </div>
      <div className="p-4"><button onClick={addAll} className="btn btn-primary w-full"><ShoppingBag size={16} /> Add entire look to cart</button></div>
    </div>
  );
}
