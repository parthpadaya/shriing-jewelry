import { Bookmark, Clock, Gem, Heart, LayoutDashboard, MapPin, Package, Settings, Trash2, Copy } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { EmptyState } from "@/components/common/ui";
import { ProductCard } from "@/components/product/ProductCard";
import { getProduct } from "@/data/products";
import { useDocumentTitle } from "@/hooks";
import { toast, useStore } from "@/store/useStore";
import type { Order } from "@/types";
import { copyText, fmtDate, inr } from "@/utils/format";
import { cn } from "@/utils/cn";

const nav = [
  { to: "/account", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/account/orders", label: "My Orders", icon: Package },
  { to: "/account/wishlist", label: "Wishlist", icon: Heart },
  { to: "/account/designs", label: "Saved Designs", icon: Gem },
  { to: "/account/bridal", label: "Bridal Collections", icon: Bookmark },
  { to: "/account/addresses", label: "Addresses", icon: MapPin },
  { to: "/account/profile", label: "Profile Settings", icon: Settings },
  { to: "/account/recent", label: "Recently Viewed", icon: Clock },
];

export function AccountLayout() {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const loc = useLocation();
  useDocumentTitle("My Account");
  // wishlist is also reachable when logged out
  if (!user && loc.pathname !== "/account/wishlist") return <Navigate to={`/login?next=${loc.pathname}`} replace />;
  return (
    <div className="container-x grid gap-10 py-10 md:py-14 lg:grid-cols-[260px_1fr]">
      <aside>
        <div className="card p-5"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-burgundy font-serif text-xl text-gold-light">{(user?.name ?? "G")[0]}</span><div className="min-w-0"><p className="truncate font-serif text-xl text-burgundy-dark">{user?.name ?? "Guest"}</p><p className="truncate text-xs text-muted">{user?.email ?? "Not signed in"}</p></div></div></div>
        <nav className="no-scrollbar mt-4 flex gap-1 overflow-x-auto lg:flex-col">
          {nav.map((n) => (<NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cn("flex shrink-0 items-center gap-3 rounded-sm px-4 py-2.5 text-sm transition", isActive ? "bg-burgundy text-ivory" : "hover:bg-champagne")}><n.icon size={16} />{n.label}</NavLink>))}
          {user && <button onClick={() => { logout(); toast("Signed out"); }} className="rounded-sm px-4 py-2.5 text-left text-sm text-muted hover:bg-champagne">Sign out</button>}
        </nav>
      </aside>
      <div className="min-w-0"><Outlet /></div>
    </div>
  );
}

const stages: Order["status"][] = ["Placed", "In Production", "Quality Check", "Shipped", "Delivered"];

export function AccountOverview() {
  const { user, orders, wishlist, designs, bridal } = useStore();
  return (
    <div>
      <h1 className="font-serif text-4xl text-burgundy-dark">Namaste, {user?.name.split(" ")[0]}</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{[["Orders", orders.length, "/account/orders"], ["Wishlist", wishlist.length, "/account/wishlist"], ["Saved designs", designs.length, "/account/designs"], ["Bridal sets", bridal.length, "/account/bridal"]].map(([l, n, to]) => (<Link key={l as string} to={to as string} className="card p-5 transition hover:-translate-y-0.5"><p className="font-serif text-4xl text-burgundy">{n}</p><p className="text-xs tracking-wider text-muted uppercase">{l}</p></Link>))}</div>
      <h2 className="mt-10 font-serif text-3xl">Quick actions</h2>
      <div className="mt-4 flex flex-wrap gap-3"><Link to="/customize" className="btn btn-primary">Design jewelry</Link><Link to="/bridal" className="btn btn-outline">Bridal studio</Link><Link to="/ai-stylist" className="btn btn-outline">AI stylist</Link><Link to="/registry" className="btn btn-outline">Wedding registry</Link></div>
      <h2 className="mt-10 font-serif text-3xl">Latest order</h2>
      {orders[0] ? <OrderCard o={orders[0]} /> : <p className="mt-3 text-sm text-muted">No orders yet. <Link className="text-burgundy underline" to="/shop">Start shopping</Link></p>}
    </div>
  );
}

