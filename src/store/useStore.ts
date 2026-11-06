import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address, BridalCollection, CartItem, LangCode, Order, Registry, SavedDesign, User } from "@/types";
import { uid } from "@/utils/format";

type NewCartItem = Omit<CartItem, "id" | "qty"> & { qty?: number };

interface AppState {
  cart: CartItem[];
  coupon: string | null;
  wishlist: string[];
  compare: string[];
  recent: string[];
  designs: SavedDesign[];
  bridal: BridalCollection[];
  user: User | null;
  addresses: Address[];
  orders: Order[];
  registry: Registry | null;
  language: LangCode;
  addToCart: (item: NewCartItem) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  setCoupon: (c: string | null) => void;
  toggleWishlist: (id: string) => void;
  toggleCompare: (id: string) => boolean;
  clearCompare: () => void;
  pushRecent: (id: string) => void;
  saveDesign: (d: Omit<SavedDesign, "id" | "createdAt">) => SavedDesign;
  deleteDesign: (id: string) => void;
  saveBridal: (b: Omit<BridalCollection, "id" | "createdAt">) => void;
  deleteBridal: (id: string) => void;
  login: (u: User) => void;
  logout: () => void;
  updateUser: (u: Partial<User>) => void;
  addAddress: (a: Omit<Address, "id">) => Address;
  removeAddress: (id: string) => void;
  placeOrder: (o: Order) => void;
  setRegistry: (r: Registry | null) => void;
  setLanguage: (l: LangCode) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      coupon: null,
      wishlist: [],
      compare: [],
      recent: [],
      designs: [],
      bridal: [],
      user: null,
      addresses: [],
      orders: [],
      registry: null,
      language: "en",
      addToCart: (item) =>
        set((s) => {
          const id = item.kind === "product" ? `${item.productId}-${item.size ?? ""}-${(item.meta ?? []).join("|")}` : uid("cust");
          const existing = s.cart.find((c) => c.id === id);
          if (existing) return { cart: s.cart.map((c) => (c.id === id ? { ...c, qty: c.qty + (item.qty ?? 1) } : c)) };
          return { cart: [...s.cart, { ...item, id, qty: item.qty ?? 1 }] };
        }),
      removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((c) => c.id !== id) })),
      updateQty: (id, delta) =>
        set((s) => ({
          cart: s.cart.map((c) => (c.id === id ? { ...c, qty: Math.max(1, Math.min(10, c.qty + delta)) } : c)),
        })),
      clearCart: () => set({ cart: [], coupon: null }),
      setCoupon: (coupon) => set({ coupon }),
      toggleWishlist: (id) =>
        set((s) => ({ wishlist: s.wishlist.includes(id) ? s.wishlist.filter((w) => w !== id) : [...s.wishlist, id] })),
      toggleCompare: (id) => {
        const { compare } = get();
        if (compare.includes(id)) {
          set({ compare: compare.filter((c) => c !== id) });
          return true;
        }
        if (compare.length >= 4) return false;
        set({ compare: [...compare, id] });
        return true;
      },
      clearCompare: () => set({ compare: [] }),
      pushRecent: (id) => set((s) => ({ recent: [id, ...s.recent.filter((r) => r !== id)].slice(0, 12) })),
      saveDesign: (d) => {
        const design: SavedDesign = { ...d, id: uid("des"), createdAt: new Date().toISOString() };
        set((s) => ({ designs: [design, ...s.designs] }));
        return design;
      },
      deleteDesign: (id) => set((s) => ({ designs: s.designs.filter((d) => d.id !== id) })),
      saveBridal: (b) =>
        set((s) => ({ bridal: [{ ...b, id: uid("brd"), createdAt: new Date().toISOString() }, ...s.bridal] })),
      deleteBridal: (id) => set((s) => ({ bridal: s.bridal.filter((b) => b.id !== id) })),
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      updateUser: (u) => set((s) => (s.user ? { user: { ...s.user, ...u } } : s)),
      addAddress: (a) => {
        const addr = { ...a, id: uid("adr") };
        set((s) => ({ addresses: [...s.addresses, addr] }));
        return addr;
      },
      removeAddress: (id) => set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),
      placeOrder: (o) => set((s) => ({ orders: [o, ...s.orders], cart: [], coupon: null })),
      setRegistry: (registry) => set({ registry }),
      setLanguage: (language) => set({ language }),
    }),
    { name: "shriing-store-v1" },
  ),
);

// Ephemeral UI state
interface UIState {
  searchOpen: boolean;
  menuOpen: boolean;
  quickView: string | null;
  assistantOpen: boolean;
  setSearch: (v: boolean) => void;
  setMenu: (v: boolean) => void;
  setQuickView: (id: string | null) => void;
  setAssistant: (v: boolean) => void;
}
export const useUI = create<UIState>((set) => ({
  searchOpen: false,
  menuOpen: false,
  quickView: null,
  assistantOpen: false,
  setSearch: (searchOpen) => set({ searchOpen }),
  setMenu: (menuOpen) => set({ menuOpen }),
  setQuickView: (quickView) => set({ quickView }),
  setAssistant: (assistantOpen) => set({ assistantOpen }),
}));

// Toasts
interface Toast {
  id: string;
  message: string;
}
interface ToastState {
  toasts: Toast[];
  push: (message: string) => void;
  dismiss: (id: string) => void;
}
export const useToast = create<ToastState>((set) => ({
  toasts: [],
  push: (message) => {
    const id = uid("t");
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, message }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3200);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
export const toast = (m: string) => useToast.getState().push(m);
