import { Camera, CheckCircle2, Circle, Hammer, ImagePlus, LayoutDashboard, Trophy, UserRound, Workflow } from "lucide-react";
import { useRef, useState } from "react";
import { DashboardLayout, type NavItem } from "@/components/dashboard/DashboardLayout";
import { StatusPill } from "@/components/dashboard/ManageTable";
import { Stat } from "@/components/common/ui";
import { crafts } from "@/data/collections";
import { pools } from "@/data/images";
import { adminArtisans } from "@/data/mockOrders";
import { useDocumentTitle, useLocalState, useMockCollection } from "@/hooks";
import { toast } from "@/store/useStore";
import { inr } from "@/utils/format";
import { cn } from "@/utils/cn";

const nav: NavItem[] = [
  { to: "/artisan", label: "Profile & Craft", icon: UserRound, end: true },
  { to: "/artisan/orders", label: "Assigned Orders", icon: LayoutDashboard },
  { to: "/artisan/timeline", label: "Production Timeline", icon: Workflow },
  { to: "/artisan/uploads", label: "Progress Uploads", icon: Camera },
  { to: "/artisan/portfolio", label: "Completed Work", icon: Trophy },
];

export function ArtisanLayout() {
  const [id] = useLocalState("shriing-artisan-id", "AR-1");
  const a = adminArtisans.find((x) => x.id === id) ?? adminArtisans[0];
  return <DashboardLayout role="Artisan Workspace" title="Karigar Workspace" nav={nav} user={{ name: a.name, sub: `${a.craft} · ${a.city}` }} />;
}

const stages = ["Not started", "Casting", "Stone Setting", "Polishing", "Quality Check", "Completed"];
const seedOrders = [
  { id: "WO-3101", item: "Polki bridal choker (custom)", client: "Ananya Sharma", brand: "Raniwala", stage: 2, eta: "2026-02-14", value: 285000, notes: "Uncut polki, emerald drops, peacock enamel back." },
  { id: "WO-3102", item: "Heirloom necklace redesign", client: "Rohan Mehta", brand: "Kanchan & Co.", stage: 1, eta: "2026-02-20", value: 96000, notes: "Preserve original rubies; recast 38g of gold." },
  { id: "WO-3103", item: "Meenakari peacock earrings", client: "Priya Menon", brand: "Kesar Jewels", stage: 3, eta: "2026-02-09", value: 72000, notes: "Blue-green enamel, ruby eyes." },
  { id: "WO-3104", item: "Name pendant 'Aarohi'", client: "Kavya Reddy", brand: "Nayantara", stage: 0, eta: "2026-02-25", value: 18500, notes: "Script engraving, 14K rose gold." },
  { id: "WO-3105", item: "Temple Lakshmi haar", client: "Meera Iyer", brand: "Devasena", stage: 4, eta: "2026-02-05", value: 365000, notes: "Final QC & hallmarking pending." },
];
type WO = (typeof seedOrders)[number];
const useOrders = () => useMockCollection<WO>("artisan-orders", seedOrders);

