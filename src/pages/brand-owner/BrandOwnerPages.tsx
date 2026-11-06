import { ArrowLeft, ArrowRight, IndianRupee, Minus, Plus, ShoppingBag, Star, Package, Check, X } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link, useParams } from "react-router-dom";
import { Rating, Stat } from "@/components/common/ui";
import { ManageTable, StatusPill, type Row } from "@/components/dashboard/ManageTable";
import { getBrand } from "@/data/brands";
import { ORDER_STATUSES, productionStages, revenueByMonth } from "@/data/mockOrders";
import { productsByBrand } from "@/data/products";
import { getReviews } from "@/data/reviews";
import { useDocumentTitle, useLocalState, useMockCollection } from "@/hooks";
import { toast } from "@/store/useStore";
import { inr } from "@/utils/format";
import { cn } from "@/utils/cn";

const useBrand = () => { const { slug } = useParams(); return getBrand(slug)!; };
const names = ["Ananya Sharma", "Priya Menon", "Kavya Reddy", "Rohan Mehta", "Simran Kaur", "Aditi Banerjee", "Meera Iyer", "Arjun Nair"];
const ordersFor = (slug: string, brandName: string) => productsByBrand(slug).flatMap((p, i) => [0, 1].map((k) => ({ id: `${slug.slice(0, 3).toUpperCase()}-${1200 + i * 2 + k}`, customer: names[(i * 2 + k) % names.length], product: p.name, amount: p.price, date: new Date(2026, 0, 27 - i * 2 - k).toISOString().slice(0, 10), status: ORDER_STATUSES[(i + k) % 5], brand: brandName }))).slice(0, 9);

export function BOOverview() {
  const b = useBrand();
  useDocumentTitle(`${b.name} · Overview`);
  const f = b.popularity / 120;
  const data = revenueByMonth.map((m) => ({ month: m.month, revenue: Math.round(m.revenue * f * 100) / 100 }));
  const prods = productsByBrand(b.slug);
  const orders = ordersFor(b.slug, b.name);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Revenue (30d)" value={inr(prods.reduce((a, p) => a + p.price, 0) * 3.4)} sub="▲ 9.2%" icon={<IndianRupee size={20} />} /><Stat label="Orders" value={String(orders.length * 14)} sub="▲ 6.5%" icon={<ShoppingBag size={20} />} /><Stat label="Live products" value={String(prods.length)} icon={<Package size={20} />} /><Stat label="Rating" value={`${b.rating} ★`} sub={`${b.reviewCount} reviews`} icon={<Star size={20} />} /></div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="card p-5"><h2 className="font-serif text-2xl" style={{ color: b.primary }}>Monthly revenue (₹ Cr)</h2><div className="mt-4 h-64"><ResponsiveContainer><AreaChart data={data}><defs><linearGradient id="bo" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={b.accent} stopOpacity={0.5} /><stop offset="95%" stopColor={b.accent} stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#e6d9c0" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Area dataKey="revenue" type="monotone" stroke={b.primary} fill="url(#bo)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div></div>
        <div className="card p-5"><h2 className="font-serif text-2xl" style={{ color: b.primary }}>Quick actions</h2><div className="mt-4 grid gap-3"><Link to={`/brand-owner/${b.slug}/products`} className="btn btn-outline">Add a product</Link><Link to={`/brand-owner/${b.slug}/custom-designs`} className="btn btn-outline">Review custom designs</Link><Link to={`/brand-owner/${b.slug}/production`} className="btn btn-outline">Update production</Link><Link to={`/brands/${b.slug}`} className="btn btn-primary" style={{ background: b.primary }}>View storefront</Link></div></div>
      </div>
      <div className="card overflow-hidden"><h2 className="p-5 font-serif text-2xl" style={{ color: b.primary }}>Latest orders</h2><div className="overflow-x-auto"><table className="w-full min-w-[520px]"><thead className="bg-champagne/50"><tr><th className="th">Order</th><th className="th">Customer</th><th className="th">Product</th><th className="th">Amount</th><th className="th">Status</th></tr></thead><tbody className="divide-y divide-sand/70">{orders.slice(0, 5).map((o) => (<tr key={o.id}><td className="td font-medium">{o.id}</td><td className="td">{o.customer}</td><td className="td">{o.product}</td><td className="td">{inr(o.amount)}</td><td className="td"><StatusPill v={o.status} /></td></tr>))}</tbody></table></div></div>
    </div>
  );
}

