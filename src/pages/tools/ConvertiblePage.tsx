import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/common/ui";
import { getBrand } from "@/data/brands";
import { IMG } from "@/data/images";
import { products } from "@/data/products";
import { useDocumentTitle } from "@/hooks";
import { toast, useStore } from "@/store/useStore";
import { inr } from "@/utils/format";
import { cn } from "@/utils/cn";

const ways = [
  { id: "necklace", label: "Statement necklace", pos: [[50, 76]], steps: "Clip the pendant onto the chain and fasten at the nape." },
  { id: "tikka", label: "Maang tikka", pos: [[50, 20]], steps: "Detach the pendant, attach the hook-and-chain and place along the parting." },
  { id: "earrings", label: "Drop earrings", pos: [[26, 52], [74, 52]], steps: "Split the pendant into two modules and snap on ear hooks." },
  { id: "hair", label: "Hair accessory", pos: [[70, 18]], steps: "Slide the pendant onto the hair-comb adapter and pin behind the bun." },
  { id: "brooch", label: "Saree brooch", pos: [[32, 88]], steps: "Attach the pin-back to the pendant and fix at the pallu." },
];

export default function ConvertiblePage() {
  useDocumentTitle("Convertible Jewelry");
  const list = products.filter((p) => p.convertible);
  const [pid, setPid] = useState(list[0].id);
  const [w, setW] = useState(0);
  const p = list.find((x) => x.id === pid)!;
  const way = ways[w];
  const addToCart = useStore((s) => s.addToCart);
  return (
    <>
      <PageHero eyebrow="Convertible Jewelry" title="One Jewel. Five Ways to Wear." sub="Detach, reattach and restyle — Zariya's modular designs move from mandap to meeting room." image={IMG.heroAlt} />
      <div className="container-x py-12">
        <div className="no-scrollbar mb-8 flex gap-3 overflow-x-auto">{list.map((x) => (<button key={x.id} onClick={() => setPid(x.id)} className={cn("flex shrink-0 items-center gap-3 rounded-md border p-2 pr-4 text-left", pid === x.id ? "border-burgundy bg-white shadow-soft" : "border-sand")}><img src={x.images[0]} alt="" className="h-14 w-14 rounded-sm object-cover" /><span><span className="block text-[10px] tracking-widest text-gold-dark uppercase">{getBrand(x.brandSlug)?.name}</span><span className="block font-serif text-lg leading-tight">{x.name}</span></span></button>))}</div>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-md shadow-lift">
            <img src={IMG.portrait} alt="Model" className="h-full w-full object-cover" />
            {way.pos.map(([x, y], i) => (<div key={way.id + i} className="absolute" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}><span className="absolute inset-0 -m-3 animate-ping rounded-full bg-gold/60" /><img src={p.images[0]} alt="" className={cn("relative border-2 border-gold object-cover shadow-lift", way.id === "necklace" ? "h-20 w-32 rounded-md" : "h-14 w-14 rounded-full")} /></div>))}
            <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">Way {w + 1}: {way.label}</span>
          </div>
          <div>
            <p className="eyebrow">{getBrand(p.brandSlug)?.name}</p><h2 className="mt-2 font-serif text-4xl text-burgundy-dark">{p.name}</h2><p className="mt-1 text-xl font-semibold">{inr(p.price)}</p>
            <div className="mt-6 space-y-3">{ways.map((x, i) => (<button key={x.id} onClick={() => setW(i)} className={cn("flex w-full items-start gap-4 rounded-md border p-4 text-left transition", w === i ? "border-burgundy bg-white shadow-soft" : "border-sand hover:border-gold")}><span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-serif text-xl", w === i ? "bg-burgundy text-gold-light" : "bg-champagne text-gold-dark")}>{i + 1}</span><span><span className="block font-serif text-xl text-burgundy-dark">{x.label}</span>{w === i && <span className="mt-1 block text-sm text-muted">{x.steps}</span>}</span></button>))}</div>
            <div className="mt-8 flex flex-wrap gap-3"><button onClick={() => { addToCart({ kind: "product", productId: p.id, name: p.name, brand: getBrand(p.brandSlug)?.name ?? "", image: p.images[0], price: p.price }); toast("Added to cart"); }} className="btn btn-primary"><ShoppingBag size={15} /> Add to cart</button><Link to={`/product/${p.id}`} className="btn btn-outline">View product</Link><Link to="/brands/zariya" className="btn btn-ghost">Visit Zariya</Link></div>
          </div>
        </div>
      </div>
    </>
  );
}
