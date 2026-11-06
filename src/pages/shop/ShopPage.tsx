import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { EmptyState, PageHero } from "@/components/common/ui";
import { ProductCard } from "@/components/product/ProductCard";
import { brands, jewelryTypes } from "@/data/brands";
import { IMG } from "@/data/images";
import { craftStyles, materialCategories, metals, occasions, products, purities, stoneTypes } from "@/data/products";
import { useDocumentTitle } from "@/hooks";
import { cn } from "@/utils/cn";
import { compactInr } from "@/utils/format";

const weightBands = [
  { id: "any", label: "Any weight", min: 0, max: Infinity },
  { id: "lt5", label: "Under 5 g", min: 0, max: 5 },
  { id: "5-20", label: "5 – 20 g", min: 5, max: 20 },
  { id: "20-60", label: "20 – 60 g", min: 20, max: 60 },
  { id: "60+", label: "60 g & above", min: 60, max: Infinity },
];

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

function Section({ title, children, open = true }: { title: string; children: ReactNode; open?: boolean }) {
  const [o, setO] = useState(open);
  return (
    <div className="border-b border-sand py-4">
      <button onClick={() => setO(!o)} className="flex w-full items-center justify-between text-[11px] font-semibold tracking-[0.18em] text-ink uppercase" aria-expanded={o}>{title}<ChevronDown size={15} className={cn("transition", o && "rotate-180")} /></button>
      {o && <div className="mt-3">{children}</div>}
    </div>
  );
}

function Checks({ options, value, onChange, label = (o) => o }: { options: string[]; value: string[]; onChange: (v: string[]) => void; label?: (o: string) => string }) {
  return (
    <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
      {options.map((o) => (
        <label key={o} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/90">
          <input type="checkbox" className="h-4 w-4 accent-burgundy" checked={value.includes(o)} onChange={() => onChange(toggle(value, o))} /> {label(o)}
        </label>
      ))}
    </div>
  );
}

