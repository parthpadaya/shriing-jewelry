import { BadgeCheck, BookOpen, Boxes, FileText, Gem, Hammer, Layers, LayoutDashboard, MessageSquareHeart, Package, Palette, Settings, ShoppingCart, Store, Tag, Users, Wand2 } from "lucide-react";
import { DashboardLayout, type NavItem } from "@/components/dashboard/DashboardLayout";

export const adminNav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/brands", label: "Manage Brands", icon: Store },
  { to: "/admin/products", label: "Manage Products", icon: Gem },
  { to: "/admin/categories", label: "Manage Categories", icon: Layers },
  { to: "/admin/customizations", label: "Customization Requests", icon: Palette },
  { to: "/admin/bridal-orders", label: "Bridal Orders", icon: Wand2 },
  { to: "/admin/customers", label: "Manage Customers", icon: Users },
  { to: "/admin/orders", label: "Manage Orders", icon: ShoppingCart },
  { to: "/admin/artisans", label: "Manage Artisans", icon: Hammer },
  { to: "/admin/collections", label: "Manage Collections", icon: Boxes },
  { to: "/admin/coupons", label: "Manage Coupons", icon: Tag },
  { to: "/admin/reviews", label: "Manage Reviews", icon: MessageSquareHeart },
  { to: "/admin/content", label: "Manage Content", icon: FileText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  return <DashboardLayout role="Admin Console" title="SHRIING Admin" nav={adminNav} user={{ name: "Meera Kapoor", sub: "Super Admin" }} aside={<div className="mx-3 mb-3 rounded-sm bg-white/5 p-3 text-xs text-ivory/70"><p className="flex items-center gap-2 text-gold-light"><BadgeCheck size={14} /> All systems normal</p><p className="mt-1 flex items-center gap-2"><Package size={13} /> Mock data · browser storage</p><BookOpen className="hidden" /></div>} />;
}