export function ArtisanProfile() {
  useDocumentTitle("Artisan Profile");
  const [id, setId] = useLocalState("shriing-artisan-id", "AR-1");
  const a = adminArtisans.find((x) => x.id === id) ?? adminArtisans[0];
  const { items } = useOrders();
  const craft = crafts.find((c) => c.artisans.some((r) => r.name === a.name)) ?? crafts[0];
  const [bio, setBio] = useLocalState(`shriing-artisan-bio-${a.id}`, `${a.name} has practised ${a.craft.toLowerCase()} for ${a.years} years in ${a.city}, following techniques passed down through three generations.`);
  return (
    <div className="space-y-6">
      <div className="card flex flex-col gap-6 p-6 md:flex-row"><img src={a.image} alt={a.name} className="h-48 w-48 rounded-md object-cover" />
        <div className="flex-1"><label className="block max-w-xs"><span className="label">Switch artisan (demo)</span><select className="input" value={a.id} onChange={(e) => { setId(e.target.value); toast("Switched artisan profile"); }}>{adminArtisans.map((x) => (<option key={x.id} value={x.id}>{x.name}</option>))}</select></label>
          <h2 className="mt-4 font-serif text-4xl text-burgundy-dark">{a.name}</h2><p className="text-gold-dark">{a.craft} · {a.city} · {a.years} years</p>
          <textarea className="input mt-4 min-h-24" value={bio} onChange={(e) => setBio(e.target.value)} aria-label="Bio" /><button onClick={() => toast("Profile saved")} className="btn btn-primary btn-sm mt-3">Save bio</button></div></div>
      <div className="grid gap-4 sm:grid-cols-3"><Stat label="Active work orders" value={String(items.filter((i) => i.stage < 5).length)} icon={<Hammer size={20} />} /><Stat label="Completed this year" value="38" sub="▲ 4 vs last year" icon={<Trophy size={20} />} /><Stat label="Quality score" value="4.9 / 5" icon={<CheckCircle2 size={20} />} /></div>
      <div className="card p-6"><h3 className="font-serif text-2xl text-burgundy-dark">Craft details — {craft.name}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{craft.history}</p><p className="mt-4 text-[11px] font-semibold tracking-wider text-muted uppercase">Specialities</p><div className="mt-2 flex flex-wrap gap-2">{craft.specialties.map((s) => (<span key={s} className="chip cursor-default">{s}</span>))}</div><ol className="mt-5 grid gap-2 text-sm md:grid-cols-5">{craft.story.map((s, i) => (<li key={s} className="rounded-sm bg-champagne/60 p-3"><b className="font-serif text-lg text-burgundy">{i + 1}.</b> {s}</li>))}</ol></div>
    </div>
  );
}

export function ArtisanOrders() {
  useDocumentTitle("Assigned Orders");
  const { items, update } = useOrders();
  return (
    <div className="space-y-4">{items.map((o) => (
      <div key={o.id} className="card p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow">{o.id} · {o.brand}</p><h3 className="mt-1 font-serif text-2xl">{o.item}</h3><p className="text-xs text-muted">Client: {o.client} · Value {inr(o.value)}</p></div><StatusPill v={stages[o.stage]} /></div>
        <p className="mt-3 text-sm text-muted">{o.notes}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3"><label><span className="label">Update status</span><select className="input" value={o.stage} onChange={(e) => { update(o.id, { stage: Number(e.target.value) }); toast(`${o.id} → ${stages[Number(e.target.value)]}`); }}>{stages.map((s, i) => (<option key={s} value={i}>{s}</option>))}</select></label><label><span className="label">Estimated completion</span><input type="date" className="input" value={o.eta} onChange={(e) => { update(o.id, { eta: e.target.value }); toast("Completion date updated"); }} /></label><label><span className="label">Craft note</span><input className="input" value={o.notes} onChange={(e) => update(o.id, { notes: e.target.value })} /></label></div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-sand"><div className="h-full rounded-full bg-gold transition-all" style={{ width: `${(o.stage / 5) * 100}%` }} /></div></div>))}</div>
  );
}

