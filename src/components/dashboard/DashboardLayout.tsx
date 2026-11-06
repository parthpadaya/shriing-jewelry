import { LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ToastHost } from "@/components/common/ToastHost";
import { Logo } from "@/components/layout/Navbar";
import { cn } from "@/utils/cn";

export interface NavItem { to: string; label: string; icon: LucideIcon; end?: boolean }

export function DashboardLayout({ role, title, nav, user, accent, aside }: { role: string; title: string; nav: NavItem[]; user: { name: string; sub: string }; accent?: string; aside?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const side = (
    <div className="flex h-full flex-col bg-burgundy-dark text-ivory/80">
      <div className="border-b border-gold/20 p-5"><Logo light /><p className="mt-3 inline-block rounded-full border border-gold/40 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-gold-light uppercase" style={accent ? { color: accent, borderColor: accent } : undefined}>{role}</p></div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label={`${role} navigation`}>
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setOpen(false)} className={({ isActive }) => cn("flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-sm transition", isActive ? "bg-gold/20 text-gold-light" : "hover:bg-white/5 hover:text-ivory")}>
            <n.icon size={17} /> {n.label}
          </NavLink>
        ))}
      </nav>
      {aside}
      <div className="border-t border-gold/20 p-4">
        <Link to="/" className="flex items-center gap-2 text-sm text-ivory/70 hover:text-gold-light"><LogOut size={16} /> Back to storefront</Link>
      </div>
    </div>
  );
  return (
    <div className="flex min-h-screen bg-champagne/40">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">{side}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative h-full w-72">{side}<button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-ivory" aria-label="Close menu"><X /></button></div>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-sand bg-ivory/95 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-full p-2 hover:bg-champagne lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
            <h1 className="font-serif text-2xl text-burgundy-dark">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block"><p className="text-sm font-medium">{user.name}</p><p className="text-xs text-muted">{user.sub}</p></div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy font-serif text-lg text-gold-light" style={accent ? { background: accent } : undefined}>{user.name[0]}</span>
          </div>
        </header>
        <div className="p-4 sm:p-8"><Outlet /></div>
      </div>
      <ToastHost />
    </div>
  );
}