export function BOProfile() {
  const b = useBrand();
  useDocumentTitle(`${b.name} · Profile`);
  const [f, setF] = useLocalState(`shriing-bo-profile-${b.slug}`, { name: b.name, tagline: b.tagline, city: b.city, story: b.story, offer1: b.offers[0], offer2: b.offers[1], primary: b.primary, accent: b.accent });
  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <form className="card grid gap-4 p-6 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); toast("Brand profile saved"); }}>
        <label><span className="label">Brand name</span><input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label><span className="label">City</span><input className="input" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></label>
        <label className="sm:col-span-2"><span className="label">Tagline</span><input className="input" value={f.tagline} onChange={(e) => setF({ ...f, tagline: e.target.value })} /></label>
        <label className="sm:col-span-2"><span className="label">Brand story</span><textarea className="input min-h-32" value={f.story} onChange={(e) => setF({ ...f, story: e.target.value })} /></label>
        <label><span className="label">Offer 1</span><input className="input" value={f.offer1} onChange={(e) => setF({ ...f, offer1: e.target.value })} /></label>
        <label><span className="label">Offer 2</span><input className="input" value={f.offer2} onChange={(e) => setF({ ...f, offer2: e.target.value })} /></label>
        <label><span className="label">Primary colour</span><input type="color" className="h-11 w-full cursor-pointer rounded-sm border border-sand" value={f.primary} onChange={(e) => setF({ ...f, primary: e.target.value })} /></label>
        <label><span className="label">Accent colour</span><input type="color" className="h-11 w-full cursor-pointer rounded-sm border border-sand" value={f.accent} onChange={(e) => setF({ ...f, accent: e.target.value })} /></label>
        <div className="flex gap-3 sm:col-span-2"><button className="btn btn-primary">Save profile</button><button type="button" className="btn btn-outline" onClick={() => { setF({ name: b.name, tagline: b.tagline, city: b.city, story: b.story, offer1: b.offers[0], offer2: b.offers[1], primary: b.primary, accent: b.accent }); toast("Reverted to defaults"); }}>Reset</button></div>
      </form>
      <div className="card h-fit overflow-hidden"><div className="p-6 text-white" style={{ background: f.primary }}><p className="eyebrow" style={{ color: f.accent }}>Live preview</p><h3 className="mt-3 font-serif text-4xl">{f.name}</h3><p className="mt-1 font-serif text-lg italic" style={{ color: f.accent }}>{f.tagline}</p></div><div className="p-6 text-sm text-muted"><p>{f.story}</p><ul className="mt-4 space-y-1 text-ink"><li>• {f.offer1}</li><li>• {f.offer2}</li></ul></div></div>
    </div>
  );
}

