import { IndianRupee, ShoppingBag, Store, Users } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "react-router-dom";
import { Stat } from "@/components/common/ui";
import { StatusPill } from "@/components/dashboard/ManageTable";
import { brands } from "@/data/brands";
import { products } from "@/data/products";
import { adminCustomers, adminOrders, customRequests, revenueByMonth, salesByBrand } from "@/data/mockOrders";
import { useDocumentTitle, useMockCollection } from "@/hooks";
import { toast } from "@/store/useStore";
import { compactInr, inr } from "@/utils/format";

const colors = ["#6b1a2b", "#b8923a", "#c98b7b", "#8c2a40", "#d9bb73", "#4a0f1d"];
const catData = [["Gold", 34], ["Diamond", 22], ["Gemstone", 16], ["Kundan / Polki", 14], ["Silver", 8], ["Fashion", 6]].map(([name, value]) => ({ name, value }));

export default function AdminDashboard() {
  useDocumentTitle("Admin Dashboard");
  const { items: reqs, update } = useMockCollection<(typeof customRequests)[number]>("admin-customizations", customRequests);
  const totalSales = adminOrders.reduce((a, o) => a + o.amount, 0) * 38;
  const popular = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total sales" value={compactInr(totalSales)} sub="▲ 12.4% vs last month" icon={<IndianRupee size={20} />} />
        <Stat label="Total orders" value={(adminOrders.length * 112).toLocaleString("en-IN")} sub="▲ 8.1% vs last month" icon={<ShoppingBag size={20} />} />
        <Stat label="Customers" value={(adminCustomers.length * 540).toLocaleString("en-IN")} sub="▲ 214 new this week" icon={<Users size={20} />} />
        <Stat label="Brands" value={String(brands.length)} sub="All 20 active" icon={<Store size={20} />} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="card p-5"><h2 className="font-serif text-2xl text-burgundy-dark">Revenue (₹ Cr)</h2><div className="mt-4 h-72"><ResponsiveContainer><AreaChart data={revenueByMonth}><defs><linearGradient id="rv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#b8923a" stopOpacity={0.5} /><stop offset="95%" stopColor="#b8923a" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#e6d9c0" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Area type="monotone" dataKey="revenue" stroke="#6b1a2b" strokeWidth={2} fill="url(#rv)" /></AreaChart></ResponsiveContainer></div></div>
        <div className="card p-5"><h2 className="font-serif text-2xl text-burgundy-dark">Sales by category</h2><div className="mt-4 h-72"><ResponsiveContainer><PieChart><Pie data={catData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>{catData.map((_, i) => (<Cell key={i} fill={colors[i % colors.length]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></div><div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">{catData.map((c, i) => (<span key={c.name as string} className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full" style={{ background: colors[i] }} />{c.name as string}</span>))}</div></div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card p-5"><h2 className="font-serif text-2xl text-burgundy-dark">Top brands (₹ L)</h2><div className="mt-4 h-64"><ResponsiveContainer><BarChart data={salesByBrand}><CartesianGrid strokeDasharray="3 3" stroke="#e6d9c0" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="sales" fill="#6b1a2b" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
        <div className="card p-5"><h2 className="font-serif text-2xl text-burgundy-dark">Popular products</h2><ul className="mt-3 divide-y divide-sand">{popular.map((p, i) => (<li key={p.id} className="flex items-center gap-3 py-3"><span className="w-5 font-serif text-xl text-gold">{i + 1}</span><img src={p.images[0]} alt="" className="h-11 w-11 rounded-sm object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{p.name}</p><p className="text-xs text-muted">{brands.find((b) => b.slug === p.brandSlug)?.name}</p></div><span className="text-sm">{inr(p.price)}</span></li>))}</ul></div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="card overflow-hidden"><div className="flex items-center justify-between p-5"><h2 className="font-serif text-2xl text-burgundy-dark">Recent orders</h2><Link to="/admin/orders" className="text-xs text-burgundy underline">View all</Link></div><div className="overflow-x-auto"><table className="w-full min-w-[520px]"><thead className="bg-champagne/50"><tr><th className="th">Order</th><th className="th">Customer</th><th className="th">Amount</th><th className="th">Status</th></tr></thead><tbody className="divide-y divide-sand/70">{adminOrders.slice(0, 6).map((o) => (<tr key={o.id}><td className="td font-medium">{o.id}</td><td className="td">{o.customer}</td><td className="td">{inr(o.amount)}</td><td className="td"><StatusPill v={o.status} /></td></tr>))}</tbody></table></div></div>
        <div className="card p-5"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl text-burgundy-dark">Customization requests</h2><Link to="/admin/customizations" className="text-xs text-burgundy underline">Manage</Link></div><ul className="mt-3 space-y-3">{reqs.slice(0, 4).map((r) => (<li key={r.id} className="rounded-sm bg-champagne/50 p-3"><div className="flex items-start justify-between gap-2"><p className="text-sm">{r.brief}</p><StatusPill v={r.status} /></div><p className="mt-1 text-xs text-muted">{r.customer} · {r.brand}</p>{r.status === "Pending" && <div className="mt-2 flex gap-2"><button onClick={() => { update(r.id, { status: "Approved" }); toast("Request approved"); }} className="btn btn-primary btn-sm">Approve</button><button onClick={() => { update(r.id, { status: "Rejected" }); toast("Request rejected"); }} className="btn btn-outline btn-sm">Reject</button></div>}</li>))}</ul></div>
      </div>
    </div>
  );
}
