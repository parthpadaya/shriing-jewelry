import { Sparkles } from "lucide-react";
import { useState } from "react";
import { ImageUpload } from "@/components/common/ImageUpload";
import { PageHero } from "@/components/common/ui";
import { LookCard } from "@/components/product/LookCard";
import { outfitColors } from "@/data/collections";
import { IMG } from "@/data/images";
import { toast } from "@/store/useStore";
import { useDocumentTitle, useObjectUrl } from "@/hooks";
import { dominantColor } from "@/utils/image";
import { recommend, type Look } from "@/utils/stylist";
import { compactInr } from "@/utils/format";
import { cn } from "@/utils/cn";

export default function LehengaMatch() {
  useDocumentTitle("Lehenga Match Studio");
  const [preview, setFile] = useObjectUrl();
  const [color, setColor] = useState("Red");
  const [occasion, setOccasion] = useState("Wedding");
  const [budget, setBudget] = useState(200000);
  const [looks, setLooks] = useState<Look[] | null>(null);
  const [busy, setBusy] = useState(false);
  const col = outfitColors.find((c) => c.name === color)!;

  const onFile = async (f: File | null) => {
    setFile(f);
    if (f) { const url = URL.createObjectURL(f); const c = await dominantColor(url); setColor(c); toast(`Detected outfit colour: ${c}`); URL.revokeObjectURL(url); }
  };
  const generate = () => {
    setBusy(true); setLooks(null);
    setTimeout(() => { setLooks([0, 1, 2].map((v) => recommend({ color, occasion, budget, prefs: v === 1 ? ["Contemporary"] : v === 2 ? ["Statement"] : ["Traditional"] }, v))); setBusy(false); }, 1100);
  };

  return (
    <>
      <PageHero eyebrow="Lehenga Match Studio" title="Match Jewelry to Your Outfit" sub="Upload your saree or lehenga, confirm the colour and we'll assemble coordinated jewelry combinations." image={IMG.bridalB} />
      <div className="container-x py-12">
        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="card h-fit space-y-6 p-6">
            <div><p className="label">1. Upload outfit</p><ImageUpload preview={preview} onFile={onFile} label="Upload saree or lehenga photo" aspect="aspect-[4/5]" /></div>
            <div><p className="label">2. Outfit colour {preview && <span className="normal-case text-gold-dark">(auto-detected, editable)</span>}</p><div className="flex flex-wrap gap-3">{outfitColors.map((c) => (<button key={c.name} onClick={() => setColor(c.name)} title={c.name} aria-label={c.name} aria-pressed={color === c.name} className={cn("h-9 w-9 rounded-full border-2 transition", color === c.name ? "scale-110 border-burgundy" : "border-white ring-1 ring-sand")} style={{ background: c.hex }} />))}</div><p className="mt-2 text-xs text-muted">Selected: {color} <span className="ml-1 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ background: col.hex }} /></p></div>
            <label className="block"><span className="label">3. Occasion</span><select className="input" value={occasion} onChange={(e) => setOccasion(e.target.value)}>{["Bridal", "Wedding", "Festive", "Party", "Engagement", "Daily Wear"].map((o) => (<option key={o}>{o}</option>))}</select></label>
            <div><div className="flex justify-between"><span className="label">4. Budget</span><span className="text-sm text-burgundy">{compactInr(budget)}</span></div><input type="range" min={25000} max={1000000} step={5000} value={budget} onChange={(e) => setBudget(+e.target.value)} className="w-full accent-burgundy" aria-label="Budget" /></div>
            <button onClick={generate} disabled={busy} className="btn btn-primary w-full py-4"><Sparkles size={16} /> {busy ? "Matching…" : "Generate matching jewelry"}</button>
          </div>
          <div>
            {!looks && !busy && <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed border-gold/50 bg-white/60 p-10 text-center"><div className="mb-5 flex gap-2">{outfitColors.slice(0, 6).map((c) => (<span key={c.name} className="h-8 w-8 rounded-full" style={{ background: c.hex }} />))}</div><h2 className="font-serif text-3xl text-burgundy-dark">Your coordinated looks appear here</h2><p className="mt-2 max-w-sm text-sm text-muted">Three combinations — Classic, Contemporary and Statement — each with necklace, earrings, bangles and maang tikka.</p></div>}
            {busy && <div className="flex min-h-[400px] items-center justify-center"><div className="text-center"><div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-sand border-t-burgundy" /><p className="mt-4 font-serif text-2xl text-burgundy-dark">Reading the colours of your {color.toLowerCase()} outfit…</p></div></div>}
            {looks && <div className="space-y-6">{looks.map((l) => (<LookCard key={l.title} look={l} budget={budget} />))}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
