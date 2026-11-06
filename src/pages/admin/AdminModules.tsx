import { Link } from "react-router-dom";
import { ManageTable, type Row } from "@/components/dashboard/ManageTable";
import { Stat } from "@/components/common/ui";
import { brands } from "@/data/brands";
import { adminCategories } from "@/data/categories";
import { adminArtisans, adminCollections, adminContent, adminCoupons, adminCustomers, adminOrders, adminReviews, bridalOrders, customRequests, ORDER_STATUSES } from "@/data/mockOrders";
import { products } from "@/data/products";
import { useDocumentTitle, useLocalState } from "@/hooks";
import { toast } from "@/store/useStore";
import { inr } from "@/utils/format";
import { Image } from "lucide-react";

const rows = (a: unknown[]) => a as Row[];
const brandOpts = brands.map((b) => b.name);

export function AdminBrands() {
  useDocumentTitle("Manage Brands");
  return <ManageTable title="Manage Brands" storageKey="admin-brands" idPrefix="BR" addLabel="Onboard brand" searchKeys={["name", "category", "city"]}
    seed={rows(brands.map((b) => ({ id: b.slug, name: b.name, category: b.category, city: b.city, rating: b.rating, products: 5, status: "Active" })))}
    columns={[{ key: "name", label: "Brand", render: (r) => <Link className="font-medium text-burgundy hover:underline" to={`/brands/${r.id}`}>{String(r.name)}</Link> }, { key: "category", label: "Category" }, { key: "city", label: "City" }, { key: "rating", label: "Rating" }, { key: "products", label: "Products" }, { key: "status", label: "Status", options: ["Active", "Pending", "Blocked"] }]}
    fields={[{ key: "name", label: "Brand name" }, { key: "category", label: "Category" }, { key: "city", label: "City" }, { key: "rating", label: "Rating", type: "number" }, { key: "status", label: "Status", type: "select", options: ["Active", "Pending", "Blocked"] }]}
    blank={{ name: "", category: "", city: "", rating: 4.5, products: 0, status: "Pending" }} rowActions={(r) => <Link to={`/brand-owner/${r.id}`} className="mr-1 rounded px-2 py-1 text-xs text-burgundy hover:bg-champagne">Owner view</Link>} />;
}

