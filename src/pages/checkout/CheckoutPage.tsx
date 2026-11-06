import { Banknote, Check, CreditCard, Landmark, Lock, Smartphone, Wallet } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/common/ui";
import { useDocumentTitle } from "@/hooks";
import { useStore, toast } from "@/store/useStore";
import type { Address } from "@/types";
import { computeTotals } from "@/utils/cart";
import { inr } from "@/utils/format";
import { cn } from "@/utils/cn";
import { Summary } from "../cart/CartPage";

const methods = [
  { id: "UPI", label: "UPI", sub: "GPay, PhonePe, Paytm", icon: Smartphone },
  { id: "Card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "Net Banking", label: "Net Banking", sub: "All major banks", icon: Landmark },
  { id: "EMI", label: "No-cost EMI", sub: "3, 6 or 9 months", icon: Wallet },
  { id: "COD", label: "Pay on Delivery", sub: "Available under ₹50,000", icon: Banknote },
];

export default function CheckoutPage() {
  useDocumentTitle("Checkout");
  const nav = useNavigate();
  const cart = useStore((s) => s.cart);
  const coupon = useStore((s) => s.coupon);
  const user = useStore((s) => s.user);
  const addresses = useStore((s) => s.addresses);
  const addAddress = useStore((s) => s.addAddress);
  const placeOrder = useStore((s) => s.placeOrder);
  const [step, setStep] = useState(1);
  const [selAddr, setSelAddr] = useState<string>(addresses[0]?.id ?? "new");
  const [form, setForm] = useState({ name: user?.name ?? "", phone: user?.phone ?? "", line1: "", city: user?.city ?? "", state: "", pin: "" });
  const [method, setMethod] = useState("UPI");
  const [upi, setUpi] = useState("");
  const [card, setCard] = useState({ no: "", exp: "", cvv: "" });
  const [busy, setBusy] = useState(false);
  const totals = computeTotals(cart, coupon);

  if (!cart.length) return <div className="container-x py-24"><EmptyState title="Nothing to checkout" text="Your cart is empty." action={<Link to="/shop" className="btn btn-primary">Shop jewelry</Link>} /></div>;

  const addr = (): Address | null => {
    if (selAddr !== "new") return addresses.find((a) => a.id === selAddr) ?? null;
    return { id: "tmp", label: "Home", ...form };
  };
  const nextFromAddress = () => {
    if (selAddr === "new") {
      if (!form.name || !/^\d{10}$/.test(form.phone) || !form.line1 || !form.city || !form.state || !/^\d{6}$/.test(form.pin)) return toast("Please complete all address fields (10-digit phone, 6-digit PIN)");
      const saved = addAddress({ label: "Home", ...form });
      setSelAddr(saved.id);
    }
    setStep(2);
  };
  const nextFromPayment = () => {
    if (method === "UPI" && !/^[\w.-]+@[\w]+$/.test(upi)) return toast("Enter a valid UPI ID, e.g. name@okaxis");
    if (method === "Card" && (card.no.replace(/\s/g, "").length < 16 || !card.exp || card.cvv.length < 3)) return toast("Enter valid card details (simulated)");
    setStep(3);
  };
  const place = () => {
    const a = addr();
    if (!a) return;
    setBusy(true);
    setTimeout(() => {
      const id = `SHR-${Math.floor(30000 + Math.random() * 60000)}`;
      placeOrder({ id, date: new Date().toISOString(), items: cart, ...totals, status: "Placed", address: a, payment: method });
      nav(`/order-confirmation/${id}`);
    }, 1400);
  };
  const steps = ["Address", "Payment", "Review"];
  const f = (k: keyof typeof form) => ({ value: form[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value }) });

  return (
    <div className="container-x py-8 sm:py-10 md:py-14">
      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-burgundy-dark">Checkout</h1>
      <ol className="mt-6 sm:mt-8 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm overflow-x-auto no-scrollbar pb-1">{steps.map((s, i) => (<li key={s} className="flex items-center gap-2 sm:gap-3 shrink-0"><span className={cn("flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border text-xs", step > i + 1 ? "border-burgundy bg-burgundy text-ivory" : step === i + 1 ? "border-burgundy text-burgundy" : "border-sand text-muted")}>{step > i + 1 ? <Check size={13} /> : i + 1}</span><span className={step === i + 1 ? "font-medium text-burgundy" : "text-muted"}>{s}</span>{i < 2 && <span className="h-px w-6 sm:w-8 bg-sand md:w-16" />}</li>))}</ol>
      <div className="mt-8 sm:mt-10 grid gap-8 lg:gap-10 lg:grid-cols-[1fr_400px]">
        <div className="card p-4 sm:p-6 md:p-8">
          {step === 1 && (
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-burgundy-dark">Delivery address</h2>
              {!user && <p className="mt-2 text-xs sm:text-sm text-muted">Checking out as guest. <Link to="/login?next=/checkout" className="text-burgundy underline">Sign in</Link> to save details.</p>}
              <div className="mt-5 space-y-3">
                {addresses.map((a) => (<label key={a.id} className={cn("flex cursor-pointer items-start gap-3 rounded-sm border p-3.5 sm:p-4 text-xs sm:text-sm", selAddr === a.id ? "border-burgundy bg-champagne/40" : "border-sand")}><input type="radio" className="mt-1 accent-burgundy" checked={selAddr === a.id} onChange={() => setSelAddr(a.id)} /><span><b>{a.name}</b> · {a.phone}<br />{a.line1}, {a.city}, {a.state} {a.pin}</span></label>))}
                <label className={cn("flex cursor-pointer items-center gap-3 rounded-sm border p-3.5 sm:p-4 text-xs sm:text-sm", selAddr === "new" ? "border-burgundy bg-champagne/40" : "border-sand")}><input type="radio" className="accent-burgundy" checked={selAddr === "new"} onChange={() => setSelAddr("new")} /> Add a new address</label>
              </div>
              {selAddr === "new" && (
                <div className="mt-5 grid gap-3.5 sm:gap-4 sm:grid-cols-2">
                  <label><span className="label">Full name</span><input className="input" {...f("name")} autoComplete="name" /></label>
                  <label><span className="label">Mobile</span><input className="input" inputMode="numeric" maxLength={10} {...f("phone")} /></label>
                  <label className="sm:col-span-2"><span className="label">Address</span><input className="input" {...f("line1")} placeholder="Flat, street, area" /></label>
                  <label><span className="label">City</span><input className="input" {...f("city")} /></label>
                  <label><span className="label">State</span><input className="input" {...f("state")} /></label>
                  <label><span className="label">PIN code</span><input className="input" inputMode="numeric" maxLength={6} {...f("pin")} /></label>
                </div>
              )}
              <button onClick={nextFromAddress} className="btn btn-primary mt-6 w-full sm:w-auto">Continue to payment</button>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-burgundy-dark">Payment method</h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted"><Lock size={12} /> Simulated — no real payment is processed.</p>
              <div className="mt-5 space-y-3">
                {methods.map((m) => { const disabled = m.id === "COD" && totals.total > 50000; return (
                  <label key={m.id} className={cn("flex items-center gap-3 sm:gap-4 rounded-sm border p-3.5 sm:p-4", disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer", method === m.id ? "border-burgundy bg-champagne/40" : "border-sand")}><input type="radio" className="accent-burgundy" disabled={disabled} checked={method === m.id} onChange={() => setMethod(m.id)} /><m.icon size={20} className="text-gold-dark shrink-0" /><span><span className="block text-sm font-medium">{m.label}</span><span className="text-xs text-muted">{m.sub}</span></span></label>); })}
              </div>
              {method === "UPI" && <label className="mt-5 block"><span className="label">UPI ID</span><input className="input" value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="name@okaxis" /></label>}
              {method === "Card" && <div className="mt-5 grid gap-3 sm:gap-4 sm:grid-cols-3"><label className="sm:col-span-3"><span className="label">Card number</span><input className="input" inputMode="numeric" maxLength={19} value={card.no} onChange={(e) => setCard({ ...card, no: e.target.value.replace(/[^\d ]/g, "") })} placeholder="4111 1111 1111 1111" /></label><label><span className="label">Expiry</span><input className="input" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} placeholder="MM/YY" maxLength={5} /></label><label><span className="label">CVV</span><input className="input" type="password" maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} /></label></div>}
              {method === "EMI" && <p className="mt-5 rounded-sm bg-champagne/60 p-3 text-xs sm:text-sm text-muted">Pay {inr(totals.total / 6)} × 6 months at 0% interest. Your bank will confirm eligibility.</p>}
              <div className="mt-6 flex gap-3"><button onClick={() => setStep(1)} className="btn btn-outline flex-1 sm:flex-none">Back</button><button onClick={nextFromPayment} className="btn btn-primary flex-1 sm:flex-none">Review order</button></div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-burgundy-dark">Review & place order</h2>
              <div className="mt-5 grid gap-4 text-xs sm:text-sm sm:grid-cols-2"><div className="rounded-sm bg-champagne/60 p-3.5 sm:p-4"><p className="label">Deliver to</p>{(() => { const a = addr(); return a ? <p><b>{a.name}</b><br />{a.line1}, {a.city}, {a.state} {a.pin}<br />{a.phone}</p> : null; })()}</div><div className="rounded-sm bg-champagne/60 p-3.5 sm:p-4"><p className="label">Payment</p><p>{method}{method === "UPI" ? ` · ${upi}` : method === "Card" ? ` · •••• ${card.no.replace(/\s/g, "").slice(-4)}` : ""}</p></div></div>
              <ul className="mt-5 divide-y divide-sand">{cart.map((c) => (<li key={c.id} className="flex items-center gap-3 sm:gap-4 py-3 text-xs sm:text-sm"><img src={c.image} alt="" className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-sm object-cover" /><span className="flex-1 min-w-0 truncate">{c.name} <span className="text-muted">× {c.qty}</span></span><span className="whitespace-nowrap font-medium">{inr(c.price * c.qty)}</span></li>))}</ul>
              <div className="mt-6 flex gap-3"><button onClick={() => setStep(2)} className="btn btn-outline">Back</button><button onClick={place} disabled={busy} className="btn btn-primary flex-1 py-3.5 sm:py-4 text-xs sm:text-sm"><Lock size={15} /> {busy ? "Processing payment…" : `Place order · ${inr(totals.total)}`}</button></div>
            </div>
          )}
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start"><Summary showCoupon={step < 3} /></div>
      </div>
    </div>
  );
}
