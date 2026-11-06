import { Copy, Gem, RotateCcw, Save, Share2, ShoppingBag, Trash2, Box, Image as ImageIcon } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { PageHero, SectionHeading, Tabs } from "@/components/common/ui";
import { JewelryPreview } from "@/components/customization/JewelryPreview";
import { OptionGroup } from "@/components/customization/OptionGroup";
import { brands, getBrand } from "@/data/brands";
import { IMG, pools } from "@/data/images";
import { getProduct } from "@/data/products";
import { useDocumentTitle } from "@/hooks";
import { toast, useStore } from "@/store/useStore";
import { builders, quote, summarize, type BuilderKind, type DesignState } from "@/utils/customizer";
import { copyText, fmtDate, inr } from "@/utils/format";
import { cn } from "@/utils/cn";

const Ring3D = lazy(() => import("@/components/customization/Ring3D"));

const cartImg: Record<string, string> = { ring: pools.ring[0], necklace: pools.pendant[0], jhumka: pools.earring[0], bracelet: pools.pearl[0] };
const kinds: BuilderKind[] = ["ring", "necklace", "jhumka", "bracelet"];

export default function CustomizationStudio() {
  useDocumentTitle("Customization Studio");
  const [params, setParams] = useSearchParams();
  const kindParam = params.get("type") as BuilderKind | null;
  const kind: BuilderKind = kindParam && kinds.includes(kindParam) ? kindParam : "ring";
  const [states, setStates] = useState<Record<BuilderKind, DesignState>>({ ring: { ...builders.ring.defaults }, necklace: { ...builders.necklace.defaults }, jhumka: { ...builders.jhumka.defaults }, bracelet: { ...builders.bracelet.defaults } });
  const [view, setView] = useState<"art" | "3d">("art");
  const [brandSlug, setBrandSlug] = useState(params.get("brand") ?? "");
  const cfg = builders[kind];
  const state = states[kind];
  const q = useMemo(() => quote(kind, state), [kind, state]);
  const designs = useStore((s) => s.designs);
  const saveDesign = useStore((s) => s.saveDesign);
  const deleteDesign = useStore((s) => s.deleteDesign);
  const addToCart = useStore((s) => s.addToCart);
  const from = getProduct(params.get("from") ?? undefined);
  const brand = getBrand(brandSlug);

  const set = (k: string, v: string | number) => setStates((s) => ({ ...s, [kind]: { ...s[kind], [k]: v } }));
  const reset = () => { setStates((s) => ({ ...s, [kind]: { ...cfg.defaults } })); toast("Design reset to defaults"); };
  const lines = summarize(kind, state);
  const shareText = (title: string, ls: string[], price: number) => `✨ SHRIING custom design — ${title}\n${ls.join("\n")}\nEstimated price: ${inr(price)}${brand ? `\nBrand: ${brand.name}` : ""}\nDesign yours at ${window.location.origin}/customize?type=${kind}`;
  const save = () => { saveDesign({ kind, name: `${cfg.title.replace(" Builder", "")} design`, price: q.total, options: state, summary: lines }); toast("Design saved to your account"); };
  const cart = () => { addToCart({ kind: "custom", name: `Custom ${cfg.title.replace(" Builder", "")}`, brand: brand?.name ?? "SHRIING Studio", image: cartImg[kind], price: q.total, meta: lines.slice(0, 6) }); toast("Custom design added to cart"); };
  const loadDesign = (d: (typeof designs)[number]) => { if (kinds.includes(d.kind as BuilderKind)) { setParams({ type: d.kind }); setStates((s) => ({ ...s, [d.kind]: d.options as DesignState })); toast("Design loaded"); window.scrollTo({ top: 0, behavior: "smooth" }); } else toast("This design opens in its own studio"); };
  const over = kind === "ring" && q.total > Number(state.budget);

  return (
    <>
      <PageHero eyebrow="Customization Studio" title="Design It. See It. Own It." sub="Four builders, live layered previews and instant pricing — every choice updates your jewel in real time." image={IMG.craft} />
      <div className="container-x py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Tabs className="w-full md:w-auto overflow-x-auto no-scrollbar" value={kind} onChange={(k) => setParams({ type: k, ...(brandSlug ? { brand: brandSlug } : {}) })} tabs={kinds.map((k) => ({ id: k, label: builders[k].title }))} />
          <label className="flex items-center gap-3 text-sm"><span className="label mb-0 whitespace-nowrap">Made by</span><select className="input w-full sm:w-56" value={brandSlug} onChange={(e) => setBrandSlug(e.target.value)} aria-label="Brand"><option value="">SHRIING Studio (any brand)</option>{brands.map((b) => (<option key={b.slug} value={b.slug}>{b.name}</option>))}</select></label>
        </div>
        {from && <p className="mt-4 rounded-sm bg-champagne px-4 py-3 text-sm text-muted">Inspired by <Link to={`/product/${from.id}`} className="font-medium text-burgundy underline underline-offset-4">{from.name}</Link> — tweak any option below to make it yours.</p>}
        <p className="mt-4 text-muted">{cfg.blurb}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_1fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="card overflow-hidden">
              <div className="relative bg-champagne">
                {view === "3d" ? (
                  <div className="aspect-square w-full">
                    <ErrorBoundary fallback={<div className="flex h-full items-center justify-center text-sm text-muted">3D view needs WebGL support.</div>}>
                      <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-muted">Loading 3D…</div>}>
                        <Ring3D kind={kind} state={state} />
                      </Suspense>
                    </ErrorBoundary>
                  </div>
                ) : (
                  <JewelryPreview kind={kind} state={state} className="aspect-square w-full" />
                )}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 rounded-full bg-white/90 px-2.5 sm:px-3.5 py-1 text-[10px] sm:text-[11px] font-medium tracking-wider sm:tracking-widest text-gold-dark uppercase shadow-sm">
                  {view === "3d" ? "3D Interactive View" : "Studio Real View"}
                </div>
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex rounded-full bg-white/95 p-0.5 sm:p-1 text-[11px] sm:text-xs shadow-md backdrop-blur-sm">
                  <button
                    onClick={() => setView("art")}
                    className={cn(
                      "flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 sm:px-3.5 py-1 sm:py-1.5 font-medium transition",
                      view === "art" ? "bg-burgundy text-ivory shadow-sm" : "text-ink hover:text-burgundy"
                    )}
                  >
                    <ImageIcon size={13} /> <span className="hidden sm:inline">Studio Real</span><span className="sm:hidden">Real</span>
                  </button>
                  <button
                    onClick={() => setView("3d")}
                    className={cn(
                      "flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 sm:px-3.5 py-1 sm:py-1.5 font-medium transition",
                      view === "3d" ? "bg-burgundy text-ivory shadow-sm" : "text-ink hover:text-burgundy"
                    )}
                  >
                    <Box size={13} /> <span className="hidden sm:inline">3D View (360°)</span><span className="sm:hidden">3D</span>
                  </button>
                </div>
              </div>
              <div className="border-t border-sand p-6">
                <div className="space-y-2 text-sm">{q.lines.filter((l) => l.amount > 0).map((l) => (<div key={l.label} className="flex justify-between"><span className="text-muted">{l.label}</span><span>{inr(l.amount)}</span></div>))}<div className="flex justify-between border-t border-sand pt-2"><span className="text-muted">GST @ 3%</span><span>{inr(q.gst)}</span></div></div>
                <div className="mt-4 flex items-end justify-between"><div><p className="label mb-0">Estimated price</p><p className="font-serif text-5xl text-burgundy-dark">{inr(q.total)}</p><p className="text-xs text-muted">Approx. {q.weight} g · ready in 10–21 days</p></div>{kind === "ring" && <span className={cn("rounded-full px-3 py-1 text-xs font-medium", over ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700")}>{over ? `Over budget by ${inr(q.total - Number(state.budget))}` : "Within budget"}</span>}</div>
                <div className="mt-5 grid grid-cols-2 gap-3"><button onClick={cart} className="btn btn-primary col-span-2 py-4"><ShoppingBag size={16} /> Add custom design to cart</button><button onClick={save} className="btn btn-outline"><Save size={15} /> Save design</button><button onClick={reset} className="btn btn-outline"><RotateCcw size={15} /> Reset</button><button onClick={async () => { await copyText(shareText(cfg.title, lines, q.total)); toast("Design summary copied — share it anywhere"); }} className="btn btn-ghost col-span-2"><Share2 size={15} /> Share design summary</button></div>
              </div>
            </div>
          </div>
          <div className="card p-6 md:p-8">
            <h2 className="mb-2 flex items-center gap-2 font-serif text-3xl text-burgundy-dark"><Gem size={22} className="text-gold" /> {cfg.title}</h2>
            {cfg.groups.map((g) => (<OptionGroup key={g.key} group={g} value={state[g.key] ?? ""} onChange={(v) => set(g.key, v)} />))}
          </div>
        </div>

        <div className="mt-20">
          <SectionHeading eyebrow="Your atelier" title="Saved Designs" sub="Stored on this device. Load, share or order any time." />
          {designs.length === 0 ? <p className="text-center text-sm text-muted">No saved designs yet — press “Save design” above.</p> : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {designs.map((d) => (
                <div key={d.id} className="card p-5"><div className="flex items-start justify-between"><div><p className="eyebrow">{d.kind}</p><h3 className="mt-1 font-serif text-2xl">{d.name}</h3><p className="text-xs text-muted">{fmtDate(d.createdAt)}</p></div><p className="font-serif text-xl text-burgundy">{inr(d.price)}</p></div>
                  <ul className="mt-3 space-y-0.5 text-xs text-muted">{d.summary.slice(0, 4).map((s) => (<li key={s}>{s}</li>))}</ul>
                  <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => loadDesign(d)} className="btn btn-outline btn-sm">Load</button><button onClick={async () => { await copyText(shareText(d.name, d.summary, d.price)); toast("Summary copied"); }} className="btn btn-ghost btn-sm"><Copy size={13} /> Share</button><button onClick={() => { deleteDesign(d.id); toast("Design deleted"); }} className="btn btn-ghost btn-sm text-red-700" aria-label="Delete"><Trash2 size={13} /></button></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
