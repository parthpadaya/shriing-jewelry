export type JewelryType =
  | "Necklace"
  | "Earrings"
  | "Ring"
  | "Bangle"
  | "Bracelet"
  | "Pendant"
  | "Maang Tikka"
  | "Nath"
  | "Waist Belt"
  | "Anklet"
  | "Jhumka";

export type MaterialCategory =
  | "Gold"
  | "Silver"
  | "Diamond"
  | "Platinum"
  | "Gemstone"
  | "Kundan"
  | "Polki"
  | "Temple"
  | "Meenakari"
  | "Fashion";

export interface BrandCollection {
  name: string;
  blurb: string;
  image: string;
}

export interface Brand {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  types: JewelryType[];
  priceMin: number;
  priceMax: number;
  primary: string;
  accent: string;
  soft: string;
  city: string;
  founded: number;
  story: string;
  collections: BrandCollection[];
  customFeatures: string[];
  craft: string;
  rating: number;
  reviewCount: number;
  popularity: number;
  isNew: boolean;
  featured: boolean;
  image: string;
  monogram: string;
  offers: string[];
  artisan: { name: string; role: string; quote: string; image: string };
}

export interface Product {
  id: string;
  name: string;
  brandSlug: string;
  type: JewelryType;
  category: MaterialCategory;
  metal: string;
  purity: string;
  weight: number;
  stone: string;
  craft: string;
  occasion: string;
  price: number;
  mrp: number;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  convertible: boolean;
  isNew: boolean;
  trending: boolean;
}

export interface Review {
  id: string;
  name: string;
  city: string;
  rating: number;
  title: string;
  text: string;
  date: string;
}

export interface CartItem {
  id: string;
  kind: "product" | "custom" | "gift" | "bridal";
  productId?: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  qty: number;
  size?: string;
  meta?: string[];
}

export interface SavedDesign {
  id: string;
  kind: string;
  name: string;
  price: number;
  options: Record<string, string | number>;
  summary: string[];
  createdAt: string;
}

export interface BridalCollection {
  id: string;
  name: string;
  style: string;
  color: string;
  budget: string;
  components: { name: string; price: number }[];
  total: number;
  createdAt: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pin: string;
  label: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  gst: number;
  shipping: number;
  total: number;
  status: "Placed" | "In Production" | "Quality Check" | "Shipped" | "Delivered";
  address: Address;
  payment: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  city: string;
}

export interface RegistryItem {
  productId: string;
  contributed: number;
}

export interface Registry {
  couple: string;
  date: string;
  message: string;
  items: RegistryItem[];
}

export type LangCode = "en" | "hi" | "gu" | "mr" | "ta" | "te" | "bn" | "kn";
