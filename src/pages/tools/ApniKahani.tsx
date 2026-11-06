import { Eraser, Mic, PenLine, ShoppingBag, Type, AudioLines, Save, Share2 } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { PageHero, Tabs } from "@/components/common/ui";
import { pools } from "@/data/images";
import { useDocumentTitle } from "@/hooks";
import { toast, useStore } from "@/store/useStore";
import { copyText, inr } from "@/utils/format";
import { cn } from "@/utils/cn";

type Mode = "message" | "handwriting" | "soundwave";
const pal = { Gold: ["#F7E394", "#D4AF37", "#8F6F24"], Rose: ["#F7D2C4", "#D99A86", "#9A5D4B"], Silver: ["#F6F7F9", "#C9CCD1", "#8A8F98"] } as const;
const mult: Record<string, number> = { "Gold 22K": 1.7, "Gold 18K": 1.35, "Rose Gold 18K": 1.4, "Silver 925": 0.3 };

const waveFrom = (s: string, n = 44) => {
  let h = 7;
  return Array.from({ length: n }, (_, i) => {
    h = (h * 31 + (s.charCodeAt(i % Math.max(s.length, 1)) || 65) + i * 17) >>> 0;
    const env = Math.sin((i / n) * Math.PI);
    return 0.18 + (h % 100) / 100 * 0.82 * (0.4 + env * 0.6);
  });
};

