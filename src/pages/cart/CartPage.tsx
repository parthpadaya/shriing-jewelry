import { Minus, Plus, ShoppingBag, Tag, Trash2, Truck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/common/ui";
import { useDocumentTitle } from "@/hooks";
import { toast, useStore } from "@/store/useStore";
import { computeTotals, coupons } from "@/utils/cart";
import { addDays, fmtLong, inr } from "@/utils/format";

export function Summary({ showCoupon = true }: { showCoupon?: boolean }) {
  const cart = useStore((s) => s.cart);
  const coupon = useStore((s) => s.coupon);
  const setCoupon = useStore((s) => s.setCoupon);
  const [code, setCode] = useState("");
  const t = computeTotals(cart, coupon);
  const hasCustom = cart.some((c) => c.kind !== "product");
  const apply = (e: React.FormEvent) => {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    const def = coupons[c];
    if (!def) return toast("Invalid coupon code");
    if (t.subtotal < def.min) return toast(`Add items worth ${inr(def.min)} to use ${c}`);
    setCoupon(c); setCode(""); toast(`${c} applied — ${def.label}`);
  };
  return (
    <div className="card p-6">
      <h2 className="font-serif text-3xl text-burgundy-dark">Order summary</h2>
      {showCoupon && (
        <div className="mt-5">
          {coupon ? <div className="flex items-center justify-between rounded-sm bg-emerald-50 px-3 py-2 text-sm text-emerald-800"><span className="flex items-center gap-2"><Tag size={14} /> {coupon} applied</span><button onClick={() => setCoupon(null)} className="text-xs underline">Remove</button></div> : (
            <form onSubmit={apply} className="flex gap-2"><input className="input" placeholder="Coupon code (try SHRI10)" value={code} onChange={(e) => setCode(e.target.value)} aria-label="Coupon code" /><button className="btn btn-outline btn-sm">Apply</button></form>
          )}
        </div>
      )}
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{inr(t.subtotal)}</dd></div>
        {t.discount > 0 && <div className="flex justify-between text-emerald-700"><dt>Coupon discount</dt><dd>− {inr(t.discount)}</dd></div>}
        <div className="flex justify-between"><dt className="text-muted">Estimated GST (3%)</dt><dd>{inr(t.gst)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">Insured shipping</dt><dd>{t.shipping ? inr(t.shipping) : "Free"}</dd></div>
        <div className="flex justify-between border-t border-sand pt-4 font-serif text-3xl text-burgundy-dark"><dt>Total</dt><dd>{inr(t.total)}</dd></div>
      </dl>
      <div className="mt-5 flex items-start gap-3 rounded-sm bg-champagne/70 p-3 text-xs text-muted"><Truck size={16} className="mt-0.5 shrink-0 text-gold-dark" /><p>Estimated delivery by <b className="text-ink">{fmtLong(addDays(hasCustom ? 18 : 5))}</b>. {hasCustom ? "Custom pieces include progress photos from the workshop." : "Insured, tamper-proof packaging."}</p></div>
    </div>
  );
}

export default function CartPage() {
  useDocumentTitle("Your Cart");
  const cart = useStore((s) => s.cart);
  const updateQty = useStore((s) => s.updateQty);
  const remove = useStore((s) => s.removeFromCart);
  if (!cart.length)
    return <div className="container-x py-24"><EmptyState icon={<ShoppingBag size={40} strokeWidth={1.2} />} title="Your cart is empty" text="Discover heritage brands or design something of your own." action={<div className="flex gap-3"><Link to="/shop" className="btn btn-primary">Shop jewelry</Link><Link to="/customize" className="btn btn-outline">Customize</Link></div>} /></div>;
  return (
    <div className="container-x py-8 sm:py-10 md:py-14">
      <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl text-burgundy-dark">Shopping Cart <span className="text-lg sm:text-2xl text-muted">({cart.reduce((a, c) => a + c.qty, 0)} items)</span></h1>
      <div className="mt-8 sm:mt-10 grid gap-8 lg:gap-10 lg:grid-cols-[1fr_400px]">
        <ul className="space-y-4">
          {cart.map((c) => (
            <li key={c.id} className="card flex gap-3 sm:gap-6 p-3.5 sm:p-5">
              <img src={c.image} alt={c.name} className="h-20 w-20 sm:h-32 sm:w-32 shrink-0 rounded-sm object-cover" />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-[11px] font-semibold tracking-widest text-gold-dark uppercase truncate">{c.brand}{c.kind !== "product" && ` · ${c.kind === "custom" ? "Custom design" : c.kind === "bridal" ? "Bridal" : "Gift"}`}</p>
                    {c.productId ? <Link to={`/product/${c.productId}`} className="font-serif text-base sm:text-xl md:text-2xl leading-snug sm:leading-tight text-burgundy-dark hover:text-burgundy line-clamp-2">{c.name}</Link> : <p className="font-serif text-base sm:text-xl md:text-2xl leading-snug sm:leading-tight text-burgundy-dark line-clamp-2">{c.name}</p>}
                  </div>
                  <p className="font-serif text-lg sm:text-2xl font-bold sm:font-normal whitespace-nowrap text-burgundy-dark mt-1 sm:mt-0">{inr(c.price * c.qty)}</p>
                </div>
                {(c.size || c.meta?.length) && <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] sm:text-xs text-muted">{c.size && <li>Size: {c.size}</li>}{c.meta?.slice(0, 5).map((m) => (<li key={m}>{m}</li>))}</ul>}
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="inline-flex items-center rounded-sm border border-sand"><button onClick={() => updateQty(c.id, -1)} aria-label="Decrease" className="p-1.5 sm:p-2 hover:bg-champagne"><Minus size={13} /></button><span className="w-7 sm:w-8 text-center text-xs sm:text-sm">{c.qty}</span><button onClick={() => updateQty(c.id, 1)} aria-label="Increase" className="p-1.5 sm:p-2 hover:bg-champagne"><Plus size={13} /></button></div>
                  <button onClick={() => { remove(c.id); toast("Removed from cart"); }} className="flex items-center gap-1.5 text-xs text-muted hover:text-red-700"><Trash2 size={13} /> Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start"><Summary /><Link to="/checkout" className="btn btn-primary w-full py-4">Proceed to checkout</Link><Link to="/shop" className="btn btn-ghost w-full">Continue shopping</Link></div>
      </div>
    </div>
  );
}
