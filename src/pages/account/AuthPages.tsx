import { Gem } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { IMG } from "@/data/images";
import { useDocumentTitle } from "@/hooks";
import { toast, useStore } from "@/store/useStore";

function Shell({ title, sub, children, foot }: { title: string; sub: string; children: React.ReactNode; foot: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-108px)] lg:grid-cols-2">
      <div className="relative hidden lg:block"><img src={IMG.bridalC} alt="" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/90 via-burgundy-dark/30 to-transparent" /><div className="absolute right-12 bottom-14 left-12 text-ivory"><Gem className="text-gold-light" /><p className="mt-4 font-serif text-5xl leading-tight">Your Heritage.<br />Your Style.<br />Your Story.</p></div></div>
      <div className="flex items-center justify-center px-6 py-14"><div className="w-full max-w-md"><p className="eyebrow">SHRIING Account</p><h1 className="mt-2 font-serif text-5xl text-burgundy-dark">{title}</h1><p className="mt-2 text-sm text-muted">{sub}</p><div className="mt-8">{children}</div><div className="mt-8 text-center text-sm text-muted">{foot}</div></div></div>
    </div>
  );
}

export function LoginPage() {
  useDocumentTitle("Sign in");
  const nav = useNavigate();
  const [params] = useSearchParams();
  const login = useStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const go = (name: string, mail: string) => { login({ name, email: mail, phone: "9876543210", city: "Mumbai" }); toast(`Welcome back, ${name.split(" ")[0]}!`); nav(params.get("next") || "/account"); };
  return (
    <Shell title="Welcome back" sub="Sign in to view orders, wishlist and saved designs." foot={<>New to SHRIING? <Link to="/register" className="font-medium text-burgundy underline underline-offset-4">Create an account</Link></>}>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (pw.length < 4) return toast("Password must be at least 4 characters"); go(email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), email); }}>
        <label className="block"><span className="label">Email</span><input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
        <label className="block"><span className="label">Password</span><input required type="password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" /></label>
        <div className="text-right"><Link to="/forgot-password" className="text-xs text-burgundy underline underline-offset-4">Forgot password?</Link></div>
        <button className="btn btn-primary w-full py-4">Sign in</button>
        <button type="button" onClick={() => go("Ananya Sharma", "ananya@example.com")} className="btn btn-outline w-full">Continue with demo account</button>
      </form>
    </Shell>
  );
}

export function RegisterPage() {
  useDocumentTitle("Create account");
  const nav = useNavigate();
  const login = useStore((s) => s.login);
  const [f, setF] = useState({ name: "", email: "", phone: "", pw: "" });
  return (
    <Shell title="Join SHRIING" sub="Save designs, build bridal sets and track every order." foot={<>Already a member? <Link to="/login" className="font-medium text-burgundy underline underline-offset-4">Sign in</Link></>}>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (!/^\d{10}$/.test(f.phone)) return toast("Enter a valid 10-digit mobile number"); if (f.pw.length < 6) return toast("Password needs at least 6 characters"); login({ name: f.name, email: f.email, phone: f.phone, city: "" }); toast("Account created. Welcome to SHRIING!"); nav("/account"); }}>
        <label className="block"><span className="label">Full name</span><input required className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label className="block"><span className="label">Email</span><input required type="email" className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <label className="block"><span className="label">Mobile</span><input required className="input" inputMode="numeric" maxLength={10} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
        <label className="block"><span className="label">Password</span><input required type="password" className="input" value={f.pw} onChange={(e) => setF({ ...f, pw: e.target.value })} /></label>
        <button className="btn btn-primary w-full py-4">Create account</button>
      </form>
    </Shell>
  );
}

export function ForgotPage() {
  useDocumentTitle("Reset password");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <Shell title="Reset password" sub="Enter your email and we'll send a reset link (simulated)." foot={<Link to="/login" className="font-medium text-burgundy underline underline-offset-4">Back to sign in</Link>}>
      {sent ? <div className="rounded-md bg-emerald-50 p-5 text-sm text-emerald-800">If an account exists for <b>{email}</b>, a reset link is on its way. Check your inbox.</div> : (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <label className="block"><span className="label">Email</span><input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <button className="btn btn-primary w-full py-4">Send reset link</button>
        </form>
      )}
    </Shell>
  );
}