export default function ApniKahani() {
  useDocumentTitle("Apni Kahani");
  const [mode, setMode] = useState<Mode>("message");
  const [form, setForm] = useState<"Pendant" | "Ring band" | "Bangle">("Pendant");
  const [metal, setMetal] = useState("Gold 18K");
  const [text, setText] = useState("Tum hi ho, meri kahani");
  const [wave, setWave] = useState<number[] | null>(null);
  const [recording, setRecording] = useState(false);
  const [drawing, setDrawing] = useState<string | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const down = useRef(false);
  const id = useId().replace(/:/g, "");
  const addToCart = useStore((s) => s.addToCart);
  const saveDesign = useStore((s) => s.saveDesign);

  const col = metal.startsWith("Rose") ? pal.Rose : metal.startsWith("Silver") ? pal.Silver : pal.Gold;
  const bars = useMemo(() => wave ?? waveFrom(text), [wave, text]);
  const price = Math.round(({ Pendant: 9800, "Ring band": 12500, Bangle: 21500 }[form] * (mult[metal] ?? 1) + (mode === "message" ? text.length * 40 : 2200)) / 100) * 100;
  const summary = [`Mode: ${mode}`, `Form: ${form}`, `Metal: ${metal}`, mode === "message" ? `Message: “${text}”` : mode === "soundwave" ? `Soundwave of “${text || "your voice"}”` : "Handwriting traced from canvas"];

  useEffect(() => {
    const c = canvas.current; if (!c || mode !== "handwriting") return;
    const ctx = c.getContext("2d")!; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.strokeStyle = "#4a0f1d";
    const pos = (e: PointerEvent) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * c.width, ((e.clientY - r.top) / r.height) * c.height]; };
    const dn = (e: PointerEvent) => { down.current = true; const [x, y] = pos(e); ctx.beginPath(); ctx.moveTo(x, y); c.setPointerCapture(e.pointerId); };
    const mv = (e: PointerEvent) => { if (!down.current) return; const [x, y] = pos(e); ctx.lineTo(x, y); ctx.stroke(); };
    const up = () => { if (down.current) { down.current = false; setDrawing(c.toDataURL()); } };
    c.addEventListener("pointerdown", dn); c.addEventListener("pointermove", mv); c.addEventListener("pointerup", up);
    return () => { c.removeEventListener("pointerdown", dn); c.removeEventListener("pointermove", mv); c.removeEventListener("pointerup", up); };
  }, [mode]);

  const record = () => { setRecording(true); setTimeout(() => { setWave(Array.from({ length: 44 }, (_, i) => 0.15 + Math.random() * 0.85 * Math.sin((i / 44) * Math.PI) )); setRecording(false); toast("Voice captured (simulated) — soundwave generated"); }, 1800); };
  const clear = () => { const c = canvas.current; if (c) c.getContext("2d")!.clearRect(0, 0, c.width, c.height); setDrawing(null); };

  const frame = (
    <>
      <defs><linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={col[0]} /><stop offset=".5" stopColor={col[1]} /><stop offset="1" stopColor={col[2]} /></linearGradient><clipPath id={`${id}c`}><circle cx="200" cy="190" r="104" /></clipPath><path id={`${id}p`} d="M 200 190 m -86 0 a 86 86 0 1 1 172 0 a 86 86 0 1 1 -172 0" /></defs>
    </>
  );

  const art = (() => {
    if (form === "Pendant") return (
      <g><path d="M200 20 L200 60" stroke={`url(#${id}g)`} strokeWidth="4" /><circle cx="200" cy="66" r="9" fill="none" stroke={`url(#${id}g)`} strokeWidth="4" />
        <circle cx="200" cy="190" r="118" fill={`url(#${id}g)`} stroke={col[2]} strokeWidth="2" /><circle cx="200" cy="190" r="104" fill="#fbf3df" opacity=".18" /><circle cx="200" cy="190" r="104" fill="none" stroke="rgba(255,255,255,.55)" />
        <g clipPath={`url(#${id}c)`}>
          {mode === "soundwave" && bars.map((h, i) => (<rect key={i} x={110 + i * 4.4} y={190 - h * 62} width="2.6" height={h * 124} rx="1.3" fill={col[2]} />))}
          {mode === "handwriting" && (drawing ? <image href={drawing} x="96" y="130" width="208" height="120" /> : <text x="200" y="195" textAnchor="middle" fontSize="14" fill={col[2]} fontFamily="Inter">Draw to see it here</text>)}
          {mode === "message" && <text x="200" y="205" textAnchor="middle" fontFamily="Pinyon Script, cursive" fontSize={text.length > 18 ? 24 : 32} fill={col[2]}>{text.length > 22 ? text.slice(0, 22) + "…" : text}</text>}
        </g>
        {mode === "message" && <text fontSize="13" letterSpacing="3" fill={col[2]} fontFamily="Inter"><textPath href={`#${id}p`} startOffset="0">{" ✦ YOUR STORY ✦ APNI KAHANI ✦ SHRIING"}</textPath></text>}
      </g>);
    if (form === "Ring band") return (
      <g><ellipse cx="200" cy="200" rx="130" ry="130" fill="none" stroke={`url(#${id}g)`} strokeWidth="40" />
        <path id={`${id}r`} d="M 200 200 m -130 0 a 130 130 0 1 1 260 0 a 130 130 0 1 1 -260 0" fill="none" />
        {mode === "soundwave" ? bars.map((h, i) => { const a = (i / bars.length) * Math.PI * 2; return <line key={i} x1={200 + 118 * Math.cos(a)} y1={200 + 118 * Math.sin(a)} x2={200 + (118 + 20 * h) * Math.cos(a)} y2={200 + (118 + 20 * h) * Math.sin(a)} stroke={col[2]} strokeWidth="3" strokeLinecap="round" />; }) : (
          <text fontFamily="Pinyon Script, cursive" fontSize="26" fill={col[2]}><textPath href={`#${id}r`} startOffset="0">{mode === "message" ? (text + "  ✦  ").repeat(2) : "✦ handwritten with love ✦ handwritten with love ✦ "}</textPath></text>)}
        {mode === "handwriting" && drawing && <image href={drawing} x="130" y="160" width="140" height="80" opacity=".9" />}
      </g>);
    return (
      <g><rect x="40" y="130" width="320" height="120" rx="60" fill={`url(#${id}g)`} stroke={col[2]} strokeWidth="2" /><rect x="52" y="142" width="296" height="96" rx="48" fill="none" stroke="rgba(255,255,255,.5)" />
        {mode === "soundwave" && bars.map((h, i) => (<rect key={i} x={75 + i * 5.6} y={190 - h * 38} width="3" height={h * 76} rx="1.5" fill={col[2]} />))}
        {mode === "message" && <text x="200" y="198" textAnchor="middle" fontFamily="Pinyon Script, cursive" fontSize={text.length > 20 ? 22 : 30} fill={col[2]}>{text.slice(0, 26)}</text>}
        {mode === "handwriting" && drawing && <image href={drawing} x="90" y="145" width="220" height="90" />}
      </g>);
  })();

  return (
    <>
      <PageHero eyebrow="Apni Kahani" title="Turn Your Story Into Jewelry" sub="A message, your handwriting or the soundwave of a voice — transformed into a wearable design preview." image={pools.pendant[0]} />
      <div className="container-x grid gap-8 py-12 lg:grid-cols-[1fr_1fr]">
        <div className="card space-y-6 p-6 md:p-8">
          <Tabs value={mode} onChange={(m) => setMode(m)} tabs={[{ id: "message", label: "Message", icon: <Type size={15} /> }, { id: "handwriting", label: "Handwriting", icon: <PenLine size={15} /> }, { id: "soundwave", label: "Soundwave", icon: <AudioLines size={15} /> }]} />
          {mode === "message" && <label className="block"><span className="label">Your message (max 30 characters)</span><input className="input text-lg" maxLength={30} value={text} onChange={(e) => setText(e.target.value)} /></label>}
          {mode === "handwriting" && (<div><div className="flex items-center justify-between"><span className="label">Write or sign below</span><button onClick={clear} className="flex items-center gap-1 text-xs text-burgundy"><Eraser size={13} /> Clear</button></div><canvas ref={canvas} width={600} height={260} className="w-full touch-none rounded-sm border border-dashed border-gold/60 bg-white" style={{ cursor: "crosshair" }} aria-label="Handwriting canvas" /></div>)}
          {mode === "soundwave" && (<div><label className="block"><span className="label">Words / phrase to visualise</span><input className="input" value={text} onChange={(e) => { setText(e.target.value); setWave(null); }} placeholder="e.g. I love you" /></label><button onClick={record} disabled={recording} className="btn btn-outline mt-3 w-full"><Mic size={15} /> {recording ? "Listening…" : "Record a voice note (simulated)"}</button><div className="mt-4 flex h-16 items-end gap-0.5 rounded-sm bg-champagne/60 p-2">{bars.map((h, i) => (<span key={i} className="flex-1 rounded-full bg-burgundy/70" style={{ height: `${h * 100}%` }} />))}</div></div>)}
          <div><p className="label">Form</p><div className="flex gap-2">{(["Pendant", "Ring band", "Bangle"] as const).map((f) => (<button key={f} onClick={() => setForm(f)} className={cn("chip", form === f && "chip-active")}>{f}</button>))}</div></div>
          <div><p className="label">Metal</p><div className="flex flex-wrap gap-2">{Object.keys(mult).map((m) => (<button key={m} onClick={() => setMetal(m)} className={cn("chip", metal === m && "chip-active")}>{m}</button>))}</div></div>
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-b from-champagne to-ivory"><svg viewBox="0 0 400 340" className="mx-auto w-full max-w-md" role="img" aria-label="Apni Kahani design preview">{frame}{art}</svg></div>
            <div className="border-t border-sand p-6">
              <div className="flex items-end justify-between"><div><p className="label mb-0">Estimated price</p><p className="font-serif text-5xl text-burgundy-dark">{inr(price)}</p></div><p className="text-xs text-muted">Made-to-order · 12–18 days</p></div>
              <div className="mt-5 grid grid-cols-2 gap-3"><button onClick={() => { addToCart({ kind: "custom", name: `Apni Kahani ${form}`, brand: "Nayantara", image: pools.pendant[1], price, meta: summary }); toast("Added to cart"); }} className="btn btn-primary col-span-2 py-4"><ShoppingBag size={16} /> Add to cart</button><button onClick={() => { saveDesign({ kind: "kahani", name: `Apni Kahani ${form}`, price, options: { mode, form, metal, text }, summary }); toast("Design saved"); }} className="btn btn-outline"><Save size={15} /> Save</button><button onClick={async () => { await copyText(`My Apni Kahani design on SHRIING\n${summary.join("\n")}\n${inr(price)}`); toast("Design summary copied"); }} className="btn btn-outline"><Share2 size={15} /> Share</button></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
