import { Check, Save, Sparkles, Trash2, ShoppingBag, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageHero } from "@/components/common/ui";
import { bridalComponents, bridalStyles, budgetTiers, outfitColors } from "@/data/collections";
import { IMG } from "@/data/images";
import { products } from "@/data/products";
import { useDocumentTitle } from "@/hooks";
import { toast, useStore } from "@/store/useStore";
import { fmtDate, inr } from "@/utils/format";
import { cn } from "@/utils/cn";

const craftHint: Record<string, RegExp> = {
  "South Indian": /temple|kerala|tamil|chettinad|lakshmi/i,
  "Kerala & Malabar": /kerala|palakka|manga|kasu|temple/i,
  "Tamil Nadu & Chettinad": /tamil|chettinad|thanjavur|nakshi|kemp|vanki/i,
  "Karnataka & Coorg": /mysore|coorg|gandaberunda|kokkethathi|temple/i,
  Bengali: /bengali|filigree|bowbazar|shakha|bala|chik/i,
  "Odia & Tarakashi": /odisha|tarakashi|filigree|cuttack|belpatra/i,
  "Assamese & North East": /assamese|junbiri|dholbiri|lac|gamkharu/i,
  Rajasthani: /rajasthani|kundan|polki|borla|aad|marwar/i,
  Gujarati: /jadau|gujarat|pachchikam|haath phool/i,
  Maharashtrian: /maharashtrian|pearl|kolhapuri|thushi|nath|saaj/i,
  Punjabi: /punjabi|kundan|kada|patiala|chooda|kaleere/i,
  "Hyderabadi & Nizami": /pearl|hyderabad|satlada|chandbali|nizam|deccan/i,
  "Awadhi & Banarasi": /meenakari|awadh|banaras|jhoomar|passa|hansli/i,
  Kashmiri: /kashmir|dejhoor|pahari|tehri|filigree|chandrahaar/i,
};
const typeMap: Record<string, string[]> = {
  Necklace: ["Necklace"],
  Earrings: ["Earrings", "Jhumka"],
  "Maang Tikka": ["Maang Tikka"],
  "Matha Patti": ["Maang Tikka"],
  Nath: ["Nath"],
  Bangles: ["Bangle"],
  "Haath Phool": ["Bracelet", "Bangle"],
  Bajuband: ["Bangle", "Bracelet"],
  "Waist Belt": ["Waist Belt"],
  Rings: ["Ring"],
  Anklets: ["Anklet"],
};
const priority = ["Necklace", "Earrings", "Bangles", "Maang Tikka", "Matha Patti", "Nath", "Haath Phool", "Bajuband", "Rings", "Waist Belt", "Anklets"];

