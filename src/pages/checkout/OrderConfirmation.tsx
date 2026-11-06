import { motion } from "framer-motion";
import { Check, PackageCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "@/components/common/ui";
import { useDocumentTitle } from "@/hooks";
import { useStore } from "@/store/useStore";
import { addDays, fmtLong, inr } from "@/utils/format";

const stages = ["Placed", "In Production", "Quality Check", "Shipped", "Delivered"];

export default function OrderConfirmation() {
  useDocumentTitle("Order Confirmed");
  const { id } = useParams();
  const order = useStore((s) => s.orders.find((o) => o.id === id));
  if (!order) return <div className="container-x py-24"><EmptyState title="Order not found" action={<Link to="/account/orders" className="btn btn-primary">My orders</Link>} /></div>;
  const hasCustom = order.items.some((i) => i.kind !== "product");
  return (
    <div className="container-x max-w-3xl py-14 text-center md:py-20">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 160 }} className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold bg-champagne text-burgundy"><Check size={44} strokeWidth={1.5} /></motion.div>
      <p className="eyebrow mt-8">Order confirmed</p>
      <h1 className="mt-2 font-serif text-5xl text-burgundy-dark md:text-6xl">Thank you, your jewels are on their way</h1>
      <p className="mt-4 text-muted">Order <b className="text-ink">{order.id}</b> · A confirmation was sent to your email (simulated). Delivery by <b className="text-ink">{fmtLong(addDays(hasCustom ? 18 : 5))}</b>.</p>
      <div className="card mt-10 p-6 text-left">
        <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-serif text-2xl"><PackageCheck className="text-gold-dark" /> Order status</h2><span className="rounded-full bg-champagne px-3 py-1 text-xs font-medium text-burgundy">{order.status}</span></div>
        <ol className="mt-5 flex items-center">{stages.map((s, i) => (<li key={s} className="flex flex-1 items-center last:flex-none"><div className="flex flex-col items-center"><span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${i === 0 ? "bg-burgundy text-ivory" : "border border-sand text-muted"}`}>{i === 0 ? <Check size={13} /> : i + 1}</span><span className="mt-1.5 hidden text-[10px] text-muted sm:block">{s}</span></div>{i < stages.length - 1 && <span className="mx-1 h-px flex-1 bg-sand" />}</li>))}</ol>
        <ul className="mt-6 divide-y divide-sand border-t border-sand">{order.items.map((c) => (<li key={c.id} className="flex items-center gap-4 py-3 text-sm"><img src={c.image} alt="" className="h-14 w-14 rounded-sm object-cover" /><span className="flex-1">{c.name} <span className="text-muted">× {c.qty}</span></span><span>{inr(c.price * c.qty)}</span></li>))}</ul>
        <div className="mt-2 flex justify-between border-t border-sand pt-4 font-serif text-2xl"><span>Total paid</span><span className="text-burgundy">{inr(order.total)}</span></div>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3"><Link to="/account/orders" className="btn btn-primary">Track my order</Link><Link to="/shop" className="btn btn-outline">Continue shopping</Link></div>
    </div>
  );
}