export function AdminProducts() {
  useDocumentTitle("Manage Products");
  return <ManageTable title="Manage Products" storageKey="admin-products" idPrefix="P" addLabel="Add product" searchKeys={["name", "brand", "type"]}
    seed={rows(products.map((p) => ({ id: p.id, name: p.name, brand: brands.find((b) => b.slug === p.brandSlug)!.name, type: p.type, price: p.price, stock: p.stockCount, status: p.inStock ? "Active" : "Out of stock" })))}
    columns={[{ key: "name", label: "Product", render: (r) => <span className="font-medium">{String(r.name)}</span> }, { key: "brand", label: "Brand" }, { key: "type", label: "Type" }, { key: "price", label: "Price", render: (r) => inr(Number(r.price)) }, { key: "stock", label: "Stock" }, { key: "status", label: "Status", options: ["Active", "Draft", "Out of stock"] }]}
    fields={[{ key: "name", label: "Product name" }, { key: "brand", label: "Brand", type: "select", options: brandOpts }, { key: "type", label: "Type", type: "select", options: ["Necklace", "Earrings", "Ring", "Bangle", "Bracelet", "Pendant", "Maang Tikka", "Nath", "Waist Belt", "Anklet", "Jhumka"] }, { key: "price", label: "Price (₹)", type: "number" }, { key: "stock", label: "Stock", type: "number" }, { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Out of stock"] }]}
    blank={{ name: "", brand: brandOpts[0], type: "Ring", price: 25000, stock: 10, status: "Draft" }} />;
}

export function AdminCategories() {
  useDocumentTitle("Manage Categories");
  return <ManageTable title="Manage Categories" storageKey="admin-categories" idPrefix="C" addLabel="Add category" searchKeys={["name"]} seed={rows(adminCategories)}
    columns={[{ key: "name", label: "Category", render: (r) => <span className="font-medium">{String(r.name)}</span> }, { key: "products", label: "Products" }, { key: "status", label: "Status", options: ["Active", "Draft"] }]}
    fields={[{ key: "name", label: "Category name" }, { key: "products", label: "Products", type: "number" }, { key: "status", label: "Status", type: "select", options: ["Active", "Draft"] }]} blank={{ name: "", products: 0, status: "Draft" }} />;
}

export function AdminCustomizations() {
  useDocumentTitle("Customization Requests");
  return <ManageTable title="Customization Requests" storageKey="admin-customizations" idPrefix="CR" addLabel="Log request" searchKeys={["brief", "customer", "brand", "type"]} seed={rows(customRequests)}
    columns={[{ key: "id", label: "ID" }, { key: "brief", label: "Brief" }, { key: "type", label: "Type" }, { key: "customer", label: "Customer" }, { key: "brand", label: "Brand" }, { key: "estimate", label: "Estimate", render: (r) => inr(Number(r.estimate)) }, { key: "status", label: "Status", options: ["Pending", "In Review", "Approved", "Rejected"] }]}
    fields={[{ key: "brief", label: "Brief", type: "textarea" }, { key: "type", label: "Type" }, { key: "customer", label: "Customer" }, { key: "brand", label: "Brand", type: "select", options: brandOpts }, { key: "estimate", label: "Estimate (₹)", type: "number" }, { key: "status", label: "Status", type: "select", options: ["Pending", "In Review", "Approved", "Rejected"] }]}
    blank={{ brief: "", type: "Ring", customer: "", brand: brandOpts[0], estimate: 30000, status: "Pending" }} />;
}

export function AdminBridalOrders() {
  useDocumentTitle("Manage Bridal Orders");
  return <ManageTable title="Bridal Orders" storageKey="admin-bridal" idPrefix="BR" addLabel="New bridal order" searchKeys={["customer", "style", "outfit"]} seed={rows(bridalOrders)}
    columns={[{ key: "id", label: "ID" }, { key: "customer", label: "Customer" }, { key: "style", label: "Style" }, { key: "outfit", label: "Outfit" }, { key: "total", label: "Total", render: (r) => inr(Number(r.total)) }, { key: "weddingDate", label: "Wedding" }, { key: "status", label: "Stage", options: ["Placed", "Design Approved", "In Production", "Quality Check", "Shipped", "Delivered"] }]}
    fields={[{ key: "customer", label: "Customer" }, { key: "style", label: "Style", type: "select", options: ["South Indian", "Bengali", "Rajasthani", "Maharashtrian", "Gujarati", "Punjabi", "Kashmiri"] }, { key: "outfit", label: "Outfit" }, { key: "total", label: "Total (₹)", type: "number" }, { key: "weddingDate", label: "Wedding date", type: "date" }, { key: "status", label: "Stage", type: "select", options: ["Placed", "Design Approved", "In Production", "Quality Check", "Shipped", "Delivered"] }]}
    blank={{ customer: "", style: "South Indian", outfit: "", total: 300000, weddingDate: "2026-12-01", status: "Placed" }} />;
}

export function AdminCustomers() {
  useDocumentTitle("Manage Customers");
  return <ManageTable title="Manage Customers" storageKey="admin-customers" idPrefix="CU" addLabel="Add customer" searchKeys={["name", "email", "city"]} seed={rows(adminCustomers)}
    summary={(r) => <div className="mb-5 grid gap-4 sm:grid-cols-3"><Stat label="Customers" value={String(r.length)} /><Stat label="Gold tier" value={String(r.filter((x) => x.tier === "Gold").length)} /><Stat label="Blocked" value={String(r.filter((x) => x.status === "Blocked").length)} /></div>}
    columns={[{ key: "name", label: "Name", render: (r) => <span className="font-medium">{String(r.name)}</span> }, { key: "email", label: "Email" }, { key: "city", label: "City" }, { key: "orders", label: "Orders" }, { key: "spent", label: "Lifetime spend", render: (r) => inr(Number(r.spent)) }, { key: "tier", label: "Tier" }, { key: "status", label: "Status", options: ["Active", "Blocked"] }]}
    fields={[{ key: "name", label: "Name" }, { key: "email", label: "Email", type: "text" }, { key: "city", label: "City" }, { key: "tier", label: "Tier", type: "select", options: ["Standard", "Silver", "Gold"] }, { key: "status", label: "Status", type: "select", options: ["Active", "Blocked"] }]}
    blank={{ name: "", email: "", city: "", orders: 0, spent: 0, tier: "Standard", status: "Active" }} />;
}

export function AdminOrders() {
  useDocumentTitle("Manage Orders");
  return <ManageTable title="Manage Orders" storageKey="admin-orders" idPrefix="SHR" addLabel="Create order" searchKeys={["id", "customer", "brand", "product"]} seed={rows(adminOrders)}
    columns={[{ key: "id", label: "Order", render: (r) => <span className="font-medium">{String(r.id)}</span> }, { key: "customer", label: "Customer" }, { key: "product", label: "Product" }, { key: "brand", label: "Brand" }, { key: "amount", label: "Amount", render: (r) => inr(Number(r.amount)) }, { key: "payment", label: "Payment" }, { key: "date", label: "Date" }, { key: "status", label: "Status", options: ORDER_STATUSES }]}
    fields={[{ key: "customer", label: "Customer" }, { key: "product", label: "Product" }, { key: "brand", label: "Brand", type: "select", options: brandOpts }, { key: "amount", label: "Amount (₹)", type: "number" }, { key: "payment", label: "Payment", type: "select", options: ["UPI", "Card", "Net Banking", "EMI"] }, { key: "date", label: "Date", type: "date" }, { key: "status", label: "Status", type: "select", options: ORDER_STATUSES }]}
    blank={{ customer: "", product: "", brand: brandOpts[0], brandSlug: "", amount: 50000, payment: "UPI", date: new Date().toISOString().slice(0, 10), status: "Placed" }} />;
}

export function AdminArtisans() {
  useDocumentTitle("Manage Artisans");
  return <ManageTable title="Manage Artisans" storageKey="admin-artisans" idPrefix="AR" addLabel="Add artisan" searchKeys={["name", "craft", "city"]} seed={rows(adminArtisans)}
    columns={[{ key: "name", label: "Artisan", render: (r) => <span className="flex items-center gap-3"><img src={String(r.image)} alt="" className="h-9 w-9 rounded-full object-cover" /><span className="font-medium">{String(r.name)}</span></span> }, { key: "craft", label: "Craft" }, { key: "city", label: "City" }, { key: "years", label: "Experience (yrs)" }, { key: "activeOrders", label: "Active orders" }, { key: "status", label: "Status", options: ["Active", "On Leave"] }]}
    fields={[{ key: "name", label: "Name" }, { key: "craft", label: "Craft" }, { key: "city", label: "City" }, { key: "years", label: "Experience (years)", type: "number" }, { key: "activeOrders", label: "Active orders", type: "number" }, { key: "status", label: "Status", type: "select", options: ["Active", "On Leave"] }]}
    blank={{ name: "", craft: "", city: "", years: 5, activeOrders: 0, status: "Active", image: "https://images.pexels.com/photos/15955333/pexels-photo-15955333.jpeg?auto=compress&cs=tinysrgb&w=200" }} rowActions={() => <Link to="/artisan" className="mr-1 rounded px-2 py-1 text-xs text-burgundy hover:bg-champagne">Workspace</Link>} />;
}

export function AdminCollections() {
  useDocumentTitle("Manage Collections");
  return <ManageTable title="Manage Collections" storageKey="admin-collections" idPrefix="CL" addLabel="New collection" searchKeys={["name", "season"]} seed={rows(adminCollections)}
    columns={[{ key: "name", label: "Collection", render: (r) => <span className="font-medium">{String(r.name)}</span> }, { key: "products", label: "Products" }, { key: "season", label: "Season" }, { key: "status", label: "Status", options: ["Live", "Draft"] }]}
    fields={[{ key: "name", label: "Collection name" }, { key: "products", label: "Products", type: "number" }, { key: "season", label: "Season" }, { key: "status", label: "Status", type: "select", options: ["Live", "Draft"] }]} blank={{ name: "", products: 0, season: "Year-round", status: "Draft" }} />;
}

export function AdminCoupons() {
  useDocumentTitle("Manage Coupons");
  return <ManageTable title="Manage Coupons" storageKey="admin-coupons" idPrefix="CP" addLabel="Create coupon" searchKeys={["code", "discount"]} seed={rows(adminCoupons)}
    columns={[{ key: "code", label: "Code", render: (r) => <code className="rounded bg-champagne px-2 py-1 text-xs font-semibold text-burgundy">{String(r.code)}</code> }, { key: "discount", label: "Discount" }, { key: "minOrder", label: "Min order", render: (r) => inr(Number(r.minOrder)) }, { key: "uses", label: "Redemptions" }, { key: "status", label: "Status", options: ["Active", "Expired", "Draft"] }]}
    fields={[{ key: "code", label: "Code" }, { key: "discount", label: "Discount (text)" }, { key: "minOrder", label: "Minimum order (₹)", type: "number" }, { key: "status", label: "Status", type: "select", options: ["Active", "Expired", "Draft"] }]} blank={{ code: "", discount: "10% off", minOrder: 10000, uses: 0, status: "Active" }} />;
}

export function AdminReviews() {
  useDocumentTitle("Manage Reviews");
  return <ManageTable title="Manage Reviews" storageKey="admin-reviews" idPrefix="RV" addLabel="Add review" searchKeys={["product", "customer", "comment"]} seed={rows(adminReviews)}
    columns={[{ key: "product", label: "Product" }, { key: "customer", label: "Customer" }, { key: "rating", label: "Rating", render: (r) => <span className="text-gold">{"★".repeat(Number(r.rating))}<span className="text-sand">{"★".repeat(5 - Number(r.rating))}</span></span> }, { key: "comment", label: "Comment" }, { key: "status", label: "Status", options: ["Published", "Pending", "Hidden"] }]}
    fields={[{ key: "product", label: "Product" }, { key: "customer", label: "Customer" }, { key: "rating", label: "Rating (1–5)", type: "number" }, { key: "comment", label: "Comment", type: "textarea" }, { key: "status", label: "Status", type: "select", options: ["Published", "Pending", "Hidden"] }]} blank={{ product: "", customer: "", rating: 5, comment: "", status: "Pending" }} />;
}

export function AdminContent() {
  useDocumentTitle("Manage Content");
  return <ManageTable title="Manage Content" storageKey="admin-content" idPrefix="CT" addLabel="New content block" searchKeys={["title", "section"]} seed={rows(adminContent)}
    columns={[{ key: "title", label: "Title", render: (r) => <span className="flex items-center gap-2 font-medium"><Image size={14} className="text-gold" />{String(r.title)}</span> }, { key: "section", label: "Section" }, { key: "updated", label: "Last updated" }, { key: "status", label: "Status", options: ["Published", "Draft"] }]}
    fields={[{ key: "title", label: "Title" }, { key: "section", label: "Section", type: "select", options: ["Home", "Global", "Bridal", "Crafts", "Gifting", "Policies"] }, { key: "updated", label: "Updated", type: "date" }, { key: "status", label: "Status", type: "select", options: ["Published", "Draft"] }]} blank={{ title: "", section: "Home", updated: new Date().toISOString().slice(0, 10), status: "Draft" }} />;
}

export function AdminSettings() {
  useDocumentTitle("Settings");
  const [s, setS] = useLocalState("shriing-admin-settings", { store: "SHRIING Marketplace", email: "care@shriing.in", gst: 3, threshold: 10000, rateSource: "Simulated (MCX feed in Phase 2)", maintenance: false, emailAlerts: true, lowStock: true, autoApprove: false });
  const Toggle = ({ k, label }: { k: "maintenance" | "emailAlerts" | "lowStock" | "autoApprove"; label: string }) => (<label className="flex cursor-pointer items-center justify-between rounded-sm border border-sand p-3 text-sm"><span>{label}</span><input type="checkbox" className="h-5 w-5 accent-burgundy" checked={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.checked })} /></label>);
  return (
    <form className="card max-w-3xl space-y-6 p-6" onSubmit={(e) => { e.preventDefault(); toast("Settings saved"); }}>
      <div className="grid gap-4 sm:grid-cols-2"><label><span className="label">Store name</span><input className="input" value={s.store} onChange={(e) => setS({ ...s, store: e.target.value })} /></label><label><span className="label">Support email</span><input className="input" value={s.email} onChange={(e) => setS({ ...s, email: e.target.value })} /></label><label><span className="label">GST on jewelry (%)</span><input type="number" className="input" value={s.gst} onChange={(e) => setS({ ...s, gst: +e.target.value })} /></label><label><span className="label">Free shipping threshold (₹)</span><input type="number" className="input" value={s.threshold} onChange={(e) => setS({ ...s, threshold: +e.target.value })} /></label><label className="sm:col-span-2"><span className="label">Gold rate source</span><input className="input" value={s.rateSource} onChange={(e) => setS({ ...s, rateSource: e.target.value })} /></label></div>
      <div className="grid gap-3 sm:grid-cols-2"><Toggle k="maintenance" label="Maintenance mode" /><Toggle k="emailAlerts" label="Email alerts for new orders" /><Toggle k="lowStock" label="Low-stock notifications" /><Toggle k="autoApprove" label="Auto-approve customization requests" /></div>
      <button className="btn btn-primary">Save settings</button>
    </form>
  );
}
