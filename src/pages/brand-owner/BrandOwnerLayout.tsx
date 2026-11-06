import { BarChart3, ClipboardList, Factory, LayoutDashboard, MessageSquare, Package, Palette, ShoppingCart, Store, UserCog } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { BrandMark, PageHero } from "@/components/common/ui";
import { DashboardLayout, type NavItem } from "@/components/dashboard/DashboardLayout";
import { brands, getBrand } from "@/data/brands";
import { IMG } from "@/data/images";
import { useDocumentTitle } from "@/hooks";

export function BrandOwnerPicker() {
  useDocumentTitle("Brand Owner Portal");
  return (
    <>
      <PageHero eyebrow="Brand Owner Portal" title="Choose Your Brand" sub="Every brand has its own dashboard — manage profile, products, inventory, custom designs and production." image={IMG.craft} />
      <div className="container-x grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {brands.map((b) => (<Link key={b.slug} to={`/brand-owner/${b.slug}`} className="card flex items-center gap-4 p-4 transition hover:-translate-y-1 hover:shadow-lift"><BrandMark monogram={b.monogram} primary={b.primary} accent={b.accent} size={52} /><div className="min-w-0"><p className="truncate font-serif text-xl" style={{ color: b.primary }}>{b.name}</p><p className="truncate text-xs text-muted">{b.category}</p></div></Link>))}
      </div>
    </>
  );
}

export default function BrandOwnerLayout() {
  const { slug } = useParams();
  const b = getBrand(slug);
  if (!b) return <Navigate to="/brand-owner" replace />;
  const base = `/brand-owner/${b.slug}`;
  const nav: NavItem[] = [
    { to: base, label: "Overview", icon: LayoutDashboard, end: true },
    { to: `${base}/profile`, label: "Brand Profile", icon: UserCog },
    { to: `${base}/products`, label: "Products", icon: Package },
    { to: `${base}/inventory`, label: "Inventory", icon: ClipboardList },
    { to: `${base}/orders`, label: "Orders", icon: ShoppingCart },
    { to: `${base}/custom-designs`, label: "Custom Designs", icon: Palette },
    { to: `${base}/production`, label: "Production Stages", icon: Factory },
    { to: `${base}/analytics`, label: "Sales Analytics", icon: BarChart3 },
    { to: `${base}/reviews`, label: "Customer Reviews", icon: MessageSquare },
  ];
  return <DashboardLayout key={b.slug} role={`${b.name} · Owner`} title={b.name} accent={b.accent} nav={nav} user={{ name: `${b.name} Team`, sub: b.city }} aside={<div className="mx-3 mb-3 space-y-2"><Link to={`/brands/${b.slug}`} className="flex items-center gap-2 rounded-sm bg-white/5 p-3 text-xs text-ivory/80 hover:text-gold-light"><Store size={14} /> View public storefront</Link><Link to="/brand-owner" className="block px-3 text-xs text-ivory/50 hover:text-gold-light">Switch brand</Link></div>} />;
}
