import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { BrandCard } from "@/components/brand/BrandCard";
import { EmptyState, PageHero, Tabs } from "@/components/common/ui";
import { brandCategories, brands, jewelryTypes } from "@/data/brands";
import { IMG } from "@/data/images";
import { useDocumentTitle } from "@/hooks";
import type { JewelryType } from "@/types";
import { cn } from "@/utils/cn";

const priceBands = [
  { id: "all", label: "Any price", min: 0, max: Infinity },
  { id: "u25", label: "Under ₹25K", min: 0, max: 25000 },
  { id: "25-1l", label: "₹25K – ₹1L", min: 25000, max: 100000 },
  { id: "1l-3l", label: "₹1L – ₹3L", min: 100000, max: 300000 },
  { id: "3l+", label: "₹3L+", min: 300000, max: Infinity },
];

export default function BrandsPage() {
  useDocumentTitle("20 Indian Jewelry Brands");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [type, setType] = useState<JewelryType | "All">("All");
  const [band, setBand] = useState("all");
  const [sort, setSort] = useState("popular");
  const [tab, setTab] = useState<"all" | "featured" | "new">("all");
  const [open, setOpen] = useState(false);

  const list = useMemo(() => {
    const pb = priceBands.find((p) => p.id === band)!;
    return brands
      .filter((b) => (tab === "featured" ? b.featured : tab === "new" ? b.isNew : true))
      .filter((b) => !q || `${b.name} ${b.tagline} ${b.category} ${b.city}`.toLowerCase().includes(q.toLowerCase()))
      .filter((b) => cat === "All" || b.category === cat)
      .filter((b) => type === "All" || b.types.includes(type))
      .filter((b) => b.priceMax >= pb.min && b.priceMin <= pb.max)
      .sort((a, b) => (sort === "popular" ? b.popularity - a.popularity : sort === "rating" ? b.rating - a.rating : sort === "name" ? a.name.localeCompare(b.name) : sort === "low" ? a.priceMin - b.priceMin : b.founded - a.founded));
  }, [q, cat, type, band, sort, tab]);

  const reset = () => { setQ(""); setCat("All"); setType("All"); setBand("all"); setTab("all"); };

  return (
    <>
      <PageHero eyebrow="Brand Marketplace" title="Twenty Houses. One Heritage." sub="Browse India's most distinctive jewelry brands — each with its own storefront, collections and customization studio." image={IMG.gold} />
      <div className="container-x py-10 md:py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Tabs value={tab} onChange={setTab} tabs={[{ id: "all", label: `All Brands (${brands.length})` }, { id: "featured", label: "Featured" }, { id: "new", label: "New Arrivals" }]} className="w-full sm:w-fit max-w-full overflow-x-auto no-scrollbar" />
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <div className="relative w-full sm:w-72"><Search size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search brands, cities, styles…" className="input pl-10" aria-label="Search brands" /></div>
            <button className="btn btn-outline lg:hidden shrink-0" onClick={() => setOpen(!open)}><SlidersHorizontal size={16} /> Filters</button>
          </div>
        </div>

        <div className={cn("mt-6 grid gap-5 rounded-md border border-sand bg-white p-5 shadow-soft lg:grid-cols-4", open ? "grid" : "hidden lg:grid")}>
          <label><span className="label">Category</span><select className="input" value={cat} onChange={(e) => setCat(e.target.value)}><option>All</option>{brandCategories.map((c) => (<option key={c}>{c}</option>))}</select></label>
          <label><span className="label">Jewelry type</span><select className="input" value={type} onChange={(e) => setType(e.target.value as JewelryType)}><option>All</option>{jewelryTypes.filter((t) => brands.some((b) => b.types.includes(t))).map((c) => (<option key={c}>{c}</option>))}</select></label>
          <label><span className="label">Price range</span><select className="input" value={band} onChange={(e) => setBand(e.target.value)}>{priceBands.map((p) => (<option key={p.id} value={p.id}>{p.label}</option>))}</select></label>
          <label><span className="label">Sort by</span><select className="input" value={sort} onChange={(e) => setSort(e.target.value)}><option value="popular">Popularity</option><option value="rating">Top rated</option><option value="name">Name A–Z</option><option value="low">Price: low to high</option><option value="new">Newest</option></select></label>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-muted"><p>{list.length} brand{list.length === 1 ? "" : "s"} found</p>{(q || cat !== "All" || type !== "All" || band !== "all" || tab !== "all") && <button onClick={reset} className="text-burgundy underline underline-offset-4">Clear filters</button>}</div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((b, i) => (<BrandCard key={b.slug} brand={b} index={i} detailed />))}
        </div>
        {list.length === 0 && <EmptyState icon={<Search size={32} />} title="No brands match" text="Try removing a filter or searching for a different style." action={<button onClick={reset} className="btn btn-primary">Reset filters</button>} />}
      </div>
    </>
  );
}
