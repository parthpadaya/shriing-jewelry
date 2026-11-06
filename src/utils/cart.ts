import type { CartItem } from "@/types";
import { GST_RATE } from "./format";

export const coupons: Record<string, { label: string; calc: (sub: number) => number; min: number }> = {
  SHRI10: { label: "10% off (up to ₹15,000)", min: 15000, calc: (s) => Math.min(s * 0.1, 15000) },
  WELCOME500: { label: "₹500 off", min: 5000, calc: () => 500 },
  GOLD5: { label: "5% off on gold", min: 50000, calc: (s) => s * 0.05 },
  BRIDE20: { label: "20% off bridal (up to ₹50,000)", min: 200000, calc: (s) => Math.min(s * 0.2, 50000) },
};

export function computeTotals(cart: CartItem[], coupon: string | null) {
  const subtotal = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const def = coupon ? coupons[coupon] : undefined;
  const discount = def && subtotal >= def.min ? Math.round(def.calc(subtotal)) : 0;
  const taxable = subtotal - discount;
  const gst = Math.round(taxable * GST_RATE);
  const shipping = subtotal === 0 || subtotal >= 10000 ? 0 : 499;
  return { subtotal, discount, gst, shipping, total: taxable + gst + shipping };
}
