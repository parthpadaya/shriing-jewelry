import { Copy, Gift, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/common/ui";
import { getBrand } from "@/data/brands";
import { IMG } from "@/data/images";
import { getProduct, products } from "@/data/products";
import { useDocumentTitle } from "@/hooks";
import { toast, useStore } from "@/store/useStore";
import { copyText, inr } from "@/utils/format";

export default function RegistryPage() {
  useDocumentTitle("Wedding Registry");
  const registry = useStore((s) => s.registry);
  const setRegistry = useStore((s) => s.setRegistry);
  const [f, setF] = useState({ couple: "", date: "", message: "Your blessings are the greatest gift. Help us start our forever with a little sparkle." });
  const [pick, setPick] = useState("");

  const goal = registry?.items.reduce((a, i) => a + (getProduct(i.productId)?.price ?? 0), 0) ?? 0;
  const got = registry?.items.reduce((a, i) => a + i.contributed, 0) ?? 0;
  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/registry/${(registry?.couple ?? "").toLowerCase().replace(/[^a-z]+/g, "-")}`;

  return (
    <>
      <PageHero eyebrow="Wedding Registry" title="Curate Your Bridal Gift List" sub="Choose pieces you'd love, share one link, and let family contribute towards each jewel." image={IMG.bridalB} />
      <div className="container-x py-12">
        {!registry ? (
          <form className="card mx-auto max-w-xl space-y-4 p-8" onSubmit={(e) => { e.preventDefault(); setRegistry({ ...f, items: [] }); toast("Registry created — start adding pieces"); }}>
            <Gift className="text-gold" size={32} strokeWidth={1.3} /><h2 className="font-serif text-4xl text-burgundy-dark">Create your registry</h2>
            <label className="block"><span className="label">Couple names</span><input required className="input" placeholder="Ananya & Rohan" value={f.couple} onChange={(e) => setF({ ...f, couple: e.target.value })} /></label>
            <label className="block"><span className="label">Wedding date</span><input required type="date" className="input" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></label>
            <label className="block"><span className="label">Message to guests</span><textarea className="input min-h-24" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></label>
            <button className="btn btn-primary w-full py-4">Create registry</button>
          </form>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div>
              <div className="rounded-md bg-burgundy-dark p-8 text-ivory"><p className="eyebrow text-gold-light">{new Date(registry.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p><h2 className="mt-2 font-serif text-5xl">{registry.couple}</h2><p className="mt-3 max-w-lg text-ivory/75">{registry.message}</p>
                <div className="mt-6 flex flex-wrap gap-3"><button onClick={async () => { await copyText(link); toast("Registry link copied"); }} className="btn btn-gold btn-sm"><Copy size={14} /> Copy share link</button><button onClick={() => { setRegistry(null); toast("Registry deleted"); }} className="btn btn-sm border border-ivory/40 hover:bg-ivory hover:text-burgundy"><Trash2 size={14} /> Delete registry</button></div></div>
              <div className="mt-6 flex gap-3"><select className="input" value={pick} onChange={(e) => setPick(e.target.value)} aria-label="Product"><option value="">Choose a piece to add…</option>{products.filter((p) => !registry.items.some((i) => i.productId === p.id)).map((p) => (<option key={p.id} value={p.id}>{p.name} — {getBrand(p.brandSlug)?.name} ({inr(p.price)})</option>))}</select><button disabled={!pick} onClick={() => { setRegistry({ ...registry, items: [...registry.items, { productId: pick, contributed: 0 }] }); setPick(""); toast("Added to registry"); }} className="btn btn-primary"><Plus size={15} /> Add</button></div>
              {registry.items.length === 0 ? <p className="mt-8 rounded-md border border-dashed border-sand p-10 text-center text-sm text-muted">Your registry is empty. Add pieces above, or <Link to="/shop" className="text-burgundy underline">browse jewelry</Link>.</p> : (
                <ul className="mt-6 space-y-4">{registry.items.map((it) => { const p = getProduct(it.productId)!; const pct = Math.min(100, (it.contributed / p.price) * 100); return (
                  <li key={it.productId} className="card flex gap-4 p-4"><img src={p.images[0]} alt="" className="h-24 w-24 rounded-sm object-cover" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><Link to={`/product/${p.id}`} className="font-serif text-2xl leading-tight text-burgundy-dark">{p.name}</Link><button aria-label="Remove" onClick={() => setRegistry({ ...registry, items: registry.items.filter((x) => x.productId !== p.id) })} className="text-muted hover:text-red-700"><Trash2 size={16} /></button></div><p className="text-xs text-muted">{getBrand(p.brandSlug)?.name} · {inr(p.price)}</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-sand"><div className="h-full rounded-full bg-gold transition-all" style={{ width: `${pct}%` }} /></div><div className="mt-2 flex items-center justify-between text-xs"><span>{inr(it.contributed)} gifted · {Math.round(pct)}%</span><button disabled={pct >= 100} onClick={() => { setRegistry({ ...registry, items: registry.items.map((x) => (x.productId === p.id ? { ...x, contributed: Math.min(p.price, x.contributed + Math.round(p.price * 0.1)) } : x)) }); toast("A guest contributed 10% (simulated)"); }} className="text-burgundy underline underline-offset-2 disabled:opacity-40">Simulate guest gift</button></div></div></li>); })}</ul>
              )}
            </div>
            <aside className="card h-fit p-6 lg:sticky lg:top-24"><h3 className="font-serif text-2xl">Registry progress</h3><p className="mt-4 font-serif text-5xl text-burgundy">{goal ? Math.round((got / goal) * 100) : 0}%</p><p className="text-sm text-muted">{inr(got)} of {inr(goal)} gifted</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-sand"><div className="h-full rounded-full bg-burgundy" style={{ width: `${goal ? (got / goal) * 100 : 0}%` }} /></div><p className="mt-5 text-xs text-muted">{registry.items.length} pieces · guests can contribute any amount via the share link.</p></aside>
          </div>
        )}
      </div>
    </>
  );
}
