import { motion } from "framer-motion";
import { ArrowRight, Award, BadgeCheck, Gem, Gift, Palette, Send, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BrandCard } from "@/components/brand/BrandCard";
import { JewelryPreview } from "@/components/customization/JewelryPreview";
import { Reveal, SectionHeading } from "@/components/common/ui";
import { ProductCard } from "@/components/product/ProductCard";
import { brands } from "@/data/brands";
import { homeCategories } from "@/data/categories";
import { bridalStyles, crafts, giftOccasions, testimonials } from "@/data/collections";
import { IMG, pools } from "@/data/images";
import { products } from "@/data/products";
import { useDocumentTitle } from "@/hooks";
import { toast, useStore } from "@/store/useStore";
import { builders, quote, type DesignState } from "@/utils/customizer";
import { inr } from "@/utils/format";
import { t } from "@/utils/i18n";
import { cn } from "@/utils/cn";

function Hero() {
  const lang = useStore((s) => s.language);
  return (
    <section className="relative isolate overflow-hidden bg-burgundy-dark text-ivory">
      <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: "easeOut" }} src={IMG.hero} alt="Indian bride adorned in royal gold jewelry" className="absolute inset-0 -z-10 h-full w-full object-cover object-[70%_30%]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-burgundy-dark via-burgundy-dark/75 to-burgundy-dark/10" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-burgundy-dark/70 to-transparent" />
      <div className="container-x flex min-h-[640px] flex-col justify-center py-24 lg:min-h-[760px]">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="max-w-2xl">
          <p className="eyebrow mb-4 sm:mb-6 text-gold-light">{t(lang, "heroEyebrow")}</p>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-[88px] leading-[1.05] font-medium">{t(lang, "heroTitle")}</h1>
          <p className="mt-5 sm:mt-7 max-w-lg text-sm sm:text-base md:text-lg leading-relaxed text-ivory/80">{t(lang, "heroSub")}</p>
          <div className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4">
            <Link to="/shop" className="btn btn-gold px-6 sm:px-8 py-3.5 sm:py-4 w-full sm:w-auto">{t(lang, "explore")} <ArrowRight size={16} /></Link>
            <Link to="/customize" className="btn border border-ivory/60 px-6 sm:px-8 py-3.5 sm:py-4 w-full sm:w-auto text-ivory hover:bg-ivory hover:text-burgundy"><Palette size={16} /> {t(lang, "design")}</Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-12 sm:mt-16 grid max-w-xl grid-cols-3 gap-3 sm:gap-6 border-t border-gold/30 pt-6">
          {[
            ["20", t(lang, "heritageBrands")],
            ["500+", t(lang, "handcraftedDesigns")],
            ["14", t(lang, "craftRegions")],
          ].map(([n, l]) => (
            <div key={l}><p className="font-serif text-2xl sm:text-4xl text-gold-light">{n}</p><p className="text-[10px] sm:text-xs tracking-wider text-ivory/70 uppercase">{l}</p></div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Trust() {
  const lang = useStore((s) => s.language);
  const items = [
    [BadgeCheck, t(lang, "bisHallmarked"), t(lang, "bisDesc")],
    [ShieldCheck, t(lang, "lifetimeExchange"), t(lang, "exchangeDesc")],
    [Truck, t(lang, "insuredShipping"), t(lang, "shippingDesc")],
    [Award, t(lang, "certifiedGems"), t(lang, "gemsDesc")],
  ] as const;
  return (
    <div className="border-b border-sand bg-champagne/60">
      <div className="container-x grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-6">
        {items.map(([I, a, b]) => (
          <div key={a} className="flex items-center gap-3"><I className="shrink-0 text-gold-dark" size={24} strokeWidth={1.4} /><div><p className="text-sm font-medium text-burgundy-dark">{a}</p><p className="text-xs text-muted">{b}</p></div></div>
        ))}
      </div>
    </div>
  );
}

function Categories() {
  const lang = useStore((s) => s.language);
  return (
    <section className="container-x py-20 md:py-28">
      <SectionHeading eyebrow={t(lang, "shopByCategory")} title={t(lang, "findYourPiece")} sub={t(lang, "categoriesSub")} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6">
        {homeCategories.map((c, i) => (
          <Reveal key={c.name} delay={(i % 5) * 0.05}>
            <Link to={c.to} className="group block text-center">
              <div className="relative mx-auto aspect-[3/4] overflow-hidden rounded-t-full rounded-b-md border border-gold/30 bg-champagne p-1.5 transition group-hover:border-gold">
                <img src={c.image} alt="" loading="lazy" className="h-full w-full rounded-t-full rounded-b-sm object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <p className="mt-4 font-serif text-xl text-burgundy-dark transition group-hover:text-burgundy">{c.name}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function BrandsSection() {
  const lang = useStore((s) => s.language);
  return (
    <section className="bg-champagne/50 py-20 md:py-28">
      <div className="container-x">
        <SectionHeading eyebrow={t(lang, "shriingEcosystem")} title={t(lang, "exploreBrands")} sub={t(lang, "brandsSub")} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {brands.map((b, i) => (<BrandCard key={b.slug} brand={b} index={i} />))}
        </div>
        <div className="mt-12 text-center"><Link to="/brands" className="btn btn-outline">{t(lang, "viewAllBrands")} <ArrowRight size={16} /></Link></div>
      </div>
    </section>
  );
}

function CustomizeSection() {
  const lang = useStore((s) => s.language);
  const [s, setS] = useState<DesignState>({ ...builders.ring.defaults, ringType: "Halo" });
  const q = quote("ring", s);
  const g = (k: string) => builders.ring.groups.find((x) => x.key === k)!.options!;
  const tiles = [
    { t: "ring", label: t(lang, "designYourRing"), img: pools.ring[0] },
    { t: "necklace", label: t(lang, "createYourNecklace"), img: pools.necklace[3] },
    { t: "jhumka", label: t(lang, "customizeYourJhumka"), img: pools.earring[0] },
    { t: "necklace", label: t(lang, "personalizeYourPendant"), img: pools.pendant[0] },
  ];
  return (
    <section className="container-x py-20 md:py-28">
      <SectionHeading eyebrow={t(lang, "customizationStudio")} title={t(lang, "customizeYourJewelry")} sub={t(lang, "customizeSub")} />
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
        <div className="card overflow-hidden">
          <div className="relative bg-gradient-to-b from-champagne to-ivory">
            <JewelryPreview kind="ring" state={s} className="mx-auto aspect-square w-full max-w-md" />
            <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium tracking-widest text-gold-dark uppercase">{t(lang, "livePreview")}</span>
          </div>
          <div className="space-y-5 border-t border-sand p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div><p className="label">{t(lang, "metalColor")}</p><div className="flex gap-2">{g("metalColor").map((o) => (<button key={o.value} aria-label={o.label} onClick={() => setS({ ...s, metalColor: o.value })} className={cn("h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2", s.metalColor === o.value ? "border-burgundy scale-110" : "border-white ring-1 ring-sand")} style={{ background: o.hex }} />))}</div></div>
              <div><p className="label">{t(lang, "stone")}</p><div className="flex gap-2">{g("stoneColor").slice(0, 5).map((o) => (<button key={o.value} aria-label={o.label} onClick={() => setS({ ...s, stoneColor: o.value, stone: o.value === "White" ? "Diamond" : o.value === "Red" ? "Ruby" : o.value === "Green" ? "Emerald" : o.value === "Blue" ? "Sapphire" : "Moissanite" })} className={cn("h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2", s.stoneColor === o.value ? "border-burgundy scale-110" : "border-white ring-1 ring-sand")} style={{ background: o.hex }} />))}</div></div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"><div><p className="label mb-0">{t(lang, "estimatedPrice")}</p><p className="font-serif text-3xl sm:text-4xl text-burgundy-dark">{inr(q.total)}</p></div><Link to="/customize?type=ring" className="btn btn-primary w-full sm:w-auto">{t(lang, "openStudio")} <ArrowRight size={16} /></Link></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {tiles.map((x, i) => (
            <Reveal key={x.label} delay={i * 0.08}>
              <Link to={`/customize?type=${x.t}`} className="group relative block aspect-[4/5] overflow-hidden rounded-md">
                <img src={x.img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/85 via-transparent to-transparent" />
                <p className="absolute inset-x-3 sm:inset-x-4 bottom-3 sm:bottom-4 font-serif text-base sm:text-xl md:text-2xl leading-tight text-ivory">{x.label}<span className="mt-1 flex items-center gap-1 font-sans text-[10px] sm:text-xs tracking-wider text-gold-light uppercase">{t(lang, "startDesigning")} <ArrowRight size={12} /></span></p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BridalSection() {
  const lang = useStore((s) => s.language);
  return (
    <section className="relative overflow-hidden bg-burgundy-dark py-16 sm:py-20 text-ivory md:py-28">
      <div className="container-x grid items-center gap-10 lg:gap-14 lg:grid-cols-2">
        <Reveal className="relative max-w-md mx-auto lg:max-w-none">
          <img src={IMG.bridal} alt="Indian bride looking into a mirror" loading="lazy" className="aspect-[4/5] w-full rounded-t-[140px] sm:rounded-t-[200px] rounded-b-md object-cover" />
          <img src={IMG.bridalB} alt="Bride in red" loading="lazy" className="absolute -right-4 -bottom-8 hidden aspect-square w-44 rounded-md border-4 border-burgundy-dark object-cover shadow-lift md:block" />
          <div className="absolute inset-3 rounded-t-[130px] sm:rounded-t-[190px] rounded-b-md border border-gold/50" />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow mb-3 sm:mb-4 text-gold-light">{t(lang, "bridalCollection")}</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.08]">{t(lang, "bridalTitle")}</h2>
          <p className="mt-4 sm:mt-6 max-w-lg text-sm sm:text-base text-ivory/75">{t(lang, "bridalSub")}</p>
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-2">
            {bridalStyles.map((b) => (<Link key={b.id} to={`/bridal?style=${encodeURIComponent(b.id)}`} className="rounded-full border border-gold/50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gold-light transition hover:bg-gold hover:text-burgundy-dark">{b.id}</Link>))}
          </div>
          <div className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4"><Link to="/bridal" className="btn btn-gold px-6 sm:px-8 py-3.5 sm:py-4 w-full sm:w-auto">{t(lang, "buildBridalSet")} <ArrowRight size={16} /></Link><Link to="/shop?occasion=Bridal" className="btn border border-ivory/50 px-6 sm:px-8 py-3.5 sm:py-4 w-full sm:w-auto hover:bg-ivory hover:text-burgundy">{t(lang, "shopBridal")}</Link></div>
        </Reveal>
      </div>
    </section>
  );
}

function CraftsSection() {
  const lang = useStore((s) => s.language);
  return (
    <section className="container-x py-20 md:py-28">
      <SectionHeading eyebrow={t(lang, "karigarHeritage")} title={t(lang, "discoverCraftsmanship")} sub={t(lang, "craftsSub")} action={<Link to="/crafts" className="btn btn-outline btn-sm">Explore All 14 Traditions <ArrowRight size={14} /></Link>} align="left" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {crafts.slice(0, 6).map((c, i) => (
          <Reveal key={c.slug} delay={(i % 3) * 0.08}>
            <Link to={`/crafts/${c.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-md shadow-soft">
              <img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/90 via-burgundy-dark/20 to-transparent" />
              <span className="absolute top-4 left-4 rounded-full bg-burgundy/85 px-3 py-0.5 text-[10px] font-semibold tracking-wider text-ivory uppercase backdrop-blur-sm">{c.region}</span>
              <div className="absolute inset-x-5 bottom-5 text-ivory">
                <p className="eyebrow text-gold-light">{c.specialties.join(" · ")}</p>
                <h3 className="mt-1 font-serif text-3xl">{c.name}</h3>
                <p className="mt-1 text-sm text-ivory/75">{c.tagline}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-semibold tracking-widest text-gold-dark uppercase mr-2">All 14 Regional Traditions:</span>
        {crafts.map((c) => (
          <Link key={c.slug} to={`/crafts/${c.slug}`} className="chip text-xs hover:border-gold hover:text-burgundy">
            {c.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

function Trending() {
  const lang = useStore((s) => s.language);
  const list = products.filter((p) => p.trending).slice(0, 8);
  return (
    <section className="bg-champagne/50 py-20 md:py-28">
      <div className="container-x">
        <SectionHeading eyebrow={t(lang, "mostLoved")} title={t(lang, "trendingNow")} action={<Link to="/shop" className="btn btn-outline btn-sm">{t(lang, "shopAll")}</Link>} align="left" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {list.map((p, i) => (<ProductCard key={p.id} p={p} index={i} />))}
        </div>
      </div>
    </section>
  );
}

function AIPromo() {
  const lang = useStore((s) => s.language);
  return (
    <section className="container-x py-16 sm:py-20 md:py-28">
      <div className="grid overflow-hidden rounded-md bg-burgundy text-ivory lg:grid-cols-2">
        <div className="p-6 sm:p-8 md:p-14">
          <p className="eyebrow mb-3 sm:mb-4 flex items-center gap-2 text-gold-light"><Sparkles size={14} /> {t(lang, "aiStylist")}</p>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl leading-tight">“I have a red bridal lehenga and ₹2 lakh.”</h2>
          <p className="mt-4 sm:mt-5 max-w-md text-sm sm:text-base text-ivory/75">Tell our stylist your outfit, occasion and budget — or upload a photo. Get a coordinated necklace, earrings, bangles and maang tikka in seconds.</p>
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
            <Link to="/ai-stylist" className="btn btn-gold w-full sm:w-auto">{t(lang, "chatWithStylist")}</Link>
            <Link to="/lehenga-match" className="btn border border-ivory/40 w-full sm:w-auto hover:bg-ivory hover:text-burgundy">{t(lang, "lehengaMatchStudio")}</Link>
          </div>
        </div>
        <div className="relative min-h-[300px] sm:min-h-[340px] bg-burgundy-dark p-4 sm:p-6 md:p-10">
          <img src={IMG.stylist} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
          <div className="relative space-y-3">
            <div className="ml-auto max-w-[90%] sm:max-w-[80%] rounded-md bg-gold/90 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-burgundy-dark">Red bridal lehenga, budget ₹2 lakh 💍</div>
            <div className="max-w-[95%] sm:max-w-[88%] rounded-md bg-ivory p-3.5 sm:p-4 text-sm text-ink shadow-lift">
              <p className="font-serif text-base sm:text-lg text-burgundy-dark">Classic Heritage Look · ₹1.94 L</p>
              <p className="mt-1 text-xs text-muted">Warm 22K gold and ruby accents amplify red without competing with it.</p>
              <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">{[0, 1, 2, 3].map((i) => (<img key={i} src={pools.necklace[i + 1]} alt="" className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-sm object-cover" />))}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GiftingSection() {
  const lang = useStore((s) => s.language);
  return (
    <section className="bg-champagne/50 py-20 md:py-28">
      <div className="container-x">
        <SectionHeading eyebrow={t(lang, "personalizedGifting")} title={t(lang, "giftingTitle")} sub={t(lang, "giftingSub")} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {giftOccasions.map((g, i) => (
            <Reveal key={g.id} delay={(i % 4) * 0.06}>
              <Link to={`/gifting?occasion=${encodeURIComponent(g.id)}`} className="group flex h-full flex-col rounded-md border border-sand bg-white p-6 transition hover:-translate-y-1 hover:border-gold hover:shadow-lift">
                <Gift className="text-gold-dark" size={26} strokeWidth={1.4} />
                <h3 className="mt-4 font-serif text-2xl text-burgundy-dark">{g.id}</h3>
                <p className="mt-1 flex-1 text-sm text-muted">{g.blurb}</p>
                <span className="mt-4 flex items-center gap-1 text-xs font-medium text-burgundy transition-all group-hover:gap-2">Personalize <ArrowRight size={12} /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const lang = useStore((s) => s.language);
  return (
    <section className="container-x py-20 md:py-28">
      <SectionHeading eyebrow={t(lang, "loveNotes")} title={t(lang, "customerStories")} />
      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.map((tItem, i) => (
          <Reveal key={tItem.name} delay={(i % 2) * 0.1}>
            <figure className="card h-full p-8">
              <Gem className="text-gold" size={22} strokeWidth={1.4} />
              <blockquote className="mt-4 font-serif text-2xl leading-snug text-burgundy-dark">“{tItem.text}”</blockquote>
              <figcaption className="mt-6 flex items-center justify-between border-t border-sand pt-4 text-sm"><span className="font-medium">{tItem.name}, <span className="text-muted">{tItem.city}</span></span><span className="text-xs text-gold-dark">{tItem.item}</span></figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="relative overflow-hidden bg-burgundy-dark py-20 text-ivory">
      <img src={IMG.gems} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" />
      <div className="container-x relative mx-auto max-w-2xl text-center">
        <p className="eyebrow mb-4 text-gold-light">The SHRIING Letter</p>
        <h2 className="font-serif text-4xl md:text-5xl">Be the first to know</h2>
        <p className="mt-4 text-ivory/75">New drops, gold rate alerts and karigar stories — twice a month, never more.</p>
        <form onSubmit={(e) => { e.preventDefault(); toast(`Subscribed ${email}. Welcome to SHRIING!`); setEmail(""); }} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="input border-gold/40 bg-white/10 text-ivory placeholder:text-ivory/50" aria-label="Email" />
          <button className="btn btn-gold"><Send size={15} /> Subscribe</button>
        </form>
      </div>
    </section>
  );
}

export default function HomePage() {
  useDocumentTitle("India's Ultimate Jewelry Marketplace");
  return (
    <>
      <Hero />
      <Trust />
      <Categories />
      <BrandsSection />
      <CustomizeSection />
      <BridalSection />
      <CraftsSection />
      <Trending />
      <AIPromo />
      <GiftingSection />
      <Testimonials />
      <Newsletter />
    </>
  );
}
