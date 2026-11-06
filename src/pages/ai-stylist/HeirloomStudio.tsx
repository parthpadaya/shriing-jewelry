import { Gem, Hammer, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { ImageUpload } from "@/components/common/ImageUpload";
import { PageHero } from "@/components/common/ui";
import { IMG, pools } from "@/data/images";
import { useDocumentTitle, useLocalState, useObjectUrl } from "@/hooks";
import { toast } from "@/store/useStore";
import { metalRate } from "@/utils/customizer";
import { inr, uid } from "@/utils/format";
import { cn } from "@/utils/cn";

const sample = pools.necklace[5];
const concepts = [
  { id: "pendant", title: "Contemporary Pendant Set", desc: "The central motif becomes a pendant with matching studs — everyday elegance from a ceremonial piece.", image: pools.pendant[0], factor: 0.55, fee: 6500 },
  { id: "stack", title: "Stackable Bangles & Ring", desc: "Gold is reborn as slim kadas and a cocktail ring, with your stones set in a modern bezel.", image: pools.bangle[0], factor: 0.8, fee: 8500 },
  { id: "jhumka", title: "Heritage Jhumka Pair", desc: "Traditional repoussé patterns are condensed into lightweight jhumkas for festive wear.", image: pools.earring[1], factor: 0.4, fee: 5500 },
];

export default function HeirloomStudio() {
  useDocumentTitle("Heirloom Redesign Studio");
  const [preview, setFile] = useObjectUrl();
  const [useSample, setUseSample] = useState(false);
  const [preserve, setPreserve] = useState(true);
  const [modern, setModern] = useState(true);
  const [grams, setGrams] = useState(40);
  const [purity, setPurity] = useState("22K");
  const [generated, setGenerated] = useState(false);
  const [sel, setSel] = useState(0);
  const [pos, setPos] = useState(50);
  const [reqs, setReqs] = useLocalState<{ id: string; concept: string; price: number; date: string }[]>("shriing-heirloom-requests", []);

  const original = preview ?? (useSample ? sample : null);
  const c = concepts[sel];
  const goldCredit = grams * metalRate(purity) * 0.92;
  const price = (k: (typeof concepts)[number]) => Math.round(k.fee + grams * metalRate(purity) * 0.1 * (1 + k.factor) + (preserve ? 4500 : 12000) + (modern ? 2500 : 0));
  const net = (k: (typeof concepts)[number]) => Math.max(price(k) - goldCredit * 0.2, 0);

  return (
    <>
      <PageHero eyebrow="Heirloom Redesign Studio" title="Old Gold. New Story." sub="Upload a photograph of your family jewelry — we keep the gemstones and the memories, and reimagine the design." image={IMG.gold} />
      <div className="container-x py-12">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <div className="card h-fit space-y-6 p-6">
            <div><p className="label">1. Your original piece</p><ImageUpload preview={original} onFile={(f) => { setFile(f); if (f) setUseSample(false); setGenerated(false); }} label="Upload old jewelry photo" aspect="aspect-square" />{!original && <button onClick={() => setUseSample(true)} className="mt-2 text-xs text-burgundy underline underline-offset-4">No photo handy? Use a sample heirloom</button>}</div>
            <div className="space-y-3"><p className="label">2. Redesign preferences</p>
              {[[preserve, setPreserve, "Preserve original gemstones", Gem], [modern, setModern, "Modernize traditional patterns", Hammer]].map(([v, set, l, Ic]) => { const I = Ic as typeof Gem; return (<label key={l as string} className="flex cursor-pointer items-center gap-3 rounded-sm border border-sand p-3 text-sm"><input type="checkbox" className="h-4 w-4 accent-burgundy" checked={v as boolean} onChange={(e) => (set as (b: boolean) => void)(e.target.checked)} /><I size={16} className="text-gold-dark" /> {l as string}</label>); })}
            </div>
            <div><div className="flex justify-between"><span className="label">3. Approx. weight of old gold</span><span className="text-sm text-burgundy">{grams} g</span></div><input type="range" min={5} max={200} value={grams} onChange={(e) => setGrams(+e.target.value)} className="w-full accent-burgundy" aria-label="Weight" /></div>
            <label className="block"><span className="label">Purity</span><select className="input" value={purity} onChange={(e) => setPurity(e.target.value)}>{["24K", "22K", "18K", "14K"].map((p) => (<option key={p}>{p}</option>))}</select></label>
            <button disabled={!original} onClick={() => { setGenerated(true); toast("3 redesign concepts ready"); }} className="btn btn-primary w-full py-4"><Sparkles size={16} /> Generate redesign concepts</button>
            {!original && <p className="text-center text-xs text-muted">Upload a photo or use the sample to begin.</p>}
          </div>

          <div>
            {!generated ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-md border border-dashed border-gold/50 bg-white/60 p-10 text-center"><ShieldCheck size={36} className="text-gold" strokeWidth={1.3} /><h2 className="mt-4 font-serif text-3xl text-burgundy-dark">Concept cards will appear here</h2><p className="mt-2 max-w-md text-sm text-muted">Every redesign is documented, weighed and insured. Your gemstones are photographed before and after.</p></div>
            ) : (
              <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-3">
                  {concepts.map((k, i) => (
                    <button key={k.id} onClick={() => setSel(i)} className={cn("card overflow-hidden text-left transition", sel === i && "ring-2 ring-burgundy")}>
                      <img src={k.image} alt="" className="aspect-square w-full object-cover" /><div className="p-4"><h3 className="font-serif text-xl text-burgundy-dark">{k.title}</h3><p className="mt-1 text-xs text-muted">{k.desc}</p><p className="mt-3 font-serif text-2xl text-burgundy">{inr(price(k))}</p><p className="text-[11px] text-muted">est. redesign cost</p></div>
                    </button>
                  ))}
                </div>
                <div className="card p-6">
                  <h3 className="font-serif text-3xl text-burgundy-dark">Compare: original vs. proposed</h3>
                  <div className="relative mt-5 aspect-[16/10] select-none overflow-hidden rounded-md bg-champagne">
                    <img src={c.image} alt="Proposed design" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}><img src={original!} alt="Original piece" className="h-full w-full object-cover" /></div>
                    <div className="absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }}><span className="absolute top-1/2 -left-4 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xs text-burgundy shadow-lift">⇆</span></div>
                    <span className="absolute top-3 left-3 rounded-sm bg-black/60 px-2 py-1 text-[11px] tracking-widest text-white uppercase">Original</span><span className="absolute top-3 right-3 rounded-sm bg-burgundy px-2 py-1 text-[11px] tracking-widest text-ivory uppercase">Proposed</span>
                    <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(+e.target.value)} className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" aria-label="Compare slider" />
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-sm bg-champagne/70 p-4"><p className="label mb-1">Old gold credit</p><p className="font-serif text-2xl">{inr(goldCredit)}</p><p className="text-[11px] text-muted">{grams} g · {purity} · indicative</p></div>
                    <div className="rounded-sm bg-champagne/70 p-4"><p className="label mb-1">Redesign charges</p><p className="font-serif text-2xl">{inr(price(c))}</p><p className="text-[11px] text-muted">design + setting + labour</p></div>
                    <div className="rounded-sm bg-burgundy p-4 text-ivory"><p className="mb-1 text-[11px] tracking-wider text-gold-light uppercase">Estimated payable</p><p className="font-serif text-2xl">{inr(net(c))}</p><p className="text-[11px] text-ivory/60">after partial gold credit</p></div>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">{preserve && <li>✓ Original gemstones preserved & re-set</li>}{modern && <li>✓ Traditional patterns modernised</li>}<li>✓ Before/after weight certificate</li><li>✓ 3–4 weeks delivery</li></ul>
                  <button onClick={() => { setReqs([{ id: uid("hr"), concept: c.title, price: price(c), date: new Date().toISOString() }, ...reqs]); toast("Redesign request sent to Kanchan & Co."); }} className="btn btn-primary mt-6">Request this redesign</button>
                </div>
                {reqs.length > 0 && <div className="card p-6"><h3 className="font-serif text-2xl">Your redesign requests</h3><ul className="mt-3 divide-y divide-sand text-sm">{reqs.map((r) => (<li key={r.id} className="flex justify-between py-2"><span>{r.concept}<span className="ml-2 text-xs text-muted">{new Date(r.date).toLocaleDateString("en-IN")}</span></span><span className="text-emerald-700">Submitted · {inr(r.price)}</span></li>))}</ul></div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