export default function ShopPage() {
  useDocumentTitle("Shop All Jewelry");
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "All");
  const [type, setType] = useState(params.get("type") ?? "All");
  const [occ, setOcc] = useState<string[]>(params.get("occasion") ? [params.get("occasion")!] : []);
  const [brandSel, setBrandSel] = useState<string[]>(params.get("brand") ? [params.get("brand")!] : []);
  const [metal, setMetal] = useState<string[]>([]);
  const [purity, setPurity] = useState<string[]>([]);
  const [stone, setStone] = useState<string[]>([]);
  const [craft, setCraft] = useState(params.get("craft") ?? "All");
  const [weight, setWeight] = useState("any");
  const [maxPrice, setMaxPrice] = useState(800000);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("featured");
  const [visible, setVisible] = useState(12);
  const [drawer, setDrawer] = useState(false);

  const key = params.toString();
  useEffect(() => {
    setQ(params.get("q") ?? "");
    setCategory(params.get("category") ?? "All");
    setType(params.get("type") ?? "All");
    setOcc(params.get("occasion") ? [params.get("occasion")!] : []);
    setBrandSel(params.get("brand") ? [params.get("brand")!] : []);
    setCraft(params.get("craft") ?? "All");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const list = useMemo(() => {
    const wb = weightBands.find((w) => w.id === weight)!;
    const s = q.trim().toLowerCase();
    const r = products.filter((p) =>
      (!s || `${p.name} ${p.type} ${p.category} ${p.stone} ${p.craft} ${p.occasion} ${p.metal}`.toLowerCase().includes(s)) &&
      (category === "All" || p.category === category) &&
      (type === "All" || p.type === type || (type === "Earrings" && p.type === "Jhumka")) &&
      (!occ.length || occ.includes(p.occasion) || (occ.includes("Bridal") && p.occasion === "Wedding" && false)) &&
      (!brandSel.length || brandSel.includes(p.brandSlug)) &&
      (!metal.length || metal.includes(p.metal)) &&
      (!purity.length || purity.includes(p.purity)) &&
      (!stone.length || stone.some((st) => (st === "None" ? p.stone === "None" : p.stone.toLowerCase().includes(st.toLowerCase())))) &&
      (craft === "All" || p.craft === craft) &&
      p.weight >= wb.min && p.weight < wb.max &&
      p.price <= maxPrice &&
      (!inStock || p.inStock),
    );
    const sorted = [...r];
    if (sort === "low") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "high") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    else if (sort === "new") sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    else sorted.sort((a, b) => Number(b.trending) - Number(a.trending) || b.reviewCount - a.reviewCount);
    return sorted;
  }, [q, category, type, occ, brandSel, metal, purity, stone, craft, weight, maxPrice, inStock, sort]);

  useEffect(() => setVisible(12), [list.length]);

  const active: { label: string; clear: () => void }[] = [
    ...(category !== "All" ? [{ label: category, clear: () => setCategory("All") }] : []),
    ...(type !== "All" ? [{ label: type, clear: () => setType("All") }] : []),
    ...occ.map((o) => ({ label: o, clear: () => setOcc(occ.filter((x) => x !== o)) })),
    ...brandSel.map((b) => ({ label: brands.find((x) => x.slug === b)?.name ?? b, clear: () => setBrandSel(brandSel.filter((x) => x !== b)) })),
    ...metal.map((m) => ({ label: m, clear: () => setMetal(metal.filter((x) => x !== m)) })),
    ...purity.map((m) => ({ label: m, clear: () => setPurity(purity.filter((x) => x !== m)) })),
    ...stone.map((m) => ({ label: m, clear: () => setStone(stone.filter((x) => x !== m)) })),
    ...(craft !== "All" ? [{ label: craft, clear: () => setCraft("All") }] : []),
    ...(weight !== "any" ? [{ label: weightBands.find((w) => w.id === weight)!.label, clear: () => setWeight("any") }] : []),
    ...(maxPrice < 800000 ? [{ label: `≤ ${compactInr(maxPrice)}`, clear: () => setMaxPrice(800000) }] : []),
    ...(inStock ? [{ label: "In stock", clear: () => setInStock(false) }] : []),
    ...(q ? [{ label: `“${q}”`, clear: () => setQ("") }] : []),
  ];
  const clearAll = () => { setParams({}); setQ(""); setCategory("All"); setType("All"); setOcc([]); setBrandSel([]); setMetal([]); setPurity([]); setStone([]); setCraft("All"); setWeight("any"); setMaxPrice(800000); setInStock(false); };

  const filters = (
    <div>
      <Section title="Category">
        <div className="flex flex-wrap gap-2">{["All", ...materialCategories].map((c) => (<button key={c} onClick={() => setCategory(c)} className={cn("chip", category === c && "chip-active")}>{c === "Temple" ? "Temple jewelry" : c === "Fashion" ? "Fashion jewelry" : c}</button>))}</div>
      </Section>
      <Section title="Jewelry type">
        <select className="input" value={type} onChange={(e) => setType(e.target.value)} aria-label="Jewelry type"><option>All</option>{jewelryTypes.map((t) => (<option key={t}>{t}</option>))}</select>
      </Section>
      <Section title={`Price · up to ${compactInr(maxPrice)}`}>
        <input type="range" min={2000} max={800000} step={2000} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-burgundy" aria-label="Maximum price" />
        <div className="flex justify-between text-[11px] text-muted"><span>₹2K</span><span>₹8L</span></div>
      </Section>
      <Section title="Metal"><Checks options={metals} value={metal} onChange={setMetal} /></Section>
      <Section title="Purity"><Checks options={purities} value={purity} onChange={setPurity} /></Section>
      <Section title="Weight"><div className="space-y-2">{weightBands.map((w) => (<label key={w.id} className="flex cursor-pointer items-center gap-2.5 text-sm"><input type="radio" name="weight" className="accent-burgundy" checked={weight === w.id} onChange={() => setWeight(w.id)} /> {w.label}</label>))}</div></Section>
      <Section title="Stone type" open={false}><Checks options={stoneTypes} value={stone} onChange={setStone} /></Section>
      <Section title="Occasion" open={false}><Checks options={occasions} value={occ} onChange={setOcc} /></Section>
      <Section title="Brand" open={false}><Checks options={brands.map((b) => b.slug)} value={brandSel} onChange={setBrandSel} label={(s) => brands.find((b) => b.slug === s)?.name ?? s} /></Section>
      <Section title="Craft style" open={false}>
        <select className="input" value={craft} onChange={(e) => setCraft(e.target.value)} aria-label="Craft style"><option>All</option>{craftStyles.map((c) => (<option key={c}>{c}</option>))}</select>
      </Section>
      <Section title="Availability"><label className="flex cursor-pointer items-center gap-2.5 text-sm"><input type="checkbox" className="h-4 w-4 accent-burgundy" checked={inStock} onChange={(e) => setInStock(e.target.checked)} /> In stock only</label></Section>
    </div>
  );

  return (
    <>
      <PageHero eyebrow="Shop" title="All Jewelry" sub="Gold, diamond, kundan, polki, temple and more — from 20 brands, with live filters." image={IMG.set} />
      <div className="container-x py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-80"><Search size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jewelry…" className="input pl-10" aria-label="Search products" /></div>
          <div className="flex items-center gap-3">
            <button className="btn btn-outline btn-sm lg:hidden" onClick={() => setDrawer(true)}><SlidersHorizontal size={14} /> Filters{active.length ? ` (${active.length})` : ""}</button>
            <select className="input w-auto" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Top rated</option><option value="new">New arrivals</option></select>
          </div>
        </div>
        {active.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {active.map((a, i) => (<button key={i} onClick={a.clear} className="chip chip-active">{a.label} <X size={12} /></button>))}
            <button onClick={clearAll} className="text-xs text-burgundy underline underline-offset-4">Clear all</button>
          </div>
        )}
        <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block"><div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-3">{filters}</div></aside>
          <div>
            <p className="mb-5 text-sm text-muted">Showing {Math.min(visible, list.length)} of {list.length} pieces</p>
            {list.length === 0 ? (
              <EmptyState icon={<Search size={32} />} title="No jewelry matches" text="Loosen a filter or search another style." action={<button onClick={clearAll} className="btn btn-primary">Clear all filters</button>} />
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 xl:grid-cols-3 xl:gap-x-6">{list.slice(0, visible).map((p, i) => (<ProductCard key={p.id} p={p} index={i} />))}</div>
            )}
            {visible < list.length && <div className="mt-12 text-center"><button className="btn btn-outline" onClick={() => setVisible(visible + 12)}>Load more</button></div>}
          </div>
        </div>
      </div>
      {drawer && (
        <div className="fixed inset-0 z-[75] lg:hidden"><div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-ivory"><div className="flex items-center justify-between border-b border-sand p-4"><h3 className="font-serif text-2xl">Filters</h3><button onClick={() => setDrawer(false)} aria-label="Close"><X /></button></div><div className="flex-1 overflow-y-auto px-5">{filters}</div><div className="flex gap-3 border-t border-sand p-4"><button onClick={clearAll} className="btn btn-outline flex-1">Clear</button><button onClick={() => setDrawer(false)} className="btn btn-primary flex-1">Show {list.length}</button></div></div>
        </div>
      )}
    </>
  );
}
