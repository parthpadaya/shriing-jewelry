import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, MapPin, Palette, Quote, Tag } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BrandMark, EmptyState, Rating, Reveal } from "@/components/common/ui";
import { ProductCard } from "@/components/product/ProductCard";
import { getBrand } from "@/data/brands";
import { productsByBrand } from "@/data/products";
import { getReviews } from "@/data/reviews";
import { useDocumentTitle } from "@/hooks";
import { fmtDate, compactInr } from "@/utils/format";
import { toast } from "@/store/useStore";

export default function BrandStorefront() {
  const { brandSlug } = useParams();
  const brand = getBrand(brandSlug);
  useDocumentTitle(brand?.name ?? "Brand");
  const [filter, setFilter] = useState("All");
  const [rev, setRev] = useState(3);
  const prods = useMemo(() => (brand ? productsByBrand(brand.slug) : []), [brand]);
  const reviews = useMemo(() => (brand ? getReviews(brand.slug, 9) : []), [brand]);
  if (!brand) return <div className="container-x py-24"><EmptyState title="Brand not found" action={<Link className="btn btn-primary" to="/brands">Browse all brands</Link>} /></div>;
  const types = ["All", ...Array.from(new Set(prods.map((p) => p.type)))];
  const shown = prods.filter((p) => filter === "All" || p.type === filter);
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: Math.round(brand.reviewCount * ([0.72, 0.2, 0.05, 0.02, 0.01][5 - n])) }));

  return (
    <div style={{ ["--b" as string]: brand.primary, ["--a" as string]: brand.accent }}>
      <section className="relative isolate overflow-hidden text-white" style={{ background: brand.primary }}>
        <img src={brand.image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 -z-10" style={{ background: `linear-gradient(90deg, ${brand.primary} 20%, ${brand.primary}99 55%, transparent)` }} />
        <div className="container-x py-20 md:py-28">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <div className="flex items-center gap-3 sm:gap-4"><BrandMark monogram={brand.monogram} primary={brand.primary} accent={brand.accent} size={60} /><div><p className="eyebrow" style={{ color: brand.accent }}>{brand.category}</p><p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-white/70"><MapPin size={14} /> {brand.city} · Est. {brand.founded}</p></div></div>
            <h1 className="mt-6 sm:mt-8 font-serif text-3xl sm:text-5xl md:text-6xl lg:text-8xl leading-tight sm:leading-none">{brand.name}</h1>
            <p className="mt-3 sm:mt-4 font-serif text-lg sm:text-2xl italic" style={{ color: brand.accent }}>{brand.tagline}</p>
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-white/80"><Rating value={brand.rating} count={brand.reviewCount} /><span>{compactInr(brand.priceMin)} – {compactInr(brand.priceMax)}</span><span className="flex items-center gap-1"><BadgeCheck size={15} /> BIS Hallmarked</span></div>
            <div className="mt-7 sm:mt-9 flex flex-wrap gap-3 sm:gap-4">
              <a href="#products" className="btn px-6 sm:px-8 py-3.5 sm:py-4 text-white w-full sm:w-auto" style={{ background: brand.accent }}>Shop {brand.name} <ArrowRight size={16} /></a>
              <Link to={`/customize?brand=${brand.slug}`} className="btn border border-white/60 px-6 sm:px-8 py-3.5 sm:py-4 text-white w-full sm:w-auto hover:bg-white hover:text-ink"><Palette size={16} /> Customize with us</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <p className="eyebrow" style={{ color: brand.primary }}>Our Story</p>
          <h2 className="mt-3 font-serif text-2xl sm:text-4xl text-ink md:text-5xl">{brand.tagline}</h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-muted">{brand.story}</p>
          <div className="mt-8 rounded-md p-5 sm:p-6" style={{ background: brand.soft }}>
            <p className="eyebrow mb-2" style={{ color: brand.primary }}>Craftsmanship</p>
            <p className="leading-relaxed text-sm sm:text-base text-ink/80">{brand.craft}</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="card p-7" style={{ borderColor: brand.accent + "55" }}>
            <h3 className="font-serif text-2xl" style={{ color: brand.primary }}>Customization capabilities</h3>
            <ul className="mt-5 space-y-3">
              {brand.customFeatures.map((f) => (<li key={f} className="flex items-start gap-3 text-sm"><Palette size={16} className="mt-0.5 shrink-0" style={{ color: brand.accent }} />{f}</li>))}
            </ul>
            <Link to={`/customize?brand=${brand.slug}`} className="btn mt-6 w-full text-white" style={{ background: brand.primary }}>Open customization studio</Link>
          </div>
          <div className="mt-5 rounded-md p-6" style={{ background: brand.primary, color: "#fff" }}>
            <p className="eyebrow mb-3 flex items-center gap-2" style={{ color: brand.accent }}><Tag size={14} /> Brand offers</p>
            <ul className="space-y-2 text-sm">{brand.offers.map((o) => (<li key={o} className="flex items-center gap-2"><BadgeCheck size={15} style={{ color: brand.accent }} />{o}</li>))}</ul>
            <button onClick={() => toast("Offer applied to your next order")} className="mt-4 text-xs font-medium underline underline-offset-4">Claim offer</button>
          </div>
        </Reveal>
      </section>

      <section className="py-16" style={{ background: brand.soft }}>
        <div className="container-x">
          <div className="mb-10 text-center"><p className="eyebrow" style={{ color: brand.primary }}>Collections</p><h2 className="mt-3 font-serif text-4xl text-ink md:text-5xl">The {brand.name} Collections</h2></div>
          <div className="grid gap-5 md:grid-cols-3">
            {brand.collections.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.08}>
                <a href="#products" className="group relative block aspect-[4/5] overflow-hidden rounded-md">
                  <img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, ${brand.primary}ee)` }} />
                  <div className="absolute inset-x-5 bottom-5 text-white"><h3 className="font-serif text-3xl">{c.name}</h3><p className="mt-1 text-sm text-white/75">{c.blurb}</p><span className="mt-3 inline-flex items-center gap-1 text-xs tracking-wider uppercase" style={{ color: brand.accent }}>View pieces <ArrowRight size={12} /></span></div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="container-x scroll-mt-24 py-16 md:py-24">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><p className="eyebrow" style={{ color: brand.primary }}>Featured Products</p><h2 className="mt-3 font-serif text-2xl sm:text-4xl text-ink md:text-5xl">Shop {brand.name}</h2></div>
          <div className="flex flex-wrap gap-2">{types.map((t) => (<button key={t} onClick={() => setFilter(t)} className="chip" style={filter === t ? { background: brand.primary, color: "#fff", borderColor: brand.primary } : undefined}>{t}</button>))}</div>
        </div>
        <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6">{shown.map((p, i) => (<ProductCard key={p.id} p={p} index={i} />))}</div>
      </section>

      <section className="bg-ink py-16 text-ivory md:py-24">
        <div className="container-x grid items-center gap-10 md:grid-cols-[1fr_1.4fr]">
          <img src={brand.artisan.image} alt={brand.artisan.name} loading="lazy" className="aspect-[4/5] w-full max-w-sm rounded-t-full rounded-b-md object-cover mx-auto" />
          <div><p className="eyebrow" style={{ color: brand.accent }}>Karigar Story</p><Quote size={30} style={{ color: brand.accent }} className="mt-4 sm:mt-5" /><blockquote className="mt-3 font-serif text-xl sm:text-3xl leading-snug md:text-4xl">{brand.artisan.quote}</blockquote><p className="mt-5 sm:mt-6 font-medium">{brand.artisan.name}</p><p className="text-sm text-ivory/60">{brand.artisan.role}</p><Link to="/karigar" className="btn mt-6 sm:mt-8 border border-ivory/40 hover:bg-ivory hover:text-ink">Meet more karigars</Link></div>
        </div>
      </section>

      <section className="container-x py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
          <div>
            <p className="eyebrow" style={{ color: brand.primary }}>Reviews</p>
            <p className="mt-3 font-serif text-7xl text-ink">{brand.rating}</p><Rating value={brand.rating} size={18} /><p className="mt-1 text-sm text-muted">{brand.reviewCount.toLocaleString("en-IN")} verified reviews</p>
            <div className="mt-6 space-y-2">{dist.map((d) => (<div key={d.n} className="flex items-center gap-3 text-xs"><span className="w-3">{d.n}</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-sand"><div className="h-full rounded-full" style={{ width: `${(d.c / brand.reviewCount) * 100}%`, background: brand.accent }} /></div><span className="w-10 text-right text-muted">{d.c}</span></div>))}</div>
          </div>
          <div className="space-y-5">
            {reviews.slice(0, rev).map((r) => (
              <div key={r.id} className="card p-6"><div className="flex items-center justify-between"><Rating value={r.rating} /><span className="text-xs text-muted">{fmtDate(r.date)}</span></div><h4 className="mt-3 font-serif text-xl text-ink">{r.title}</h4><p className="mt-1 text-sm leading-relaxed text-muted">{r.text}</p><p className="mt-3 text-xs font-medium">{r.name} · <span className="text-muted">{r.city}</span> · <span className="text-emerald-700">Verified buyer</span></p></div>
            ))}
            {rev < reviews.length && <button onClick={() => setRev(rev + 3)} className="btn btn-outline">Load more reviews</button>}
          </div>
        </div>
      </section>
    </div>
  );
}
