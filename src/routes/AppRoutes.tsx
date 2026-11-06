import { Link, Route, Routes } from "react-router-dom";
import { SiteLayout, ScrollToTop } from "@/components/layout/SiteLayout";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import * as A from "@/pages/admin/AdminModules";
import { AccountLayout, AccountOverview, AddressesPage, BridalPage, DesignsPage, OrdersPage, ProfilePage, RecentPage, WishlistPage } from "@/pages/account/AccountPages";
import { ForgotPage, LoginPage, RegisterPage } from "@/pages/account/AuthPages";
import AIStylist from "@/pages/ai-stylist/AIStylist";
import HeirloomStudio from "@/pages/ai-stylist/HeirloomStudio";
import LehengaMatch from "@/pages/ai-stylist/LehengaMatch";
import { ArtisanLayout, ArtisanOrders, ArtisanPortfolio, ArtisanProfile, ArtisanTimeline, ArtisanUploads } from "@/pages/artisan/ArtisanPages";
import BrandOwnerLayout, { BrandOwnerPicker } from "@/pages/brand-owner/BrandOwnerLayout";
import * as BO from "@/pages/brand-owner/BrandOwnerPages";
import BrandsPage from "@/pages/brands/BrandsPage";
import BrandStorefront from "@/pages/brands/BrandStorefront";
import BridalStudio from "@/pages/bridal/BridalStudio";
import CartPage from "@/pages/cart/CartPage";
import CheckoutPage from "@/pages/checkout/CheckoutPage";
import OrderConfirmation from "@/pages/checkout/OrderConfirmation";
import CraftDetail from "@/pages/crafts/CraftDetail";
import CraftsPage from "@/pages/crafts/CraftsPage";
import KarigarStories from "@/pages/crafts/KarigarStories";
import CustomizationStudio from "@/pages/customization/CustomizationStudio";
import GiftingPage from "@/pages/gifting/GiftingPage";
import HomePage from "@/pages/home/HomePage";
import ProductPage from "@/pages/product/ProductPage";
import CollectionsPage from "@/pages/shop/CollectionsPage";
import ShopPage from "@/pages/shop/ShopPage";
import ApniKahani from "@/pages/tools/ApniKahani";
import ComparePage from "@/pages/tools/ComparePage";
import ConvertiblePage from "@/pages/tools/ConvertiblePage";
import GoldTools from "@/pages/tools/GoldTools";
import RegistryPage from "@/pages/tools/RegistryPage";
import TryOnPage from "@/pages/tools/TryOnPage";

function NotFound() {
  return (
    <div className="container-x py-28 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-3 font-serif text-6xl text-burgundy-dark">This jewel has wandered off</h1>
      <p className="mt-4 text-muted">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary mt-8">Back to home</Link>
    </div>
  );
}

export function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="brands/:brandSlug" element={<BrandStorefront />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="customize" element={<CustomizationStudio />} />
          <Route path="bridal" element={<BridalStudio />} />
          <Route path="ai-stylist" element={<AIStylist />} />
          <Route path="lehenga-match" element={<LehengaMatch />} />
          <Route path="heirloom" element={<HeirloomStudio />} />
          <Route path="crafts" element={<CraftsPage />} />
          <Route path="crafts/:slug" element={<CraftDetail />} />
          <Route path="karigar" element={<KarigarStories />} />
          <Route path="gifting" element={<GiftingPage />} />
          <Route path="apni-kahani" element={<ApniKahani />} />
          <Route path="try-on" element={<TryOnPage />} />
          <Route path="convertible" element={<ConvertiblePage />} />
          <Route path="gold-tools" element={<GoldTools />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="registry" element={<RegistryPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPage />} />
          <Route path="account" element={<AccountLayout />}>
            <Route index element={<AccountOverview />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="designs" element={<DesignsPage />} />
            <Route path="bridal" element={<BridalPage />} />
            <Route path="addresses" element={<AddressesPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="recent" element={<RecentPage />} />
          </Route>
          <Route path="brand-owner" element={<BrandOwnerPicker />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="brands" element={<A.AdminBrands />} />
          <Route path="products" element={<A.AdminProducts />} />
          <Route path="categories" element={<A.AdminCategories />} />
          <Route path="customizations" element={<A.AdminCustomizations />} />
          <Route path="bridal-orders" element={<A.AdminBridalOrders />} />
          <Route path="customers" element={<A.AdminCustomers />} />
          <Route path="orders" element={<A.AdminOrders />} />
          <Route path="artisans" element={<A.AdminArtisans />} />
          <Route path="collections" element={<A.AdminCollections />} />
          <Route path="coupons" element={<A.AdminCoupons />} />
          <Route path="reviews" element={<A.AdminReviews />} />
          <Route path="content" element={<A.AdminContent />} />
          <Route path="settings" element={<A.AdminSettings />} />
        </Route>

        <Route path="brand-owner/:slug" element={<BrandOwnerLayout />}>
          <Route index element={<BO.BOOverview />} />
          <Route path="profile" element={<BO.BOProfile />} />
          <Route path="products" element={<BO.BOProducts />} />
          <Route path="inventory" element={<BO.BOInventory />} />
          <Route path="orders" element={<BO.BOOrders />} />
          <Route path="custom-designs" element={<BO.BOCustomDesigns />} />
          <Route path="production" element={<BO.BOProduction />} />
          <Route path="analytics" element={<BO.BOAnalytics />} />
          <Route path="reviews" element={<BO.BOReviews />} />
        </Route>

        <Route path="artisan" element={<ArtisanLayout />}>
          <Route index element={<ArtisanProfile />} />
          <Route path="orders" element={<ArtisanOrders />} />
          <Route path="timeline" element={<ArtisanTimeline />} />
          <Route path="uploads" element={<ArtisanUploads />} />
          <Route path="portfolio" element={<ArtisanPortfolio />} />
        </Route>
      </Routes>
    </>
  );
}
