import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export function Reveal({ children, delay = 0, className, y = 24 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, sub, align = "center", light, action }: { eyebrow?: string; title: string; sub?: string; align?: "center" | "left"; light?: boolean; action?: ReactNode }) {
  return (
    <div className={cn("mb-8 flex flex-col gap-3 md:mb-14", align === "center" ? "items-center text-center" : "items-start text-left md:flex-row md:items-end md:justify-between")}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className={cn("eyebrow mb-2 sm:mb-3", light && "text-gold-light")}>{eyebrow}</p>}
        <h2 className={cn("font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.15] font-medium", light ? "text-ivory" : "text-burgundy-dark")}>{title}</h2>
        {sub && <p className={cn("mt-3 sm:mt-4 text-xs sm:text-sm md:text-[15px] leading-relaxed", light ? "text-ivory/75" : "text-muted")}>{sub}</p>}
        <div className="gold-rule mx-0 mt-4 sm:mt-5 w-20 sm:w-24" style={align === "center" ? { margin: "16px auto 0" } : undefined} />
      </div>
      {action}
    </div>
  );
}

export function Rating({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted" aria-label={`Rated ${value} out of 5`}>
      <span className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={size} className={i <= Math.round(value) ? "fill-gold text-gold" : "text-sand"} />
        ))}
      </span>
      <span className="font-medium text-ink">{value.toFixed(1)}</span>
      {count !== undefined && <span>({count.toLocaleString("en-IN")})</span>}
    </span>
  );
}

export function PageHero({ eyebrow, title, sub, image, children }: { eyebrow?: string; title: string; sub?: string; image?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-burgundy-dark text-ivory">
      {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
      <div className="absolute inset-0 bg-gradient-to-r from-burgundy-dark via-burgundy-dark/80 to-transparent" />
      <div className="container-x relative py-12 sm:py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
          {eyebrow && <p className="eyebrow mb-3 sm:mb-4 text-gold-light">{eyebrow}</p>}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.08] font-medium">{title}</h1>
          {sub && <p className="mt-4 sm:mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-ivory/80">{sub}</p>}
          {children && <div className="mt-6 sm:mt-8">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}

export function EmptyState({ icon, title, text, action }: { icon?: ReactNode; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-sand bg-white/60 px-6 py-16 text-center">
      {icon && <div className="mb-4 text-gold">{icon}</div>}
      <h3 className="font-serif text-2xl text-burgundy-dark">{title}</h3>
      {text && <p className="mt-2 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange, className }: { tabs: { id: T; label: string; icon?: ReactNode }[]; value: T; onChange: (v: T) => void; className?: string }) {
  return (
    <div role="tablist" className={cn("no-scrollbar flex gap-1 overflow-x-auto rounded-md border border-sand bg-champagne/60 p-1", className)}>
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-sm px-4 py-2.5 text-sm font-medium transition",
            value === t.id ? "bg-burgundy text-ivory shadow-soft" : "text-muted hover:text-burgundy",
          )}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Stat({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon?: ReactNode }) {
  return (
    <div className="card flex items-start justify-between p-5">
      <div>
        <p className="text-[11px] font-semibold tracking-wider text-muted uppercase">{label}</p>
        <p className="mt-2 font-serif text-3xl text-burgundy-dark">{value}</p>
        {sub && <p className="mt-1 text-xs text-emerald-700">{sub}</p>}
      </div>
      {icon && <div className="rounded-full bg-champagne p-3 text-gold-dark">{icon}</div>}
    </div>
  );
}

export function BrandMark({ monogram, primary, accent, size = 48 }: { monogram: string; primary: string; accent: string; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-serif font-semibold"
      style={{ width: size, height: size, background: primary, color: accent, border: `1.5px solid ${accent}`, fontSize: size * 0.4, boxShadow: `inset 0 0 0 3px ${primary}, inset 0 0 0 4px ${accent}55` }}
    >
      {monogram}
    </div>
  );
}
