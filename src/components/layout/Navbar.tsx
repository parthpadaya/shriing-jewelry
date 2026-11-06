import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Gem, Globe, Heart, Menu, Search, ShoppingBag, User, X, Sparkles, Shirt, Hammer, Camera, Gift, Calculator, Coins, GitCompareArrows, BookHeart, Users, Repeat, Mic, LayoutDashboard, Store, Wrench } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useStore, useUI } from "@/store/useStore";
import { languages, t } from "@/utils/i18n";
import { cn } from "@/utils/cn";
import type { LangCode } from "@/types";
import { useGoldRate } from "@/hooks";

export const studioLinks = [
  { id: "aiStylist", to: "/ai-stylist", label: "AI Jewelry Stylist", desc: "Outfit-matched recommendations", icon: Sparkles },
  { id: "lehengaMatch", to: "/lehenga-match", label: "Lehenga Match Studio", desc: "Upload your outfit, get a set", icon: Shirt },
  { id: "heirloom", to: "/heirloom", label: "Heirloom Redesign", desc: "Reimagine old family jewelry", icon: Hammer },
  { id: "apniKahani", to: "/apni-kahani", label: "Apni Kahani", desc: "Messages, handwriting & soundwaves", icon: Mic },
  { id: "tryOn", to: "/try-on", label: "Virtual Try-On", desc: "See jewelry on you", icon: Camera },
  { id: "gifting", to: "/gifting", label: "Personalized Gifting", desc: "8 occasions, endless meaning", icon: Gift },
  { id: "goldTools", to: "/gold-tools", label: "Gold Price Calculator", desc: "Live rate, GST & making", icon: Calculator },
  { id: "goldExchange", to: "/gold-tools?tab=exchange", label: "Old Gold Exchange", desc: "Indicative exchange value", icon: Coins },
  { id: "compare", to: "/compare", label: "Compare Jewelry", desc: "Side-by-side comparison", icon: GitCompareArrows },
  { id: "convertible", to: "/convertible", label: "Convertible Jewelry", desc: "One jewel, many ways to wear", icon: Repeat },
  { id: "registry", to: "/registry", label: "Wedding Registry", desc: "Curate your bridal gift list", icon: BookHeart },
  { id: "karigar", to: "/karigar", label: "Karigar Stories", desc: "Meet the hands behind the gold", icon: Users },
];

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="SHRIING home">
      <span className={cn("flex h-9 w-9 items-center justify-center rounded-full border", light ? "border-gold-light text-gold-light" : "border-gold text-gold")}>
        <Gem size={18} strokeWidth={1.5} />
      </span>
      <span className="leading-none">
        <span className={cn("block font-serif text-[28px] font-semibold tracking-[0.22em]", light ? "text-ivory" : "text-burgundy")}>SHRIING</span>
      </span>
    </Link>
  );
}

export function AnnouncementBar() {
  const lang = useStore((s) => s.language);
  const { rate, delta } = useGoldRate();
  const msgs = [
    `${t(lang, "goldRateToday")} · 24K ₹${rate.toLocaleString("en-IN")}/g ${delta >= 0 ? "▲" : "▼"} ${Math.abs(delta)}`,
    t(lang, "announcementOffer"),
    t(lang, "announcementAkshaya"),
    t(lang, "announcementShipping"),
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % msgs.length), 4000);
    return () => clearInterval(id);
  }, [msgs.length]);
  return (
    <div className="bg-burgundy-dark text-[12px] tracking-wider text-gold-light">
      <div className="container-x flex h-9 items-center justify-between">
        <span className="hidden text-ivory/60 md:block">{t(lang, "tagline")}</span>
        <AnimatePresence mode="wait">
          <motion.span key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mx-auto md:mx-0">
            {msgs[i]}
          </motion.span>
        </AnimatePresence>
        <Link to="/gold-tools" className="hidden text-ivory/80 underline-offset-4 hover:underline md:block">{t(lang, "goldCalculator")}</Link>
      </div>
    </div>
  );
}

