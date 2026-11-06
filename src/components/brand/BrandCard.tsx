import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Brand } from "@/types";
import { BrandMark, Rating } from "@/components/common/ui";
import { compactInr } from "@/utils/format";

export function BrandCard({ brand, index = 0, detailed }: { brand: Brand; index?: number; detailed?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07 }}
    >
      <Link
        to={`/brands/${brand.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-md border border-sand/70 bg-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
      >
        <div className="relative h-40 overflow-hidden" style={{ background: brand.soft }}>
          <img src={brand.image} alt="" loading="lazy" className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 30%, ${brand.primary}cc)` }} />
          {brand.isNew && <span className="absolute top-3 right-3 rounded-sm bg-white/95 px-2 py-1 text-[10px] font-semibold tracking-widest uppercase" style={{ color: brand.primary }}>New</span>}
          {brand.featured && !brand.isNew && <span className="absolute top-3 right-3 rounded-sm bg-white/95 px-2 py-1 text-[10px] font-semibold tracking-widest uppercase" style={{ color: brand.primary }}>Featured</span>}
          <div className="absolute -bottom-0 left-4 translate-y-1/2">
            <BrandMark monogram={brand.monogram} primary={brand.primary} accent={brand.accent} size={56} />
          </div>
        </div>
        <div className="flex flex-1 flex-col px-5 pt-9 pb-5">
          <h3 className="font-serif text-2xl leading-tight" style={{ color: brand.primary }}>{brand.name}</h3>
          <p className="mt-1 text-sm text-muted">{brand.tagline}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-muted">
            <Rating value={brand.rating} size={12} />
            <span>{brand.city}</span>
          </div>
          {detailed && <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">{brand.story}</p>}
          <p className="mt-3 border-t border-sand pt-3 text-xs text-muted">
            <span className="font-semibold tracking-wider text-gold-dark uppercase">Featured · </span>
            {brand.collections[0].name}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-muted">{compactInr(brand.priceMin)} – {compactInr(brand.priceMax)}</span>
            <span className="inline-flex items-center gap-1 font-medium transition-all group-hover:gap-2" style={{ color: brand.primary }}>
              Explore Brand <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
