import { GitCompareArrows, Plus, ShoppingBag, X } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState, PageHero, Rating } from "@/components/common/ui";
import { getBrand } from "@/data/brands";
import { getProduct, products } from "@/data/products";
import { useDocumentTitle } from "@/hooks";
import { toast, useStore } from "@/store/useStore";
import { inr } from "@/utils/format";

export default function ComparePage() {
  useDocumentTitle("Compare Jewelry");
  const ids = useStore((s) => s.compare);
  const toggle = useStore((s) => s.toggleCompare);
  const clear = useStore((s) => s.clearCompare);
  const addToCart = useStore((s) => s.addToCart);
  const items = ids.map((i) => getProduct(i)!).filter(Boolean);
  const minPrice = Math.min(...items.map((p) => p.price));
  const maxRating = Math.max(...items.map((p) => p.rating));
  const rows: [string, (p: (typeof items)[number]) => React.ReactNode][] = [
    ["Brand", (p) => getBrand(p.brandSlug)?.name],
    ["Price", (p) => <span className={p.price === minPrice && items.length > 1 ? "font-semibold text-emerald-700" : "font-semibold"}>{inr(p.price)}{p.price === minPrice && items.length > 1 && " · best price"}</span>],
    ["Rating", (p) => <span className={p.rating === maxRating && items.length > 1 ? "rounded bg-champagne px-1" : ""}><Rating value={p.rating} count={p.reviewCount} size={12} /></span>],
    ["Type", (p) => p.type], ["Category", (p) => p.category], ["Metal", (p) => p.metal], ["Purity", (p) => p.purity], ["Weight", (p) => `${p.weight} g`], ["Stone", (p) => p.stone], ["Craft", (p) => p.craft], ["Occasion", (p) => p.occasion],
    ["Availability", (p) => (p.inStock ? <span className="text-emerald-700">In stock</span> : <span className="text-burgundy">Sold out</span>)],
  ];
  return (
    <>
      <PageHero eyebrow="Jewelry Comparison" title="Compare Side by Side" sub="Add up to four pieces from anywhere on SHRIING and compare price, purity, weight and craft." image="https://images.pexels.com/photos/12427696/pexels-photo-12427696.jpeg?auto=compress&cs=tinysrgb&w=1400" />
      <div className="container-x py-12">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <select className="input w-72" value="" onChange={(e) => { if (e.target.value) { const ok = toggle(e.target.value); if (!ok) toast("Maximum 4 items"); } }} aria-label="Add a product"><option value="">+ Add a product to compare…</option>{products.filter((p) => !ids.includes(p.id)).map((p) => (<option key={p.id} value={p.id}>{p.name} — {getBrand(p.brandSlug)?.name}</option>))}</select>
          {items.length > 0 && <button onClick={clear} className="btn btn-ghost btn-sm">Clear all</button>}
        </div>
        {items.length === 0 ? <EmptyState icon={<GitCompareArrows size={36} />} title="Nothing to compare yet" text="Use the compare icon on any product card, or add a product above." action={<Link to="/shop" className="btn btn-primary">Browse jewelry</Link>} /> : (
          <div className="overflow-x-auto rounded-md border border-sand bg-white shadow-soft">
            <table className="w-full min-w-[720px] text-sm">
              <thead><tr><th className="w-40 p-4" />{items.map((p) => (<th key={p.id} className="relative min-w-52 p-4 text-left align-top font-normal"><button onClick={() => toggle(p.id)} aria-label="Remove" className="absolute top-2 right-2 rounded-full bg-champagne p-1"><X size={14} /></button><img src={p.images[0]} alt={p.name} className="aspect-square w-full rounded-sm object-cover" /><Link to={`/product/${p.id}`} className="mt-3 block font-serif text-xl leading-tight text-burgundy-dark hover:text-burgundy">{p.name}</Link></th>))}{items.length < 4 && <th className="p-4 align-middle"><Plus className="mx-auto text-sand" size={32} /></th>}</tr></thead>
              <tbody>{rows.map(([l, f]) => (<tr key={l} className="border-t border-sand/70"><th className="bg-champagne/40 px-4 py-3 text-left text-[11px] font-semibold tracking-wider text-muted uppercase">{l}</th>{items.map((p) => (<td key={p.id} className="px-4 py-3">{f(p)}</td>))}{items.length < 4 && <td />}</tr>))}
                <tr className="border-t border-sand/70"><th className="bg-champagne/40" />{items.map((p) => (<td key={p.id} className="p-4"><button disabled={!p.inStock} onClick={() => { addToCart({ kind: "product", productId: p.id, name: p.name, brand: getBrand(p.brandSlug)?.name ?? "", image: p.images[0], price: p.price }); toast("Added to cart"); }} className="btn btn-primary btn-sm w-full"><ShoppingBag size={14} /> Add to cart</button></td>))}{items.length < 4 && <td />}</tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