export function ArtisanTimeline() {
  useDocumentTitle("Production Timeline");
  const { items, update } = useOrders();
  const [sel, setSel] = useState(items[0]?.id);
  const o = items.find((i) => i.id === sel) ?? items[0];
  const days = [0, 3, 6, 9, 12, 14];
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-2">{items.map((i) => (<button key={i.id} onClick={() => setSel(i.id)} className={cn("card w-full p-4 text-left transition", o.id === i.id && "ring-2 ring-burgundy")}><p className="text-[11px] tracking-wider text-gold-dark uppercase">{i.id}</p><p className="font-serif text-lg leading-tight">{i.item}</p><p className="text-xs text-muted">ETA {i.eta}</p></button>))}</div>
      <div className="card p-6"><h2 className="font-serif text-3xl text-burgundy-dark">{o.item}</h2><p className="text-sm text-muted">{o.client} · {o.brand}</p>
        <ol className="mt-6">{stages.slice(0, 5).concat("Completed").map((s, i) => { const done = i < o.stage || o.stage === 5; const cur = i === o.stage; return (
          <li key={s} className="flex gap-4"><div className="flex flex-col items-center">{done ? <CheckCircle2 className="text-emerald-600" /> : cur ? <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-burgundy"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-burgundy" /></span> : <Circle className="text-sand" />}{i < 5 && <span className={cn("my-1 w-0.5 flex-1", done ? "bg-emerald-600" : "bg-sand")} style={{ minHeight: 34 }} />}</div><div className="pb-6"><p className={cn("font-serif text-xl", cur ? "text-burgundy" : done ? "text-ink" : "text-muted")}>{s}</p><p className="text-xs text-muted">Day {days[i]}{cur ? " · in progress" : done ? " · done" : ""}</p></div></li>); })}</ol>
        <button disabled={o.stage >= 5} onClick={() => { update(o.id, { stage: o.stage + 1 }); toast(`Stage complete — now “${stages[o.stage + 1]}”`); }} className="btn btn-primary">Mark current stage complete</button></div>
    </div>
  );
}

export function ArtisanUploads() {
  useDocumentTitle("Progress Uploads");
  const { items } = useOrders();
  const [sel, setSel] = useState(items[0]?.id);
  const [shots, setShots] = useState<Record<string, { url: string; cap: string; at: string }[]>>({ "WO-3101": [{ url: pools.artisan[0], cap: "Wax model approved", at: "5 Feb" }, { url: pools.artisan[1], cap: "Gold casting complete", at: "8 Feb" }] });
  const [cap, setCap] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const list = shots[sel ?? ""] ?? [];
  const onFiles = (files: FileList | null) => {
    if (!files || !sel) return;
    const next = Array.from(files).map((f) => ({ url: URL.createObjectURL(f), cap: cap || f.name, at: "Just now" }));
    setShots({ ...shots, [sel]: [...next, ...list] }); setCap(""); toast(`${next.length} progress image${next.length > 1 ? "s" : ""} uploaded — customer notified`);
  };
  return (
    <div className="space-y-5">
      <div className="card grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto] md:items-end"><label><span className="label">Work order</span><select className="input" value={sel} onChange={(e) => setSel(e.target.value)}>{items.map((i) => (<option key={i.id} value={i.id}>{i.id} — {i.item}</option>))}</select></label><label><span className="label">Caption</span><input className="input" value={cap} onChange={(e) => setCap(e.target.value)} placeholder="e.g. Stones set, awaiting polish" /></label><button onClick={() => ref.current?.click()} className="btn btn-primary"><ImagePlus size={16} /> Upload images</button><input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} /></div>
      {list.length === 0 ? <p className="rounded-md border border-dashed border-sand p-12 text-center text-sm text-muted">No progress photos yet for this order.</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((s, i) => (<figure key={i} className="card overflow-hidden"><img src={s.url} alt={s.cap} className="aspect-[4/3] w-full object-cover" /><figcaption className="flex justify-between p-3 text-sm"><span>{s.cap}</span><span className="text-xs text-muted">{s.at}</span></figcaption></figure>))}</div>}
    </div>
  );
}

export function ArtisanPortfolio() {
  useDocumentTitle("Completed Work");
  const works = ["Kundan bridal set", "Polki chandbali", "Enamel peacock pendant", "Temple Lakshmi haar", "Jadau haath phool", "Filigree necklace", "Pearl satlada", "Antique kada"];
  return (
    <div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{works.map((w, i) => (<figure key={w} className="card overflow-hidden"><img src={[...pools.necklace, ...pools.earring][i]} alt={w} loading="lazy" className="aspect-square w-full object-cover" /><figcaption className="p-3"><p className="font-serif text-lg leading-tight">{w}</p><p className="text-xs text-muted">Delivered {["Jan", "Dec", "Nov", "Oct"][i % 4]} 2025 · ★ {(4.7 + (i % 3) * 0.1).toFixed(1)}</p></figcaption></figure>))}</div></div>
  );
}
