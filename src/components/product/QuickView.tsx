import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "@/components/common/Modal";
import { Rating } from "@/components/common/ui";
import { getBrand } from "@/data/brands";
import { getProduct } from "@/data/products";
import { toast, useStore, useUI } from "@/store/useStore";
import { inr } from "@/utils/format";
import { cn } from "@/utils/cn";

export function QuickViewHost() {
  const id = useUI((s) => s.quickView);
  const setQuickView = useUI((s) => s.setQuickView);
  const p = getProduct(id ?? undefined);
  const [img, setImg] = useState(0);
  const addToCart = useStore((s) => s.addToCart);
  const wished = useStore((s) => (p ? s.wishlist.includes(p.id) : false));
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const brand = getBrand(p?.brandSlug);
  return (
    <Modal open={!!p} onClose={() => { setQuickView(null); setImg(0); }} wide>
      {p && (
        <div className="grid md:grid-cols-2">
          <div className="bg-champagne p-4">
            <img src={p.images[img]} alt={p.name} className="aspect-square w-full rounded-md object-cover" />
            <div className="mt-3 flex gap-2">
              {p.images.map((im, i) => (
                <button key={i} onClick={() => setImg(i)} className={cn("h-16 w-16 overflow-hidden rounded-sm border-2", i === img ? "border-burgundy" : "border-transparent")}>
                  <img src={im} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col p-6 md:p-8">
            <p className="eyebrow">{brand?.name}</p>
            <h2 className="mt-2 font-serif text-3xl text-burgundy-dark">{p.name}</h2>
            <div className="mt-2"><Rating value={p.rating} count={p.reviewCount} /></div>
            <p className="mt-4 text-3xl font-semibold text-ink">{inr(p.price)}</p>
            <p className="mt-0.5 text-xs text-muted">Inclusive of making charges · GST extra at checkout</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{p.description}</p>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              {[["Metal", `${p.purity} ${p.metal}`], ["Weight", `${p.weight} g`], ["Stone", p.stone], ["Craft", p.craft]].map(([k, v]) => (
                <div key={k} className="rounded-sm bg-champagne/60 p-3"><dt className="text-[10px] tracking-wider text-muted uppercase">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <button disabled={!p.inStock} className="btn btn-primary flex-1" onClick={() => { addToCart({ kind: "product", productId: p.id, name: p.name, brand: brand?.name ?? "", image: p.images[0], price: p.price }); toast("Added to cart"); setQuickView(null); }}>
                <ShoppingBag size={16} /> {p.inStock ? "Add to cart" : "Sold out"}
              </button>
              <button onClick={() => toggleWishlist(p.id)} aria-label="Wishlist" className="btn btn-outline"><Heart size={16} className={wished ? "fill-burgundy" : ""} /></button>
              <Link to={`/product/${p.id}`} onClick={() => setQuickView(null)} className="btn btn-ghost w-full">View full details →</Link>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
