import { Gift, ShoppingBag } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHero, Reveal } from "@/components/common/ui";
import { ProductCard } from "@/components/product/ProductCard";
import { birthstones, giftOccasions } from "@/data/collections";
import { IMG, pools } from "@/data/images";
import { products } from "@/data/products";
import { useDocumentTitle } from "@/hooks";
import { toast, useStore } from "@/store/useStore";
import { inr } from "@/utils/format";
import { cn } from "@/utils/cn";

const items = [
  { id: "pendant", label: "Name Pendant", price: 18500, image: pools.pendant[0] },
  { id: "ring", label: "Initial Ring", price: 24800, image: pools.ring[1] },
  { id: "bracelet", label: "Engraved Bracelet", price: 9800, image: pools.pearl[0] },
  { id: "studs", label: "Birthstone Studs", price: 12400, image: pools.earring[3] },
];
const packs = [{ id: "Classic", price: 0 }, { id: "Signature Box", price: 499 }, { id: "Luxury Wooden Chest", price: 1499 }];

export default function GiftingPage() {
  useDocumentTitle("Personalized Gifting");
  const [params] = useSearchParams();
  const [occasion, setOccasion] = useState(giftOccasions.find((g) => g.id === params.get("occasion"))?.id ?? "Birthday");
  const [item, setItem] = useState("pendant");
  const [name, setName] = useState("Aarohi");
  const [initial, setInitial] = useState("A");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("July");
  const [message, setMessage] = useState("");
  const [pack, setPack] = useState("Signature Box");
  const [note, setNote] = useState(giftOccasions[0].note);
  const addToCart = useStore((s) => s.addToCart);
  const saveDesign = useStore((s) => s.saveDesign);
  const id = useId().replace(/:/g, "");
  const occ = giftOccasions.find((g) => g.id === occasion)!;
  const it = items.find((i) => i.id === item)!;
  const stone = birthstones.find((b) => b.month === month)!;
  const total = it.price + packs.find((p) => p.id === pack)!.price + (message ? 400 : 0);

  useEffect(() => { setNote(occ.note); }, [occ.note]);
  useEffect(() => { if (date) { const m = new Date(date).toLocaleString("en-US", { month: "long" }); if (birthstones.some((b) => b.month === m)) setMonth(m); } }, [date]);

  const meta = [`Occasion: ${occasion}`, `Name: ${name}`, `Initial: ${initial}`, `Birthstone: ${stone.stone}`, ...(date ? [`Date: ${date}`] : []), ...(message ? [`Engraved: ${message}`] : []), `Packaging: ${pack}`];
  const add = () => { addToCart({ kind: "gift", name: `${it.label} — ${occasion} Gift`, brand: "SHRIING Gifting", image: it.image, price: total, meta: [...meta, `Note: ${note.slice(0, 60)}`] }); toast("Personalized gift added to cart"); };

  return (
    <>
      <PageHero eyebrow="Personalized Gifting" title="Give Something That Knows Their Name" sub="Eight occasions, endless ways to personalise — name, initial, date, birthstone, message and a handwritten note." image={IMG.pearl} />
      <div className="container-x py-12">
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">{giftOccasions.map((g) => (<button key={g.id} onClick={() => setOccasion(g.id)} className={cn("chip shrink-0 px-5 py-2.5 text-sm", occasion === g.id && "chip-active")}><Gift size={14} />{g.id}</button>))}</div>
        <p className="mt-3 text-muted">{occ.blurb}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="card space-y-6 p-6 md:p-8">
            <div><p className="label">Choose the gift</p><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{items.map((i) => (<button key={i.id} onClick={() => setItem(i.id)} className={cn("overflow-hidden rounded-sm border text-left transition", item === i.id ? "border-burgundy shadow-soft" : "border-sand")}><img src={i.image} alt="" className="aspect-square w-full object-cover" /><div className="p-2"><p className="text-xs font-medium">{i.label}</p><p className="text-xs text-muted">{inr(i.price)}</p></div></button>))}</div></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label><span className="label">Name</span><input className="input" maxLength={14} value={name} onChange={(e) => { setName(e.target.value); setInitial(e.target.value[0]?.toUpperCase() ?? ""); }} /></label>
              <label><span className="label">Initial</span><input className="input" maxLength={1} value={initial} onChange={(e) => setInitial(e.target.value.toUpperCase())} /></label>
              <label><span className="label">Special date</span><input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} /></label>
              <label><span className="label">Birthstone</span><select className="input" value={month} onChange={(e) => setMonth(e.target.value)}>{birthstones.map((b) => (<option key={b.month} value={b.month}>{b.month} — {b.stone}</option>))}</select></label>
            </div>
            <label className="block"><span className="label">Message engraving (+₹400)</span><input className="input" maxLength={24} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g. Forever & always" /></label>
            <div><p className="label">Gift packaging</p><div className="flex flex-wrap gap-2">{packs.map((p) => (<button key={p.id} onClick={() => setPack(p.id)} className={cn("chip", pack === p.id && "chip-active")}>{p.id} {p.price ? `+${inr(p.price)}` : "· Free"}</button>))}</div></div>
            <label className="block"><span className="label">Personalized note (printed on card)</span><textarea className="input min-h-24" value={note} onChange={(e) => setNote(e.target.value)} maxLength={160} /></label>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="card overflow-hidden">
              <div className="relative bg-gradient-to-b from-champagne to-ivory p-6">
                <svg viewBox="0 0 400 300" className="w-full" role="img" aria-label="Gift preview">
                  <defs><linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F7E394" /><stop offset=".5" stopColor="#D4AF37" /><stop offset="1" stopColor="#8F6F24" /></linearGradient><radialGradient id={`${id}s`} cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#fff" /><stop offset=".4" stopColor={stone.hex} /><stop offset="1" stopColor={stone.hex} stopOpacity=".7" /></radialGradient></defs>
                  <rect x="30" y="170" width="340" height="110" rx="8" fill="#6b1a2b" /><rect x="30" y="170" width="340" height="30" rx="8" fill="#4a0f1d" /><rect x="190" y="170" width="20" height="110" fill="#d9bb73" opacity=".85" />
                  <path d="M200 20 Q200 70 200 110" stroke={`url(#${`${id}g`})`} strokeWidth="3" fill="none" />
                  <path d="M120 10 Q200 130 280 10" stroke={`url(#${id}g)`} strokeWidth="3" strokeDasharray="6 4" fill="none" />
                  <g transform="translate(200 135)"><circle r="30" fill={`url(#${id}g)`} stroke="#8F6F24" /><circle r="23" fill="none" stroke="rgba(255,255,255,.5)" /><text y="11" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontWeight="700" fontSize="32" fill="#6b4a12">{initial || "·"}</text><circle cx="22" cy="-22" r="9" fill={`url(#${id}s)`} stroke="#8F6F24" /></g>
                  <text x="200" y="232" textAnchor="middle" fontFamily="Pinyon Script, cursive" fontSize="34" fill="#F7E394">{name || "Your name"}</text>
                  <text x="200" y="256" textAnchor="middle" fontSize="10" letterSpacing="3" fill="#d9bb73" fontFamily="Inter">{(date || "DATE").toString().toUpperCase()} · {stone.stone.toUpperCase()}</text>
                </svg>
                <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium tracking-widest text-gold-dark uppercase">Live preview</span>
              </div>
              <div className="border-t border-sand p-6">
                <div className="rounded-sm border border-dashed border-gold/60 bg-ivory p-4 text-center"><p className="font-script text-3xl text-burgundy">{note || "Your note appears here"}</p>{message && <p className="mt-2 text-xs tracking-widest text-gold-dark uppercase">Engraved: {message}</p>}</div>
                <div className="mt-5 flex items-end justify-between"><div><p className="label mb-0">Gift total</p><p className="font-serif text-4xl text-burgundy-dark">{inr(total)}</p></div><p className="text-xs text-muted">{it.label} · {pack}</p></div>
                <div className="mt-5 grid grid-cols-2 gap-3"><button onClick={add} className="btn btn-primary"><ShoppingBag size={15} /> Add to cart</button><button onClick={() => { saveDesign({ kind: "gift", name: `${occasion} gift — ${name}`, price: total, options: { occasion, item, name, initial, pack, message }, summary: meta }); toast("Gift design saved"); }} className="btn btn-outline">Save design</button></div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="mt-24 text-center font-serif text-4xl text-burgundy-dark">More Gift Ideas</h2>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">{products.filter((p) => p.occasion === "Gifting").slice(0, 4).map((p, i) => (<Reveal key={p.id}><ProductCard p={p} index={i} compact /></Reveal>))}</div>
      </div>
    </>
  );
}