function OrderCard({ o }: { o: Order }) {
  const idx = stages.indexOf(o.status);
  const advance = () => { if (idx < stages.length - 1) { useStore.setState((s) => ({ orders: s.orders.map((x) => (x.id === o.id ? { ...x, status: stages[idx + 1] } : x)) })); toast(`Order moved to “${stages[idx + 1]}” (demo)`); } };
  return (
    <div className="card mt-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-serif text-2xl text-burgundy-dark">{o.id}</p><p className="text-xs text-muted">{fmtDate(o.date)} · {o.payment}</p></div><div className="text-right"><p className="font-serif text-2xl">{inr(o.total)}</p><span className="rounded-full bg-champagne px-3 py-1 text-xs font-medium text-burgundy">{o.status}</span></div></div>
      <ol className="mt-5 flex items-center">{stages.map((s, i) => (<li key={s} className="flex flex-1 items-center last:flex-none"><span title={s} className={cn("h-3 w-3 rounded-full", i <= idx ? "bg-burgundy" : "bg-sand")} />{i < stages.length - 1 && <span className={cn("h-0.5 flex-1", i < idx ? "bg-burgundy" : "bg-sand")} />}</li>))}</ol>
      <ul className="mt-5 flex flex-wrap gap-3">{o.items.map((c) => (<li key={c.id} className="flex items-center gap-2 text-xs"><img src={c.image} alt="" className="h-12 w-12 rounded-sm object-cover" /><span className="max-w-32">{c.name} × {c.qty}</span></li>))}</ul>
      {idx < stages.length - 1 && <button onClick={advance} className="btn btn-outline btn-sm mt-4">Advance status (demo)</button>}
    </div>
  );
}

export function OrdersPage() {
  const orders = useStore((s) => s.orders);
  return (<div><h1 className="font-serif text-4xl text-burgundy-dark">My Orders</h1>{orders.length === 0 ? <div className="mt-6"><EmptyState icon={<Package size={34} />} title="No orders yet" text="Orders you place will appear here with live status." action={<Link to="/shop" className="btn btn-primary">Shop now</Link>} /></div> : orders.map((o) => <OrderCard key={o.id} o={o} />)}</div>);
}

export function WishlistPage() {
  const ids = useStore((s) => s.wishlist);
  const items = ids.map((i) => getProduct(i)).filter(Boolean);
  return (<div><h1 className="font-serif text-4xl text-burgundy-dark">Wishlist <span className="text-xl text-muted">({items.length})</span></h1>{items.length === 0 ? <div className="mt-6"><EmptyState icon={<Heart size={34} />} title="Your wishlist is empty" text="Tap the heart on any piece to save it." action={<Link to="/shop" className="btn btn-primary">Discover jewelry</Link>} /></div> : <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 xl:grid-cols-3">{items.map((p, i) => (<ProductCard key={p!.id} p={p!} index={i} />))}</div>}</div>);
}

export function DesignsPage() {
  const { designs, deleteDesign, addToCart } = useStore();
  return (
    <div><h1 className="font-serif text-4xl text-burgundy-dark">Saved Designs</h1>
      {designs.length === 0 ? <div className="mt-6"><EmptyState icon={<Gem size={34} />} title="No saved designs" text="Create a design in the studio and save it here." action={<Link to="/customize" className="btn btn-primary">Open studio</Link>} /></div> : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">{designs.map((d) => (<div key={d.id} className="card p-5"><div className="flex justify-between"><div><p className="eyebrow">{d.kind}</p><h3 className="font-serif text-2xl">{d.name}</h3><p className="text-xs text-muted">{fmtDate(d.createdAt)}</p></div><p className="font-serif text-xl text-burgundy">{inr(d.price)}</p></div><ul className="mt-3 text-xs text-muted">{d.summary.slice(0, 5).map((s) => (<li key={s}>{s}</li>))}</ul>
          <div className="mt-4 flex flex-wrap gap-2"><button className="btn btn-primary btn-sm" onClick={() => { addToCart({ kind: "custom", name: d.name, brand: "SHRIING Studio", image: "https://images.pexels.com/photos/2849742/pexels-photo-2849742.jpeg?auto=compress&cs=tinysrgb&w=400", price: d.price, meta: d.summary.slice(0, 5) }); toast("Added to cart"); }}>Order this</button><button className="btn btn-outline btn-sm" onClick={async () => { await copyText(`SHRIING design: ${d.name}\n${d.summary.join("\n")}\nEstimated ${inr(d.price)}`); toast("Design summary copied"); }}><Copy size={13} /> Share</button><button className="btn btn-ghost btn-sm text-red-700" onClick={() => deleteDesign(d.id)} aria-label="Delete"><Trash2 size={13} /></button></div></div>))}</div>)}
    </div>
  );
}