export default function BridalStudio() {
  useDocumentTitle("Bridal Studio");
  const [params] = useSearchParams();
  const [style, setStyle] = useState(bridalStyles.find((b) => b.id === params.get("style"))?.id ?? "South Indian");
  const [selected, setSelected] = useState<string[]>(["Necklace", "Earrings", "Maang Tikka", "Bangles"]);
  const [color, setColor] = useState("Red");
  const [tierId, setTierId] = useState("u3l");
  const bridal = useStore((s) => s.bridal);
  const saveBridal = useStore((s) => s.saveBridal);
  const deleteBridal = useStore((s) => s.deleteBridal);
  const addToCart = useStore((s) => s.addToCart);

  const st = bridalStyles.find((b) => b.id === style) ?? bridalStyles[0];
  const tier = budgetTiers.find((b) => b.id === tierId) ?? budgetTiers[2];
  const price = (id: string) => Math.round((bridalComponents.find((c) => c.id === id)!.price * st.mult * tier.factor) / 500) * 500;
  const total = selected.reduce((a, c) => a + price(c), 0);
  const over = total > tier.max;
  const col = outfitColors.find((c) => c.name === color) ?? outfitColors[0];

  const suggestion = (comp: string) => {
    const pool = products.filter((p) => (typeMap[comp] || [comp]).includes(p.type));
    const kw = comp === "Matha Patti" ? /matha patti|borla|nethi/i
      : comp === "Haath Phool" ? /haath phool|hathphool/i
      : comp === "Bajuband" ? /bajuband|vanki|armlet/i
      : comp === "Nath" ? /nath|nose/i
      : comp === "Waist Belt" ? /waist|kamarbandh|oddiyanam/i
      : null;
    const searchPool = kw ? (pool.filter((p) => kw.test(p.name)).length > 0 ? pool.filter((p) => kw.test(p.name)) : pool) : pool;
    const hint = craftHint[style] || /temple|kundan|gold|filigree/i;
    return searchPool.find((p) => hint.test(`${p.craft} ${p.stone} ${p.name}`)) ?? searchPool[0] ?? pool[0] ?? products[0];
  };

  const sel = useMemo(() => bridalComponents.filter((c) => selected.includes(c.id)), [selected]);
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const autoFit = () => {
    let cur = [...selected].sort((a, b) => priority.indexOf(a) - priority.indexOf(b));
    while (cur.length > 1 && cur.reduce((a, c) => a + price(c), 0) > tier.max) cur = cur.slice(0, -1);
    setSelected(cur);
    toast("Trimmed to fit your budget — essentials kept");
  };
  const buildComplete = () => { setSelected(bridalComponents.map((c) => c.id)); toast("Complete bridal set selected"); };
  const save = () => {
    if (!selected.length) return toast("Select at least one component");
    saveBridal({ name: `${style} Bridal Set`, style, color, budget: tier.label, components: sel.map((c) => ({ name: c.id, price: price(c.id) })), total });
    toast("Bridal collection saved");
  };
  const toCart = () => {
    if (!selected.length) return toast("Select at least one component");
    sel.forEach((c) => { const s = suggestion(c.id); addToCart({ kind: "bridal", name: `${style} ${c.id}`, brand: "SHRIING Bridal Studio", image: s.images[0], price: price(c.id), meta: [`Style: ${style}`, `Outfit: ${color}`, `Budget: ${tier.label}`] }); });
    toast(`${sel.length} bridal components added to cart`);
  };

  return (
    <>
      <PageHero eyebrow="Bridal Studio" title="Build Your Bridal Trousseau" sub="Pick a regional style, choose your components, match your outfit and set your budget — see the whole set come together." image={IMG.bridal} />
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_400px]">
        <div className="space-y-14">
          <section>
            <h2 className="font-serif text-3xl text-burgundy-dark"><span className="mr-3 text-gold">1.</span>Choose a regional bridal tradition</h2>
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {bridalStyles.map((b) => (
                <button key={b.id} onClick={() => setStyle(b.id)} className={cn("group relative overflow-hidden rounded-md text-left transition", style === b.id ? "ring-2 ring-burgundy ring-offset-2 ring-offset-ivory" : "opacity-90 hover:opacity-100")}>
                  <img src={b.image} alt="" loading="lazy" className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/90 via-transparent" />
                  {style === b.id && <span className="absolute top-2 right-2 rounded-full bg-burgundy p-1 text-ivory"><Check size={14} /></span>}
                  <span className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 font-serif text-sm sm:text-base md:text-xl text-ivory leading-tight">{b.id}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 rounded-md bg-champagne/60 p-4 sm:p-5"><p className="text-xs sm:text-sm text-muted">{st.blurb}</p><p className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs"><span className="font-semibold tracking-wider text-gold-dark uppercase">Signature pieces · </span>{st.signature.join(", ")}</p></div>
          </section>

          <section>
            <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-serif text-2xl sm:text-3xl text-burgundy-dark"><span className="mr-3 text-gold">2.</span>Select components</h2><button onClick={buildComplete} className="btn btn-outline btn-sm"><Wand2 size={14} /> Build complete set</button></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {bridalComponents.map((c) => {
                const on = selected.includes(c.id); const s = suggestion(c.id);
                return (
                  <button key={c.id} onClick={() => toggle(c.id)} aria-pressed={on} className={cn("flex items-center gap-3 sm:gap-4 rounded-md border p-2.5 sm:p-3 text-left transition", on ? "border-burgundy bg-white shadow-soft" : "border-sand bg-white/60 hover:border-gold")}>
                    <img src={s.images[0]} alt="" loading="lazy" className="h-14 w-14 sm:h-16 sm:w-16 rounded-sm object-cover shrink-0" />
                    <div className="flex-1 min-w-0"><p className="font-serif text-base sm:text-xl text-burgundy-dark truncate">{c.id}</p><p className="text-xs text-muted">from {inr(price(c.id))}</p></div>
                    <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full border", on ? "border-burgundy bg-burgundy text-ivory" : "border-sand")}>{on && <Check size={14} />}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl sm:text-3xl text-burgundy-dark"><span className="mr-3 text-gold">3.</span>Lehenga or saree colour</h2>
            <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-4">
              {outfitColors.map((c) => (<button key={c.name} onClick={() => setColor(c.name)} className="text-center" aria-pressed={color === c.name}><span className={cn("block h-10 w-10 sm:h-14 sm:w-14 rounded-full border-2 sm:border-4 transition", color === c.name ? "scale-110 border-burgundy" : "border-white ring-1 ring-sand")} style={{ background: c.hex }} /><span className="mt-1 block text-[10px] sm:text-[11px] text-muted">{c.name}</span></button>))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl sm:text-3xl text-burgundy-dark"><span className="mr-3 text-gold">4.</span>Your budget</h2>
            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">{budgetTiers.map((b) => (<button key={b.id} onClick={() => setTierId(b.id)} className={cn("chip px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm", tierId === b.id && "chip-active")}>{b.label}</button>))}</div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card overflow-hidden">
            <div className="relative h-44"><img src={st.image} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/90 to-transparent" /><div className="absolute inset-x-5 bottom-4 flex items-end justify-between text-ivory"><div><p className="eyebrow text-gold-light">Your bridal set</p><p className="font-serif text-3xl">{style}</p></div><span className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs"><span className="h-4 w-4 rounded-full border border-white" style={{ background: col.hex }} />{color}</span></div></div>
            <div className="p-5">
              {sel.length === 0 && <p className="py-6 text-center text-sm text-muted">Select components to build your set.</p>}
              <ul className="divide-y divide-sand">
                {sel.map((c) => { const s = suggestion(c.id); return (<li key={c.id} className="flex items-center gap-3 py-3"><img src={s.images[0]} alt="" className="h-12 w-12 rounded-sm object-cover" /><div className="flex-1"><p className="text-sm font-medium">{c.id}</p><Link to={`/product/${s.id}`} className="text-[11px] text-muted underline-offset-2 hover:underline">{s.name}</Link></div><p className="text-sm">{inr(price(c.id))}</p></li>); })}
              </ul>
              <div className="mt-3 flex items-end justify-between border-t border-sand pt-4"><div><p className="label mb-0">Estimated total</p><p className="font-serif text-4xl text-burgundy-dark">{inr(total)}</p></div><span className="text-xs text-muted">{tier.label}</span></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-sand"><div className={cn("h-full rounded-full transition-all", over ? "bg-red-600" : "bg-gold")} style={{ width: `${Math.min(100, (total / tier.max) * 100)}%` }} /></div>
              {over ? <div className="mt-3 rounded-sm bg-red-50 p-3 text-xs text-red-800">Over budget by {inr(total - tier.max)}. <button onClick={autoFit} className="font-semibold underline">Auto-fit to budget</button> or choose a higher tier.</div> : sel.length > 0 && <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700"><Sparkles size={13} /> {inr(tier.max - total)} left in your budget</p>}
              <div className="mt-5 grid grid-cols-2 gap-3"><button onClick={toCart} className="btn btn-primary col-span-2 py-4"><ShoppingBag size={16} /> Add components to cart</button><button onClick={save} className="btn btn-outline col-span-2"><Save size={15} /> Save bridal collection</button></div>
            </div>
          </div>
        </aside>
      </div>

      <section className="container-x pb-24 lg:pb-20">
        <h2 className="font-serif text-3xl sm:text-4xl text-burgundy-dark">Saved Bridal Collections</h2>
        {bridal.length === 0 ? <p className="mt-4 text-sm text-muted">Nothing saved yet. Build a set above and press “Save bridal collection”.</p> : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{bridal.map((b) => (<div key={b.id} className="card p-5"><div className="flex items-start justify-between"><div><h3 className="font-serif text-2xl">{b.name}</h3><p className="text-xs text-muted">{b.color} · {b.budget} · {fmtDate(b.createdAt)}</p></div><button onClick={() => { deleteBridal(b.id); toast("Collection removed"); }} aria-label="Delete" className="text-muted hover:text-red-700"><Trash2 size={16} /></button></div><p className="mt-3 text-sm text-muted">{b.components.map((c) => c.name).join(" · ")}</p><p className="mt-3 font-serif text-2xl text-burgundy">{inr(b.total)}</p></div>))}</div>
        )}
      </section>

      {/* Floating mobile action bar for quick carting */}
      {sel.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-sand bg-white/95 px-4 py-3 shadow-lift backdrop-blur-md lg:hidden">
          <div className="min-w-0 pr-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted truncate">{sel.length} items · {style}</p>
            <p className="font-serif text-xl font-bold text-burgundy-dark">{inr(total)}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={save} className="btn btn-outline btn-sm px-3 py-2 text-xs">
              <Save size={13} /> Save
            </button>
            <button onClick={toCart} className="btn btn-primary btn-sm px-4 py-2 text-xs">
              <ShoppingBag size={14} /> Add to Cart
            </button>
          </div>
        </div>
      )}
    </>
  );
}
