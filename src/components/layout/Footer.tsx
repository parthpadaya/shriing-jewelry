import { AtSign, Globe, Mail, MapPin, Phone, Play, Share2 } from "lucide-react";
const Instagram = AtSign, Facebook = Globe, Twitter = Share2, Youtube = Play;
import { Link } from "react-router-dom";
import { brands } from "@/data/brands";
import { Logo } from "./Navbar";
import { toast, useStore } from "@/store/useStore";
import { t } from "@/utils/i18n";

export function Footer() {
  const lang = useStore((s) => s.language);

  return (
    <footer className="bg-burgundy-dark text-ivory/80">
      <div className="container-x grid gap-8 sm:gap-12 py-12 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1.6fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 sm:mt-5 max-w-xs font-serif text-lg sm:text-xl text-gold-light italic">{t(lang, "tagline")}</p>
          <p className="mt-3 sm:mt-4 max-w-xs text-xs sm:text-sm leading-relaxed text-ivory/60">{t(lang, "footerAbout")}</p>
          <div className="mt-5 sm:mt-6 flex gap-3">
            {[Instagram, Facebook, Twitter, Youtube].map((I, i) => (
              <button key={i} onClick={() => toast("Social profile opens in the live site")} aria-label="Social link" className="rounded-full border border-gold/40 p-2 sm:p-2.5 text-gold-light transition hover:bg-gold hover:text-burgundy-dark"><I size={15} /></button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 sm:mb-4 font-serif text-lg sm:text-xl text-ivory">{t(lang, "ourBrands")}</h4>
          <ul className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm">
            {brands.map((b) => (<li key={b.slug}><Link to={`/brands/${b.slug}`} className="transition hover:text-gold-light truncate block">{b.name}</Link></li>))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 sm:mb-4 font-serif text-lg sm:text-xl text-ivory">{t(lang, "explore")}</h4>
          <ul className="space-y-2 text-xs sm:text-sm">
            {[
              ["/shop", t(lang, "shopAll")],
              ["/customize", t(lang, "customizationStudio")],
              ["/bridal", t(lang, "bridal")],
              ["/ai-stylist", t(lang, "aiStylist")],
              ["/crafts", t(lang, "crafts")],
              ["/gifting", t(lang, "personalizedGifting")],
              ["/gold-tools", t(lang, "goldTools")],
              ["/registry", t(lang, "registry")],
            ].map(([to, l]) => (<li key={to}><Link to={to} className="transition hover:text-gold-light">{l}</Link></li>))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 sm:mb-4 font-serif text-lg sm:text-xl text-ivory">{t(lang, "customerCare")}</h4>
          <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
            <li className="flex items-center gap-2"><Phone size={14} className="text-gold-light shrink-0" /> 1800-123-SHRI (7474)</li>
            <li className="flex items-center gap-2"><Mail size={14} className="text-gold-light shrink-0" /> care@shriing.in</li>
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-gold-light" /> Johari Bazaar, Jaipur 302003</li>
          </ul>
          <ul className="mt-4 sm:mt-5 space-y-2 text-xs sm:text-sm">
            {[
              ["/account/orders", t(lang, "trackOrder")],
              ["/account", t(lang, "myAccount")],
              ["/admin", t(lang, "adminPortal")],
              ["/brand-owner", t(lang, "brandOwnerPortal")],
              ["/artisan", t(lang, "artisanWorkspace")],
            ].map(([to, l]) => (<li key={to}><Link to={to} className="transition hover:text-gold-light">{l}</Link></li>))}
          </ul>
        </div>
      </div>
      <div className="border-t border-gold/20">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-ivory/50 md:flex-row">
          <p className="text-center md:text-left">{t(lang, "copyright")}</p>
          <div className="flex flex-wrap gap-3 sm:gap-5 justify-center md:justify-end text-center">
            {[
              t(lang, "privacyPolicy"),
              t(lang, "termsOfService"),
              t(lang, "shippingReturns"),
              t(lang, "bisHallmarkPolicy"),
              t(lang, "lifetimeExchange"),
            ].map((p) => (
              <button key={p} onClick={() => toast(`${p} — available in the live site`)} className="transition hover:text-gold-light">{p}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
