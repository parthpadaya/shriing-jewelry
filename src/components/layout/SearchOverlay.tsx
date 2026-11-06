import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { brands } from "@/data/brands";
import { products } from "@/data/products";
import { useStore, useUI } from "@/store/useStore";
import { inr } from "@/utils/format";
import { t } from "@/utils/i18n";

export function SearchOverlay() {
  const { searchOpen, setSearch } = useUI();
  const lang = useStore((s) => s.language);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const nav = useNavigate();

  useEffect(() => {
    if (searchOpen) setTimeout(() => ref.current?.focus(), 80);
    const k = (e: KeyboardEvent) => e.key === "Escape" && setSearch(false);
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [searchOpen, setSearch]);

  const res = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return { p: products.filter((p) => p.trending).slice(0, 4), b: [] as typeof brands };
    return {
      p: products.filter((p) => `${p.name} ${p.type} ${p.category} ${p.stone} ${p.craft} ${p.occasion}`.toLowerCase().includes(s)).slice(0, 6),
      b: brands.filter((b) => `${b.name} ${b.tagline} ${b.category}`.toLowerCase().includes(s)).slice(0, 4),
    };
  }, [q]);

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(false);
    nav(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-burgundy-dark/50 backdrop-blur-sm" onClick={() => setSearch(false)} />
          <motion.div initial={{ y: -40 }} animate={{ y: 0 }} exit={{ y: -40 }} className="relative bg-ivory shadow-lift">
            <form onSubmit={go} className="container-x flex items-center gap-4 border-b border-sand py-5">
              <Search className="text-gold-dark" />
              <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t(lang, "searchPlaceholder")} className="flex-1 bg-transparent font-serif text-2xl outline-none placeholder:text-muted/50 md:text-3xl" aria-label={t(lang, "search")} />
              <button type="button" onClick={() => setSearch(false)} aria-label="Close search" className="rounded-full p-2 hover:bg-champagne"><X /></button>
            </form>
            <div className="container-x grid max-h-[60vh] gap-8 overflow-y-auto py-6 md:grid-cols-[2fr_1fr]">
              <div>
                <p className="eyebrow mb-3">{q ? t(lang, "products") : t(lang, "trendingNow")}</p>
                {res.p.length === 0 && <p className="text-sm text-muted">{t(lang, "noProductsFound")}</p>}
                <div className="grid gap-3 sm:grid-cols-2">
                  {res.p.map((p) => (
                    <Link key={p.id} to={`/product/${p.id}`} onClick={() => setSearch(false)} className="flex items-center gap-3 rounded-sm p-2 hover:bg-champagne">
                      <img src={p.images[0]} alt="" className="h-16 w-16 rounded-sm object-cover" />
                      <span><span className="block font-serif text-lg leading-tight text-burgundy-dark">{p.name}</span><span className="text-sm text-muted">{inr(p.price)}</span></span>
                    </Link>
                  ))}
                </div>
                {q && <button onClick={go} className="btn btn-outline btn-sm mt-4">{t(lang, "explore")} “{q}”</button>}
              </div>
              <div>
                <p className="eyebrow mb-3">{q ? t(lang, "brands") : t(lang, "explore")}</p>
                {q ? (
                  res.b.length ? res.b.map((b) => (<Link key={b.slug} to={`/brands/${b.slug}`} onClick={() => setSearch(false)} className="block rounded-sm px-2 py-2 hover:bg-champagne"><span className="font-serif text-lg text-burgundy-dark">{b.name}</span><span className="block text-xs text-muted">{b.tagline}</span></Link>)) : <p className="text-sm text-muted">{t(lang, "noProductsFound")}</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {["Kundan", "Diamond ring", "Jhumka", "Bridal", "Pearl", "Temple", "Gold bangles"].map((s) => (
                      <button key={s} onClick={() => setQ(s)} className="chip">{s}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