export function Navbar() {
  const lang = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);
  const cartCount = useStore((s) => s.cart.reduce((a, c) => a + c.qty, 0));
  const wishCount = useStore((s) => s.wishlist.length);
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const { setSearch, menuOpen, setMenu } = useUI();
  const [studios, setStudios] = useState(false);
  const [acct, setAcct] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    setStudios(false); setAcct(false); setLangOpen(false); setMenu(false);
  }, [loc.pathname, setMenu]);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { setStudios(false); setAcct(false); setLangOpen(false); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const links = [
    { to: "/", label: t(lang, "home"), end: true },
    { to: "/brands", label: t(lang, "brands") },
    { to: "/shop", label: t(lang, "shop") },
    { to: "/customize", label: t(lang, "customize") },
    { to: "/bridal", label: t(lang, "bridal") },
    { to: "/collections", label: t(lang, "collections") },
    { to: "/crafts", label: t(lang, "crafts") },
  ];
  const lk = ({ isActive }: { isActive: boolean }) =>
    cn("relative py-2 text-[13px] font-medium tracking-wide transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:text-burgundy hover:after:scale-x-100", isActive ? "text-burgundy after:scale-x-100" : "text-ink");

  return (
    <header ref={ref} className="sticky top-0 z-50 border-b border-sand/70 bg-ivory">
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 hover:bg-champagne xl:hidden" onClick={() => setMenu(!menuOpen)} aria-label="Menu"><Menu size={22} /></button>
          <Logo />
        </div>
        <nav className="hidden items-center gap-7 xl:flex" aria-label="Primary">
          {links.map((l) => (<NavLink key={l.to} to={l.to} end={l.end} className={lk}>{l.label}</NavLink>))}
          <div className="relative">
            <button onClick={() => { setStudios(!studios); setAcct(false); }} className="flex items-center gap-1 py-2 text-[13px] font-medium tracking-wide text-ink hover:text-burgundy" aria-expanded={studios}>
              {t(lang, "studios")} <ChevronDown size={14} className={cn("transition", studios && "rotate-180")} />
            </button>
            <AnimatePresence>
              {studios && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="absolute top-full -right-40 mt-3 grid w-[640px] grid-cols-2 gap-1 rounded-md border border-sand bg-white p-3 shadow-lift">
                  {studioLinks.map((s) => (
                    <Link key={s.to} to={s.to} className="flex items-start gap-3 rounded-sm p-3 transition hover:bg-champagne">
                      <span className="mt-0.5 rounded-full bg-champagne p-2 text-gold-dark"><s.icon size={16} /></span>
                      <span>
                        <span className="block text-sm font-medium text-burgundy-dark">{t(lang, s.id)}</span>
                        <span className="text-xs text-muted">{t(lang, `${s.id}Desc`)}</span>
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <div className="relative">
            <button onClick={() => { setLangOpen(!langOpen); setAcct(false); }} className="flex items-center gap-1 rounded-full p-2 text-xs hover:bg-champagne" aria-label="Language">
              <Globe size={19} /><span className="hidden uppercase sm:inline">{lang}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-44 max-w-[calc(100vw-1.5rem)] rounded-md border border-sand bg-white p-1.5 shadow-lift z-50">
                {languages.map((l) => (
                  <button key={l.code} onClick={() => { setLanguage(l.code as LangCode); setLangOpen(false); }} className={cn("flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm hover:bg-champagne", lang === l.code && "bg-champagne font-medium text-burgundy")}>
                    {l.native}<span className="text-xs text-muted">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setSearch(true)} className="rounded-full p-2 hover:bg-champagne" aria-label={t(lang, "search")}><Search size={20} /></button>
          <Link to="/account/wishlist" className="relative rounded-full p-2 hover:bg-champagne" aria-label={t(lang, "wishlist")}>
            <Heart size={20} />
            {wishCount > 0 && <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] text-ivory">{wishCount}</span>}
          </Link>
          <div className="relative">
            <button onClick={() => { setAcct(!acct); setLangOpen(false); }} className="rounded-full p-2 hover:bg-champagne" aria-label={t(lang, "account")}><User size={20} /></button>
            {acct && (
              <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-md border border-sand bg-white p-2 shadow-lift z-50">
                {user ? (
                  <>
                    <div className="border-b border-sand px-3 pt-2 pb-3">
                      <p className="font-serif text-lg text-burgundy-dark">{user.name}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </div>
                    {[
                      ["/account", t(lang, "myDashboard")],
                      ["/account/orders", t(lang, "myOrders")],
                      ["/account/wishlist", t(lang, "wishlist")],
                      ["/account/designs", t(lang, "savedDesigns")],
                    ].map(([to, l]) => (<Link key={to} to={to} className="block rounded-sm px-3 py-2 text-sm hover:bg-champagne">{l}</Link>))}
                    <button onClick={() => { logout(); nav("/"); }} className="w-full rounded-sm px-3 py-2 text-left text-sm text-burgundy hover:bg-champagne">{t(lang, "signOut")}</button>
                  </>
                ) : (
                  <div className="space-y-2 p-2">
                    <Link to="/login" className="btn btn-primary w-full">{t(lang, "signIn")}</Link>
                    <Link to="/register" className="btn btn-outline w-full">{t(lang, "createAccount")}</Link>
                  </div>
                )}
                <div className="mt-1 border-t border-sand px-3 pt-2 pb-1 text-[10px] font-semibold tracking-widest text-muted uppercase">{t(lang, "portalsDemo")}</div>
                <Link to="/admin" className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-champagne"><LayoutDashboard size={15} /> {t(lang, "admin")}</Link>
                <Link to="/brand-owner" className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-champagne"><Store size={15} /> {t(lang, "brandOwner")}</Link>
                <Link to="/artisan" className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-champagne"><Wrench size={15} /> {t(lang, "artisan")}</Link>
              </div>
            )}
          </div>
          <Link to="/cart" className="relative rounded-full p-2 hover:bg-champagne" aria-label={t(lang, "cart")}>
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] text-ivory">{cartCount}</span>}
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-x-0 top-full z-40 max-h-[calc(100vh-72px)] overflow-y-auto border-b border-sand bg-ivory shadow-lift xl:hidden">
            <div className="container-x py-6">
              <button onClick={() => setMenu(false)} className="absolute top-3 right-4 hidden"><X /></button>
              <div className="flex flex-col">
                {links.map((l) => (<Link key={l.to} to={l.to} className="border-b border-sand py-4 font-serif text-2xl text-burgundy-dark">{l.label}</Link>))}
              </div>
              <p className="eyebrow mt-8 mb-3">{t(lang, "studiosAndTools")}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {studioLinks.map((s) => (
                  <Link key={s.to} to={s.to} className="flex items-center gap-3 rounded-sm border border-sand bg-white p-3 text-sm">
                    <s.icon size={16} className="text-gold-dark" />{t(lang, s.id)}
                  </Link>
                ))}
              </div>
              <div className="mt-6 flex gap-3 text-sm">
                <Link to="/admin" className="btn btn-outline btn-sm">{t(lang, "admin")}</Link>
                <Link to="/brand-owner" className="btn btn-outline btn-sm">{t(lang, "brandOwner")}</Link>
                <Link to="/artisan" className="btn btn-outline btn-sm">{t(lang, "artisan")}</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