export function BridalPage() {
  const { bridal, deleteBridal } = useStore();
  return (<div><h1 className="font-serif text-4xl text-burgundy-dark">Bridal Collections</h1>{bridal.length === 0 ? <div className="mt-6"><EmptyState icon={<Bookmark size={34} />} title="No bridal collections" text="Build a trousseau in the Bridal Studio." action={<Link to="/bridal" className="btn btn-primary">Open Bridal Studio</Link>} /></div> : <div className="mt-6 grid gap-4 md:grid-cols-2">{bridal.map((b) => (<div key={b.id} className="card p-5"><div className="flex justify-between"><div><h3 className="font-serif text-2xl">{b.name}</h3><p className="text-xs text-muted">{b.color} · {b.budget}</p></div><button onClick={() => deleteBridal(b.id)} aria-label="Delete" className="text-muted hover:text-red-700"><Trash2 size={16} /></button></div><ul className="mt-3 divide-y divide-sand text-sm">{b.components.map((c) => (<li key={c.name} className="flex justify-between py-1.5"><span>{c.name}</span><span>{inr(c.price)}</span></li>))}</ul><p className="mt-3 text-right font-serif text-2xl text-burgundy">{inr(b.total)}</p></div>))}</div>}</div>);
}

export function AddressesPage() {
  const { addresses, addAddress, removeAddress, user } = useStore();
  const [f, setF] = useState({ label: "Home", name: user?.name ?? "", phone: "", line1: "", city: "", state: "", pin: "" });
  return (
    <div><h1 className="font-serif text-4xl text-burgundy-dark">Addresses</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">{addresses.map((a) => (<div key={a.id} className="card p-5 text-sm"><div className="flex justify-between"><p className="eyebrow">{a.label}</p><button onClick={() => removeAddress(a.id)} aria-label="Delete" className="text-muted hover:text-red-700"><Trash2 size={15} /></button></div><p className="mt-2 font-medium">{a.name} · {a.phone}</p><p className="text-muted">{a.line1}, {a.city}, {a.state} {a.pin}</p></div>))}{addresses.length === 0 && <p className="text-sm text-muted">No saved addresses yet.</p>}</div>
      <form className="card mt-8 grid gap-4 p-6 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); if (!/^\d{6}$/.test(f.pin)) return toast("Enter a valid 6-digit PIN"); addAddress(f); toast("Address added"); setF({ ...f, line1: "", city: "", state: "", pin: "", phone: "" }); }}>
        <h2 className="font-serif text-2xl sm:col-span-2">Add new address</h2>
        {([["label", "Label"], ["name", "Full name"], ["phone", "Mobile"], ["pin", "PIN code"], ["line1", "Address"], ["city", "City"], ["state", "State"]] as const).map(([k, l]) => (<label key={k} className={k === "line1" ? "sm:col-span-2" : ""}><span className="label">{l}</span><input required className="input" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></label>))}
        <button className="btn btn-primary sm:col-span-2">Save address</button>
      </form>
    </div>
  );
}

export function ProfilePage() {
  const { user, updateUser } = useStore();
  const [f, setF] = useState(user ?? { name: "", email: "", phone: "", city: "" });
  return (<div><h1 className="font-serif text-4xl text-burgundy-dark">Profile Settings</h1><form className="card mt-6 grid max-w-2xl gap-4 p-6 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); updateUser(f); toast("Profile updated"); }}>{([["name", "Full name"], ["email", "Email"], ["phone", "Mobile"], ["city", "City"]] as const).map(([k, l]) => (<label key={k}><span className="label">{l}</span><input className="input" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></label>))}<button className="btn btn-primary sm:col-span-2">Save changes</button></form></div>);
}

export function RecentPage() {
  const ids = useStore((s) => s.recent);
  const items = ids.map((i) => getProduct(i)).filter(Boolean);
  return (<div><h1 className="font-serif text-4xl text-burgundy-dark">Recently Viewed</h1>{items.length === 0 ? <div className="mt-6"><EmptyState icon={<Clock size={34} />} title="Nothing viewed yet" action={<Link to="/shop" className="btn btn-primary">Browse jewelry</Link>} /></div> : <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 xl:grid-cols-3">{items.map((p, i) => (<ProductCard key={p!.id} p={p!} index={i} />))}</div>}</div>);
}