export function BOProducts() {
  const b = useBrand();
  useDocumentTitle(`${b.name} · Products`);
  return <ManageTable key={b.slug} title="Brand Products" storageKey={`bo-products-${b.slug}`} idPrefix="P" addLabel="Add product" searchKeys={["name", "type"]}
    seed={productsByBrand(b.slug).map((p) => ({ id: p.id, name: p.name, type: p.type, price: p.price, stock: p.stockCount, status: p.inStock ? "Active" : "Out of stock" })) as Row[]}
    columns={[{ key: "name", label: "Product", render: (r) => <span className="font-medium">{String(r.name)}</span> }, { key: "type", label: "Type" }, { key: "price", label: "Price", render: (r) => inr(Number(r.price)) }, { key: "stock", label: "Stock" }, { key: "status", label: "Status", options: ["Active", "Draft", "Out of stock"] }]}
    fields={[{ key: "name", label: "Product name" }, { key: "type", label: "Type", type: "select", options: b.types }, { key: "price", label: "Price (₹)", type: "number" }, { key: "stock", label: "Stock", type: "number" }, { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Out of stock"] }]}
    blank={{ name: "", type: b.types[0], price: 25000, stock: 5, status: "Draft" }} />;
}

export function BOInventory() {
  const b = useBrand();
  useDocumentTitle(`${b.name} · Inventory`);
  return <InventoryInner key={b.slug} slug={b.slug} />;
}
function InventoryInner({ slug }: { slug: string }) {
  const { items, update } = useMockCollection<Row>(`bo-products-${slug}`, productsByBrand(slug).map((p) => ({ id: p.id, name: p.name, type: p.type, price: p.price, stock: p.stockCount, status: p.inStock ? "Active" : "Out of stock" })) as Row[]);
  const low = items.filter((i) => Number(i.stock) <= 3).length;
  const adj = (r: Row, d: number) => { const s = Math.max(0, Number(r.stock) + d); update(r.id, { stock: s, status: s === 0 ? "Out of stock" : r.status === "Out of stock" ? "Active" : r.status }); };
  return (
    <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-3"><Stat label="SKUs" value={String(items.length)} /><Stat label="Units in stock" value={String(items.reduce((a, i) => a + Number(i.stock), 0))} /><Stat label="Low stock alerts" value={String(low)} /></div>
      <div className="card overflow-x-auto"><table className="w-full min-w-[560px]"><thead className="bg-champagne/50"><tr><th className="th">Product</th><th className="th">Stock level</th><th className="th">Adjust</th><th className="th">Status</th></tr></thead><tbody className="divide-y divide-sand/70">{items.map((r) => { const s = Number(r.stock); return (<tr key={r.id}><td className="td font-medium">{String(r.name)}</td><td className="td"><div className="flex items-center gap-3"><div className="h-2 w-28 overflow-hidden rounded-full bg-sand"><div className={cn("h-full rounded-full", s <= 3 ? "bg-red-500" : "bg-emerald-600")} style={{ width: `${Math.min(100, s * 7)}%` }} /></div><span className="text-sm">{s}</span></div></td><td className="td"><div className="inline-flex items-center rounded-sm border border-sand"><button aria-label="Decrease" onClick={() => adj(r, -1)} className="p-1.5 hover:bg-champagne"><Minus size={13} /></button><button aria-label="Increase" onClick={() => adj(r, 1)} className="p-1.5 hover:bg-champagne"><Plus size={13} /></button><button onClick={() => { adj(r, 10); toast("Restocked +10 units"); }} className="border-l border-sand px-2 text-xs hover:bg-champagne">+10</button></div></td><td className="td"><StatusPill v={s === 0 ? "Out of stock" : s <= 3 ? "Low stock" : "In stock"} /></td></tr>); })}</tbody></table></div></div>
  );
}

export function BOOrders() {
  const b = useBrand();
  useDocumentTitle(`${b.name} · Orders`);
  return <ManageTable key={b.slug} title="Brand Orders" storageKey={`bo-orders-${b.slug}`} idPrefix="ORD" canAdd={false} searchKeys={["id", "customer", "product"]} seed={ordersFor(b.slug, b.name) as Row[]} blank={{}}
    columns={[{ key: "id", label: "Order", render: (r) => <span className="font-medium">{String(r.id)}</span> }, { key: "customer", label: "Customer" }, { key: "product", label: "Product" }, { key: "amount", label: "Amount", render: (r) => inr(Number(r.amount)) }, { key: "date", label: "Date" }, { key: "status", label: "Status", options: ORDER_STATUSES }]}
    fields={[{ key: "customer", label: "Customer" }, { key: "product", label: "Product" }, { key: "amount", label: "Amount", type: "number" }, { key: "status", label: "Status", type: "select", options: ORDER_STATUSES }]} />;
}

const briefs = [["Halo solitaire ring, 18K white gold, 0.8ct oval", "Ring", 148000], ["Name necklace 'Aarohi' in script, rose gold", "Necklace", 38000], ["Traditional jhumka with 3 pearl drops", "Jhumka", 54000], ["Charm bracelet with evil-eye + lotus", "Bracelet", 21000], ["Soundwave pendant from wedding vows", "Apni Kahani", 16500]] as const;
export function BOCustomDesigns() {
  const b = useBrand();
  useDocumentTitle(`${b.name} · Custom Designs`);
  const key = `bo-custom-${b.slug}`;
  const { items, update } = useMockCollection<{ id: string; brief: string; type: string; customer: string; estimate: number; status: string; note: string }>(key, briefs.map((r, i) => ({ id: `${b.slug}-cd-${i}`, brief: r[0], type: r[1], customer: names[(i + 3) % names.length], estimate: r[2], status: i < 2 ? "Pending" : i === 2 ? "In Review" : "Approved", note: "" })));
  return (
    <div className="grid gap-4 md:grid-cols-2">{items.map((r) => (
      <div key={r.id} className="card p-5"><div className="flex items-start justify-between gap-3"><div><p className="eyebrow">{r.type}</p><h3 className="mt-1 font-serif text-2xl leading-tight">{r.brief}</h3><p className="mt-1 text-xs text-muted">Requested by {r.customer}</p></div><StatusPill v={r.status} /></div>
        <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-3"><label><span className="label">Quote (₹)</span><input type="number" className="input" value={r.estimate} onChange={(e) => update(r.id, { estimate: Number(e.target.value) })} /></label><span className="pb-2 font-serif text-2xl text-burgundy">{inr(r.estimate)}</span></div>
        <input className="input mt-3" placeholder="Note to customer…" value={r.note} onChange={(e) => update(r.id, { note: e.target.value })} aria-label="Note" />
        <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => { update(r.id, { status: "Approved" }); toast("Design approved & sent to production"); }} className="btn btn-primary btn-sm"><Check size={14} /> Approve</button><button onClick={() => { update(r.id, { status: "In Review" }); toast("Counter-offer sent"); }} className="btn btn-outline btn-sm">Send counter-offer</button><button onClick={() => { update(r.id, { status: "Rejected" }); toast("Request declined"); }} className="btn btn-ghost btn-sm text-red-700"><X size={14} /> Decline</button></div></div>))}</div>
  );
}

const jobNames = ["Halo solitaire ring", "Name necklace — Aarohi", "Pearl jhumka (3 drops)", "Polki choker set", "Evil-eye charm bracelet", "Soundwave pendant"];
export function BOProduction() {
  const b = useBrand();
  useDocumentTitle(`${b.name} · Production`);
  const { items, update } = useMockCollection<{ id: string; name: string; stage: number; due: string }>(`bo-production-${b.slug}`, jobNames.map((n, i) => ({ id: `${b.slug}-job-${i}`, name: n, stage: i % productionStages.length, due: new Date(2026, 1, 8 + i * 3).toISOString().slice(0, 10) })));
  return (
    <div className="overflow-x-auto pb-4"><div className="grid min-w-[1100px] grid-cols-6 gap-3">{productionStages.map((st, si) => (
      <div key={st} className="rounded-md bg-champagne/70 p-3"><p className="mb-3 flex items-center justify-between text-[11px] font-semibold tracking-wider text-burgundy uppercase">{st}<span className="rounded-full bg-white px-2 py-0.5 text-muted">{items.filter((j) => j.stage === si).length}</span></p>
        <div className="space-y-3">{items.filter((j) => j.stage === si).map((j) => (<div key={j.id} className="card p-3"><p className="font-serif text-lg leading-tight">{j.name}</p><p className="mt-1 text-[11px] text-muted">Due {j.due}</p><div className="mt-3 flex justify-between"><button disabled={si === 0} onClick={() => update(j.id, { stage: si - 1 })} aria-label="Move back" className="rounded p-1 hover:bg-champagne disabled:opacity-30"><ArrowLeft size={15} /></button><button disabled={si === productionStages.length - 1} onClick={() => { update(j.id, { stage: si + 1 }); toast(`Moved to “${productionStages[si + 1]}”`); }} aria-label="Advance" className="rounded bg-burgundy p-1 text-ivory disabled:opacity-30"><ArrowRight size={15} /></button></div></div>))}</div></div>))}</div></div>
  );
}

export function BOAnalytics() {
  const b = useBrand();
  useDocumentTitle(`${b.name} · Analytics`);
  const f = b.popularity / 120;
  const line = revenueByMonth.map((m) => ({ month: m.month, orders: Math.round(m.orders * f * 0.6), revenue: Math.round(m.revenue * f * 100) / 100 }));
  const byType = Array.from(new Set(productsByBrand(b.slug).map((p) => p.type))).map((t, i) => ({ name: t, value: 30 - i * 5 }));
  const top = productsByBrand(b.slug).map((p) => ({ name: p.name.split(" ").slice(0, 2).join(" "), units: p.reviewCount }));
  const cols = [b.primary, b.accent, "#c98b7b", "#4a0f1d", "#d9bb73"];
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="card p-5"><h2 className="font-serif text-2xl">Orders trend</h2><div className="mt-4 h-64"><ResponsiveContainer><LineChart data={line}><CartesianGrid strokeDasharray="3 3" stroke="#e6d9c0" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="orders" stroke={b.primary} strokeWidth={2.5} dot={false} /></LineChart></ResponsiveContainer></div></div>
      <div className="card p-5"><h2 className="font-serif text-2xl">Revenue (₹ Cr)</h2><div className="mt-4 h-64"><ResponsiveContainer><BarChart data={line}><CartesianGrid strokeDasharray="3 3" stroke="#e6d9c0" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="revenue" fill={b.accent} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
      <div className="card p-5"><h2 className="font-serif text-2xl">Sales by jewelry type</h2><div className="mt-4 h-64"><ResponsiveContainer><PieChart><Pie data={byType} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50} paddingAngle={3} label>{byType.map((_, i) => (<Cell key={i} fill={cols[i % cols.length]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></div>
      <div className="card p-5"><h2 className="font-serif text-2xl">Best sellers (units)</h2><div className="mt-4 h-64"><ResponsiveContainer><BarChart data={top} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#e6d9c0" /><XAxis type="number" tick={{ fontSize: 12 }} /><YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="units" fill={b.primary} radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div></div>
      <div className="hidden"><AreaChart data={[]} width={1} height={1} /></div>
    </div>
  );
}

export function BOReviews() {
  const b = useBrand();
  useDocumentTitle(`${b.name} · Reviews`);
  const { items, update } = useMockCollection<{ id: string; name: string; rating: number; title: string; text: string; reply: string; hidden: boolean }>(`bo-reviews-${b.slug}`, getReviews(b.slug, 6).map((r) => ({ id: r.id, name: r.name, rating: r.rating, title: r.title, text: r.text, reply: "", hidden: false })));
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  return (
    <div className="space-y-4"><div className="card flex items-center gap-6 p-5"><p className="font-serif text-6xl" style={{ color: b.primary }}>{b.rating}</p><div><Rating value={b.rating} size={18} /><p className="mt-1 text-sm text-muted">{b.reviewCount.toLocaleString("en-IN")} reviews</p></div></div>
      {items.map((r) => (<div key={r.id} className={cn("card p-5", r.hidden && "opacity-50")}><div className="flex items-center justify-between"><Rating value={r.rating} /><span className="text-xs text-muted">{r.name}</span></div><h4 className="mt-2 font-serif text-xl">{r.title}</h4><p className="mt-1 text-sm text-muted">{r.text}</p>
        {r.reply ? <p className="mt-3 rounded-sm bg-champagne/70 p-3 text-sm"><b>Your reply:</b> {r.reply}</p> : <div className="mt-3 flex gap-2"><input className="input" placeholder="Write a public reply…" value={drafts[r.id] ?? ""} onChange={(e) => setDrafts({ ...drafts, [r.id]: e.target.value })} aria-label="Reply" /><button className="btn btn-primary btn-sm" onClick={() => { if (!drafts[r.id]) return; update(r.id, { reply: drafts[r.id] }); toast("Reply published"); }}>Reply</button></div>}
        <button onClick={() => update(r.id, { hidden: !r.hidden })} className="mt-3 text-xs text-muted underline">{r.hidden ? "Show review" : "Hide review"}</button></div>))}</div>
  );
}
