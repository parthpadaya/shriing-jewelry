import { BadgeCheck, GitCompareArrows, Heart, MapPin, Palette, Play, RotateCcw, Share2, ShieldCheck, ShoppingBag, Truck, ZoomIn } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EmptyState, Rating, SectionHeading } from "@/components/common/ui";
import { customizeKindFor, ProductCard } from "@/components/product/ProductCard";
import { getBrand } from "@/data/brands";
import { VIDEO } from "@/data/images";
import { getProduct, similarProducts } from "@/data/products";
import { getReviews } from "@/data/reviews";
import { useDocumentTitle } from "@/hooks";
import { toast, useStore } from "@/store/useStore";
import type { Review } from "@/types";
import { addDays, copyText, fmtDate, fmtLong, inr } from "@/utils/format";
import { cn } from "@/utils/cn";

const sizesFor = (t: string) =>
  t === "Ring" ? Array.from({ length: 12 }, (_, i) => String(10 + i)) : t === "Bangle" ? ["2.2", "2.4", "2.6", "2.8"] : t === "Bracelet" ? ['6.0"', '6.5"', '7.0"', '7.5"'] : t === "Necklace" || t === "Pendant" ? ['16"', '18"', '20"', '24"'] : [];

export default function ProductPage() {
  const { id } = useParams();
  const p = getProduct(id);
  useDocumentTitle(p?.name ?? "Product");
  const nav = useNavigate();
  const [img, setImg] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [size, setSize] = useState("");
  const [tone, setTone] = useState("Yellow");
  const [engraving, setEngraving] = useState("");
  const [pin, setPin] = useState("");
  const [eta, setEta] = useState<Date | null>(null);
  const [extra, setExtra] = useState<Review[]>([]);
  const [rv, setRv] = useState({ name: "", rating: 5, text: "" });
  const [tab, setTab] = useState<"details" | "breakup" | "reviews">("details");
  const addToCart = useStore((s) => s.addToCart);
  const wished = useStore((s) => (p ? s.wishlist.includes(p.id) : false));
  const compared = useStore((s) => (p ? s.compare.includes(p.id) : false));
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const toggleCompare = useStore((s) => s.toggleCompare);
  const pushRecent = useStore((s) => s.pushRecent);
  const brand = getBrand(p?.brandSlug);
  const reviews = useMemo(() => (p ? [...extra, ...getReviews(p.id, 5)] : []), [p, extra]);

  useEffect(() => { if (p) { pushRecent(p.id); setImg(0); setSize(sizesFor(p.type)[2] ?? ""); } }, [p, pushRecent]);

  if (!p) return <div className="container-x py-24"><EmptyState title="Product not found" action={<Link to="/shop" className="btn btn-primary">Back to shop</Link>} /></div>;

  const sizes = sizesFor(p.type);
  const price = p.price + (tone === "White" ? 1500 : 0) + (engraving ? 450 : 0);
  const base = p.price / 1.03;
  const hasStone = p.stone !== "None";
  const metalVal = base * (hasStone ? 0.55 : p.category === "Silver" || p.category === "Fashion" ? 0.6 : 0.78);
  const stoneVal = hasStone ? base * 0.25 : 0;
  const making = base - metalVal - stoneVal;
  const gst = p.price - base;
  const sim = similarProducts(p, 4);
  const meta = [`Tone: ${tone}`, ...(engraving ? [`Engraving: ${engraving}`] : [])];
  const add = () => { if (sizes.length && !size) { toast("Please select a size"); return false; } addToCart({ kind: "product", productId: p.id, name: p.name, brand: brand?.name ?? "", image: p.images[0], price, size, meta }); toast("Added to cart"); return true; };
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;

  const ways = ["Classic necklace", "Detached maang tikka", "Statement earrings", "Hair accessory", "Brooch / saree pin"];

  return (
    <div className="container-x py-8 md:py-12">
      <nav className="mb-6 text-xs text-muted" aria-label="Breadcrumb"><Link to="/" className="hover:text-burgundy">Home</Link> / <Link to="/shop" className="hover:text-burgundy">Shop</Link> / <Link to={`/brands/${p.brandSlug}`} className="hover:text-burgundy">{brand?.name}</Link> / <span className="text-ink">{p.name}</span></nav>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-md bg-champagne"
            onMouseMove={(e) => { if (img === 4) return; const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
            onMouseLeave={() => setZoom(null)}>
            {img === 4 ? (
              <video src={VIDEO.src} poster={VIDEO.poster} controls autoPlay muted loop playsInline className="h-full w-full object-cover" />
            ) : (
              <img src={p.images[img]} alt={p.name} className="h-full w-full object-cover transition-transform duration-200" style={zoom ? { transform: "scale(2.2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
            )}
            {img !== 4 && <span className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] text-muted"><ZoomIn size={13} /> Hover to zoom</span>}
          </div>
          <div className="mt-3 flex gap-3">
            {p.images.map((im, i) => (<button key={i} onClick={() => setImg(i)} className={cn("h-20 w-20 overflow-hidden rounded-sm border-2 transition", img === i ? "border-burgundy" : "border-transparent opacity-70 hover:opacity-100")} aria-label={`Image ${i + 1}`}><img src={im} alt="" className="h-full w-full object-cover" /></button>))}
            <button onClick={() => setImg(4)} className={cn("relative h-20 w-20 overflow-hidden rounded-sm border-2", img === 4 ? "border-burgundy" : "border-transparent opacity-80")} aria-label="Product video"><img src={VIDEO.poster} alt="" className="h-full w-full object-cover" /><span className="absolute inset-0 flex items-center justify-center bg-black/35 text-white"><Play size={20} /></span></button>
          </div>
        </div>

        <div>
          <Link to={`/brands/${p.brandSlug}`} className="eyebrow hover:text-burgundy">{brand?.name}</Link>
          <h1 className="mt-2 font-serif text-2xl sm:text-4xl md:text-5xl leading-tight text-burgundy-dark">{p.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4"><Rating value={p.rating} count={p.reviewCount} size={15} />{p.inStock ? <span className="text-xs font-medium text-emerald-700">In stock{p.stockCount < 5 ? ` · only ${p.stockCount} left` : ""}</span> : <span className="text-xs font-medium text-burgundy">Sold out — customize instead</span>}</div>
          <div className="mt-4 sm:mt-5 flex flex-wrap items-baseline gap-2.5 sm:gap-3"><span className="text-2xl sm:text-4xl font-semibold">{inr(price)}</span><span className="text-sm text-muted line-through">{inr(p.mrp)}</span><span className="text-xs sm:text-sm font-medium text-emerald-700">{Math.round(((p.mrp - p.price) / p.mrp) * 100)}% off</span></div>
          <p className="mt-0.5 text-xs text-muted">Incl. making charges & 3% GST · EMI from {inr(price / 12)}/mo</p>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed text-muted">{p.description}</p>

          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3 text-center text-xs">
            {[["Purity", p.purity === "—" ? "Alloy" : p.purity], ["Weight", `${p.weight} g`], ["Stone", p.stone.split(" ")[0] === "None" ? "—" : p.stone.split(" ")[0]]].map(([k, v]) => (<div key={k} className="rounded-sm border border-sand bg-white py-2.5 sm:py-3"><p className="text-[9px] sm:text-[10px] tracking-widest text-muted uppercase">{k}</p><p className="mt-0.5 sm:mt-1 font-serif text-base sm:text-xl text-burgundy-dark">{v}</p></div>))}
          </div>

          <div className="mt-6 sm:mt-7 rounded-md border border-gold/40 bg-champagne/50 p-4 sm:p-5">
            <p className="eyebrow mb-3 sm:mb-4 flex items-center gap-2"><Palette size={14} /> Customize this piece</p>
            <div className="flex flex-wrap items-start gap-4 sm:gap-6">
              <div><p className="label">Metal tone</p><div className="flex gap-2">{[["Yellow", "#E0B848"], ["Rose", "#E6A596"], ["White", "#E3E4E8"]].map(([n, h]) => (<button key={n} onClick={() => setTone(n)} aria-label={`${n} tone`} className={cn("h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2", tone === n ? "scale-110 border-burgundy" : "border-white ring-1 ring-sand")} style={{ background: h }} />))}</div>{tone === "White" && <p className="mt-1 text-[11px] text-muted">+₹1,500 rhodium</p>}</div>
              <div className="min-w-36 flex-1"><p className="label">Engraving (+₹450)</p><input className="input" maxLength={14} value={engraving} onChange={(e) => setEngraving(e.target.value)} placeholder="Name or date" aria-label="Engraving" /></div>
            </div>
            <Link to={`/customize?type=${customizeKindFor(p.type)}&from=${p.id}`} className="mt-4 inline-block text-xs font-medium text-burgundy underline underline-offset-4">Open full customization studio →</Link>
          </div>

          {sizes.length > 0 && (
            <div className="mt-6"><div className="flex items-center justify-between"><p className="label mb-0">Select size</p><button onClick={() => toast("Size guide: measure the inside diameter of a ring that fits you")} className="text-xs text-burgundy underline underline-offset-4">Size guide</button></div><div className="mt-2 flex flex-wrap gap-2">{sizes.map((s) => (<button key={s} onClick={() => setSize(s)} className={cn("min-w-10 sm:min-w-12 rounded-sm border px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm transition", size === s ? "border-burgundy bg-burgundy text-ivory" : "border-sand bg-white hover:border-gold")}>{s}</button>))}</div></div>
          )}

          <div className="mt-6 rounded-md border border-sand bg-white p-4">
            <p className="label flex items-center gap-1.5"><MapPin size={12} /> Delivery estimate</p>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (/^\d{6}$/.test(pin)) setEta(addDays(p.inStock ? 5 : 16)); else toast("Enter a valid 6-digit PIN code"); }}>
              <input className="input" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter PIN code" aria-label="PIN code" /><button className="btn btn-outline btn-sm">Check</button>
            </form>
            {eta && <p className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-emerald-700"><Truck size={15} /> Delivery by <b>{fmtLong(eta)}</b> · free insured shipping</p>}
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
            <button disabled={!p.inStock} onClick={add} className="btn btn-primary flex-1 min-w-[130px] py-3.5 sm:py-4 text-xs sm:text-sm"><ShoppingBag size={16} /> Add to cart</button>
            <button disabled={!p.inStock} onClick={() => { if (add()) nav("/checkout"); }} className="btn btn-gold flex-1 min-w-[130px] py-3.5 sm:py-4 text-xs sm:text-sm">Buy now</button>
            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={() => { toggleWishlist(p.id); toast(wished ? "Removed from wishlist" : "Saved to wishlist"); }} aria-label="Wishlist" className="btn btn-outline flex-1 sm:flex-none px-3.5 py-3 sm:py-4"><Heart size={18} className={wished ? "fill-burgundy" : ""} /></button>
              <button onClick={() => { const ok = toggleCompare(p.id); toast(!ok ? "Compare list is full (4)" : compared ? "Removed from compare" : "Added to compare"); }} aria-label="Compare" className={cn("btn btn-outline flex-1 sm:flex-none px-3.5 py-3 sm:py-4", compared && "bg-burgundy text-ivory")}><GitCompareArrows size={18} /></button>
              <button onClick={async () => { await copyText(`${p.name} by ${brand?.name} — ${inr(price)}\n${window.location.href}`); toast("Product link copied"); }} aria-label="Share" className="btn btn-outline flex-1 sm:flex-none px-3.5 py-3 sm:py-4"><Share2 size={18} /></button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3 text-center text-[10px] sm:text-[11px] text-muted">
            {[[BadgeCheck, "BIS Hallmarked"], [RotateCcw, "15-day returns"], [ShieldCheck, "Lifetime exchange"]].map(([I, l]) => { const Ic = I as typeof BadgeCheck; return (<div key={l as string} className="flex flex-col items-center gap-1"><Ic size={18} className="text-gold-dark" strokeWidth={1.4} />{l as string}</div>); })}
          </div>
        </div>
      </div>

      <section className="mt-14 sm:mt-16">
        <div className="flex gap-4 sm:gap-8 border-b border-sand overflow-x-auto no-scrollbar">{(["details", "breakup", "reviews"] as const).map((t) => (<button key={t} onClick={() => setTab(t)} className={cn("-mb-px border-b-2 pb-3 font-serif text-lg sm:text-2xl capitalize transition shrink-0 whitespace-nowrap", tab === t ? "border-burgundy text-burgundy" : "border-transparent text-muted hover:text-ink")}>{t === "breakup" ? "Price breakup" : t === "reviews" ? `Reviews (${reviews.length})` : "Details"}</button>))}</div>
        <div className="py-8">
          {tab === "details" && (
            <div className="grid gap-8 md:grid-cols-2">
              <dl className="divide-y divide-sand rounded-md border border-sand bg-white">
                {[["Metal", p.metal], ["Purity", p.purity === "—" ? "Fashion alloy" : p.purity], ["Gold / metal weight", `${p.weight} g`], ["Stone details", p.stone], ["Craft style", p.craft], ["Best for", p.occasion], ["Category", `${p.category} · ${p.type}`], ["Certification", p.purity === "22K" || p.purity === "18K" || p.purity === "14K" ? "BIS Hallmark" : "Seller certified"]].map(([k, v]) => (<div key={k} className="flex justify-between px-5 py-3 text-sm"><dt className="text-muted">{k}</dt><dd className="font-medium">{v}</dd></div>))}
              </dl>
              <div className="rounded-md bg-champagne/60 p-6"><h3 className="font-serif text-2xl text-burgundy-dark">About the craft</h3><p className="mt-3 text-sm leading-relaxed text-muted">{brand?.craft}</p><Link to="/crafts" className="mt-4 inline-block text-sm text-burgundy underline underline-offset-4">Discover regional crafts</Link></div>
            </div>
          )}
          {tab === "breakup" && (
            <div className="max-w-xl rounded-md border border-sand bg-white p-6">
              {[[`${p.metal} value (${p.weight} g)`, metalVal], ...(hasStone ? [[`Stone value (${p.stone})`, stoneVal]] : []), ["Making charges (artisan labour)", making], ["GST @ 3%", gst]].map(([k, v]) => (<div key={k as string} className="flex justify-between border-b border-sand/70 py-3 text-sm"><span className="text-muted">{k}</span><span>{inr(v as number)}</span></div>))}
              <div className="flex justify-between pt-4 font-serif text-2xl text-burgundy-dark"><span>Total</span><span>{inr(p.price)}</span></div>
              <p className="mt-3 text-xs text-muted">Mock breakup for demonstration. Making charges shown at {Math.round((making / base) * 100)}% of base value.</p>
            </div>
          )}
          {tab === "reviews" && (
            <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
              <div className="space-y-4">{reviews.map((r) => (<div key={r.id} className="card p-5"><div className="flex items-center justify-between"><Rating value={r.rating} /><span className="text-xs text-muted">{fmtDate(r.date)}</span></div><h4 className="mt-2 font-serif text-xl">{r.title}</h4><p className="mt-1 text-sm text-muted">{r.text}</p><p className="mt-2 text-xs font-medium">{r.name}, <span className="text-muted">{r.city}</span></p></div>))}</div>
              <form className="card h-fit space-y-4 p-6" onSubmit={(e) => { e.preventDefault(); if (!rv.name || !rv.text) return; setExtra([{ id: `new-${Date.now()}`, name: rv.name, city: "You", rating: rv.rating, title: "Your review", text: rv.text, date: new Date().toISOString() }, ...extra]); setRv({ name: "", rating: 5, text: "" }); toast("Thanks for your review!"); }}>
                <h3 className="font-serif text-2xl">Write a review</h3><p className="text-xs text-muted">Average {avg.toFixed(1)} from {reviews.length} reviews</p>
                <input className="input" placeholder="Your name" value={rv.name} onChange={(e) => setRv({ ...rv, name: e.target.value })} aria-label="Name" />
                <div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => (<button type="button" key={n} onClick={() => setRv({ ...rv, rating: n })} className={cn("text-2xl", n <= rv.rating ? "text-gold" : "text-sand")} aria-label={`${n} stars`}>★</button>))}</div>
                <textarea className="input min-h-24" placeholder="Share your experience" value={rv.text} onChange={(e) => setRv({ ...rv, text: e.target.value })} aria-label="Review" />
                <button className="btn btn-primary w-full">Submit review</button>
              </form>
            </div>
          )}
        </div>
      </section>

      {p.convertible && (
        <section className="mt-6 rounded-md bg-burgundy-dark p-8 text-ivory md:p-12">
          <p className="eyebrow text-gold-light">Convertible Jewelry</p><h2 className="mt-2 font-serif text-4xl">Five ways to wear this piece</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{ways.map((w, i) => (<div key={w} className="rounded-md border border-gold/30 p-4"><span className="font-serif text-4xl text-gold-light">{i + 1}</span><p className="mt-2 text-sm">{w}</p></div>))}</div>
          <Link to="/convertible" className="btn btn-gold mt-8">See styling guide</Link>
        </section>
      )}

      <section className="mt-20"><SectionHeading eyebrow="You may also love" title="Similar Pieces" /><div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">{sim.map((x, i) => (<ProductCard key={x.id} p={x} index={i} />))}</div></section>
    </div>
  );
}
