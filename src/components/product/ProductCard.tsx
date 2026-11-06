import { motion } from "framer-motion";
import { Eye, GitCompareArrows, Heart, Palette, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import type { JewelryType, Product } from "@/types";
import { getBrand } from "@/data/brands";
import { useStore, useUI, toast } from "@/store/useStore";
import { inr } from "@/utils/format";
import { cn } from "@/utils/cn";
import { Rating } from "@/components/common/ui";
import { t } from "@/utils/i18n";

export const customizeKindFor = (t: JewelryType) =>
  t === "Ring" ? "ring" : t === "Earrings" || t === "Jhumka" ? "jhumka" : t === "Bracelet" || t === "Bangle" ? "bracelet" : "necklace";

export function ProductCard({ p, index = 0, compact }: { p: Product; index?: number; compact?: boolean }) {
  const lang = useStore((s) => s.language);
  const brand = getBrand(p.brandSlug);
  const wished = useStore((s) => s.wishlist.includes(p.id));
  const compared = useStore((s) => s.compare.includes(p.id));
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const toggleCompare = useStore((s) => s.toggleCompare);
  const addToCart = useStore((s) => s.addToCart);
  const setQuickView = useUI((s) => s.setQuickView);
  const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="group flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-champagne">
        <Link to={`/product/${p.id}`} aria-label={p.name}>
          <img src={p.images[0]} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-0" />
          <img src={p.images[1]} alt="" loading="lazy" className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100" />
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {p.isNew && <span className="rounded-sm bg-burgundy px-2 py-1 text-[10px] font-semibold tracking-widest text-ivory uppercase">{t(lang, "new")}</span>}
          {p.trending && <span className="rounded-sm bg-gold px-2 py-1 text-[10px] font-semibold tracking-widest text-white uppercase">{t(lang, "trending")}</span>}
          {!p.inStock && <span className="rounded-sm bg-ink px-2 py-1 text-[10px] font-semibold tracking-widest text-white uppercase">{t(lang, "soldOut")}</span>}
        </div>
        <button
          onClick={() => { toggleWishlist(p.id); toast(wished ? t(lang, "removeFromWishlist") : t(lang, "addToWishlist")); }}
          aria-label={wished ? t(lang, "removeFromWishlist") : t(lang, "addToWishlist")}
          className="absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow transition hover:scale-110"
        >
          <Heart size={17} className={wished ? "fill-burgundy text-burgundy" : "text-ink"} />
        </button>
        <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
          <button onClick={() => setQuickView(p.id)} className="flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-white/95 py-2 text-xs font-medium text-burgundy shadow hover:bg-white">
            <Eye size={14} /> {t(lang, "quickView")}
          </button>
          <button
            onClick={() => { const ok = toggleCompare(p.id); toast(!ok ? "You can compare up to 4 items" : compared ? "Removed from compare" : "Added to compare"); }}
            aria-label={t(lang, "compareBtn")}
            className={cn("rounded-sm p-2 shadow", compared ? "bg-burgundy text-ivory" : "bg-white/95 text-burgundy hover:bg-white")}
          >
            <GitCompareArrows size={15} />
          </button>
        </div>
      </div>
      <div className="mt-3 sm:mt-4 flex flex-1 flex-col">
        <Link to={`/brands/${p.brandSlug}`} className="text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] sm:tracking-[0.18em] text-gold-dark uppercase hover:text-burgundy truncate">
          {brand?.name}
        </Link>
        <Link to={`/product/${p.id}`} className="mt-1 font-serif text-base sm:text-lg md:text-xl leading-snug sm:leading-tight text-burgundy-dark hover:text-burgundy line-clamp-2 min-h-[2.5rem]">
          {p.name}
        </Link>
        {!compact && <p className="mt-1 text-[11px] sm:text-xs text-muted truncate">{p.purity !== "—" ? `${p.purity} · ` : ""}{p.metal} · {p.weight}g</p>}
        <div className="mt-1.5 sm:mt-2"><Rating value={p.rating} count={p.reviewCount} size={11} /></div>
        <div className="mt-1.5 sm:mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
          <span className="text-sm sm:text-base font-semibold text-ink">{inr(p.price)}</span>
          <span className="text-[10px] sm:text-xs text-muted line-through">{inr(p.mrp)}</span>
          <span className="text-[10px] sm:text-xs font-medium text-emerald-700">{off}% {t(lang, "off")}</span>
        </div>
        <div className="mt-auto pt-3 flex gap-1.5 sm:gap-2">
          <Link to={`/customize?type=${customizeKindFor(p.type)}&from=${p.id}`} className="btn btn-outline btn-sm flex-1 px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs">
            <Palette size={13} /> <span className="hidden xs:inline">{t(lang, "customizeBtn")}</span><span className="xs:hidden">Edit</span>
          </Link>
          <button
            disabled={!p.inStock}
            onClick={() => { addToCart({ kind: "product", productId: p.id, name: p.name, brand: brand?.name ?? "", image: p.images[0], price: p.price }); toast(t(lang, "addedToCart")); }}
            aria-label={t(lang, "addToCart")}
            className="btn btn-primary btn-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
