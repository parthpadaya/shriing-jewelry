import { Calculator, Coins, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHero, Tabs } from "@/components/common/ui";
import { IMG } from "@/data/images";
import { useDocumentTitle, useGoldRate } from "@/hooks";
import { toast } from "@/store/useStore";
import { inr } from "@/utils/format";

const purityFactor: Record<string, number> = { "24K": 1, "22K": 0.9167, "18K": 0.75, "14K": 0.585 };

export default function GoldTools() {
  useDocumentTitle("Gold Price Calculator & Exchange");
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "exchange" ? "exchange" : "calc";
  const { rate, delta } = useGoldRate();
  const [purity, setPurity] = useState("22K");
  const [weight, setWeight] = useState(20);
  const [making, setMaking] = useState(12);
  const [stone, setStone] = useState(0);
  const [exPurity, setExPurity] = useState("22K");
  const [exWeight, setExWeight] = useState(15);
  const [loss, setLoss] = useState(4);

  const gold = weight * rate * purityFactor[purity];
  const mk = gold * (making / 100);
  const gst = (gold + stone) * 0.03 + mk * 0.05;
  const total = gold + mk + stone + gst;
  const exValue = exWeight * rate * purityFactor[exPurity] * (1 - loss / 100);

  return (
    <>
      <PageHero eyebrow="Gold Tools" title="Know Your Gold" sub="A simulated live gold rate with a transparent price calculator and an indicative old-gold exchange value." image={IMG.gold} />
      <div className="container-x py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-5 rounded-md bg-burgundy-dark p-6 text-ivory sm:flex-row sm:items-center">
            <div><p className="eyebrow text-gold-light">Live 24K rate (simulated)</p><p className="font-serif text-5xl">{inr(rate)}<span className="text-lg text-ivory/60"> / gram</span></p></div>
            <div className="flex gap-6 text-sm">{(["24K", "22K", "18K", "14K"] as const).map((k) => (<div key={k}><p className="text-ivory/60">{k}</p><p className="font-medium">{inr(rate * purityFactor[k])}</p></div>))}</div>
            <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm ${delta >= 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>{delta >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}{Math.abs(delta)} today</span>
          </div>
          <Tabs value={tab} onChange={(t) => setParams(t === "exchange" ? { tab: "exchange" } : {})} tabs={[{ id: "calc", label: "Price Calculator", icon: <Calculator size={15} /> }, { id: "exchange", label: "Old Gold Exchange", icon: <Coins size={15} /> }]} className="w-fit" />
          {tab === "calc" ? (
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div className="card space-y-6 p-6">
                <div><p className="label">Purity</p><div className="flex gap-2">{Object.keys(purityFactor).map((p) => (<button key={p} onClick={() => setPurity(p)} className={`chip ${purity === p ? "chip-active" : ""}`}>{p}</button>))}</div></div>
                <div><div className="flex justify-between"><span className="label">Weight</span><span className="text-sm text-burgundy">{weight} g</span></div><input type="range" min={1} max={200} value={weight} onChange={(e) => setWeight(+e.target.value)} className="w-full accent-burgundy" aria-label="Weight" /><input type="number" className="input mt-2" value={weight} min={0.1} step={0.1} onChange={(e) => setWeight(Math.max(0, +e.target.value))} aria-label="Weight in grams" /></div>
                <div><div className="flex justify-between"><span className="label">Making charges</span><span className="text-sm text-burgundy">{making}%</span></div><input type="range" min={3} max={25} value={making} onChange={(e) => setMaking(+e.target.value)} className="w-full accent-burgundy" aria-label="Making charges" /></div>
                <label className="block"><span className="label">Stone / other charges (₹)</span><input type="number" className="input" value={stone} min={0} onChange={(e) => setStone(Math.max(0, +e.target.value))} /></label>
              </div>
              <div className="card h-fit p-6">
                <h2 className="font-serif text-3xl text-burgundy-dark">Price breakup</h2>
                <dl className="mt-5 space-y-3 text-sm">{[[`Gold value (${weight} g × ${purity})`, gold], [`Making charges (${making}%)`, mk], ["Stone & other charges", stone], ["GST (3% metal + 5% making)", gst]].map(([k, v]) => (<div key={k as string} className="flex justify-between border-b border-sand/70 pb-3"><dt className="text-muted">{k}</dt><dd>{inr(v as number)}</dd></div>))}</dl>
                <div className="mt-5 flex items-end justify-between"><span className="label mb-0">Final price</span><span className="font-serif text-5xl text-burgundy-dark">{inr(total)}</span></div>
                <p className="mt-3 text-xs text-muted">Indicative only. Final price is confirmed at billing using the live rate.</p>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div className="card space-y-6 p-6">
                <div><p className="label">Purity of your old gold</p><div className="flex gap-2">{Object.keys(purityFactor).map((p) => (<button key={p} onClick={() => setExPurity(p)} className={`chip ${exPurity === p ? "chip-active" : ""}`}>{p}</button>))}</div></div>
                <div><div className="flex justify-between"><span className="label">Weight</span><span className="text-sm text-burgundy">{exWeight} g</span></div><input type="range" min={1} max={200} value={exWeight} onChange={(e) => setExWeight(+e.target.value)} className="w-full accent-burgundy" aria-label="Weight" /></div>
                <div><div className="flex justify-between"><span className="label">Melting / wastage deduction</span><span className="text-sm text-burgundy">{loss}%</span></div><input type="range" min={0} max={10} step={0.5} value={loss} onChange={(e) => setLoss(+e.target.value)} className="w-full accent-burgundy" aria-label="Deduction" /></div>
              </div>
              <div className="card h-fit p-6">
                <h2 className="font-serif text-3xl text-burgundy-dark">Indicative exchange value</h2>
                <p className="mt-4 font-serif text-6xl text-burgundy">{inr(exValue)}</p>
                <p className="mt-2 text-sm text-muted">{exWeight} g of {exPurity} gold · {(exWeight * purityFactor[exPurity]).toFixed(2)} g pure gold equivalent</p>
                <ul className="mt-5 space-y-1.5 text-xs text-muted"><li>✓ Valid against any SHRIING brand purchase</li><li>✓ Final value after purity testing (XRF) in store or at pickup</li><li>✓ Free doorstep pickup in 40+ cities</li></ul>
                <button onClick={() => toast(`${inr(exValue)} credit noted for your next purchase (demo)`)} className="btn btn-primary mt-6 w-full">Use as credit on next order</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
