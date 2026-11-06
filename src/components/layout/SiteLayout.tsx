import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastHost } from "@/components/common/ToastHost";
import { QuickViewHost } from "@/components/product/QuickView";
import { Footer } from "./Footer";
import { CompareBar, VernacularAssistant } from "./FloatingTools";
import { AnnouncementBar, Navbar } from "./Navbar";
import { SearchOverlay } from "./SearchOverlay";

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [pathname]);
  return null;
}

export function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <SearchOverlay />
      <QuickViewHost />
      <CompareBar />
      <VernacularAssistant />
      <ToastHost />
    </div>
  );
}
