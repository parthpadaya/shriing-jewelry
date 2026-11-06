import { ImagePlus, RotateCcw, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LookCard } from "@/components/product/LookCard";
import { outfitColors } from "@/data/collections";
import { useDocumentTitle } from "@/hooks";
import { dominantColor } from "@/utils/image";
import { parseBudget, parseColor, parseOccasion, recommend, type Look, type StyleInput } from "@/utils/stylist";
import { inr } from "@/utils/format";
import { cn } from "@/utils/cn";

type Msg = { id: number; from: "bot" | "me"; node: ReactNode };
type Step = "occasion" | "outfit" | "budget" | "prefs" | "done";

const occasionsList = ["Bridal", "Wedding", "Festive", "Party", "Engagement", "Daily Wear"];
const budgets = [50000, 100000, 200000, 300000, 500000];
const prefList = ["Traditional", "Contemporary", "Minimal", "Statement", "Gold", "Diamond", "Pearl", "Gemstone"];

export default function AIStylist() {
  useDocumentTitle("AI Jewelry Stylist");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [step, setStep] = useState<Step>("occasion");
  const [input, setInput] = useState<StyleInput>({ color: "", occasion: "", budget: 0, prefs: [] });
  const [prefs, setPrefs] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [looks, setLooks] = useState<Look[] | null>(null);
  const idRef = useRef(0);
  const end = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const started = useRef(false);

  const push = (from: "bot" | "me", node: ReactNode) => setMsgs((m) => [...m, { id: idRef.current++, from, node }]);
  const botSay = (node: ReactNode, delay = 700) => new Promise<void>((res) => { setTyping(true); setTimeout(() => { setTyping(false); push("bot", node); res(); }, delay); });

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, typing, looks, step]);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => { await botSay(<p>Namaste! I'm your SHRIING stylist ✨ Tell me about the occasion and I'll match jewelry to your outfit, mood and budget.</p>, 400); await botSay(<p>What are you dressing up for? You can also type something like <i>“red bridal lehenga, budget ₹2 lakh”</i>.</p>, 600); })();
  }, []);

  const nextAsk = async (cur: StyleInput) => {
    if (!cur.occasion) { setStep("occasion"); return botSay(<p>What's the occasion?</p>); }
    if (!cur.color) { setStep("outfit"); return botSay(<p>Lovely. What colour is your outfit? Pick a shade — or upload a photo of your lehenga or saree and I'll read the colour.</p>); }
    if (!cur.budget) { setStep("budget"); return botSay(<p>And what budget should I work within?</p>); }
    setStep("prefs");
    return botSay(<p>Almost there! Any jewelry preferences? Pick as many as you like, then tap <b>Show my looks</b>.</p>);
  };

  const merge = async (patch: Partial<StyleInput>, said: ReactNode) => {
    push("me", said);
    const cur = { ...input, ...patch };
    setInput(cur);
    await nextAsk(cur);
  };

  const finish = async (cur: StyleInput) => {
    setStep("done");
    await botSay(<p>Reading your palette and weaving a look around <b>{cur.color}</b> for a <b>{cur.occasion.toLowerCase()}</b>… ✨</p>, 900);
    const ls = [0, 1, 2].map((v) => recommend(cur, v));
    setLooks(ls);
    await botSay(<p>Here are three curated looks within {inr(cur.budget)}. Add a whole look to your cart, or tap any piece for details.</p>, 500);
  };

  const onText = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || typing) return;
    setText("");
    const patch: Partial<StyleInput> = {};
    const c = parseColor(t), b = parseBudget(t), o = parseOccasion(t);
    if (c) patch.color = c;
    if (b) patch.budget = b;
    if (o) patch.occasion = o;
    push("me", <p>{t}</p>);
    if (!Object.keys(patch).length) return botSay(<p>I couldn't catch an occasion, colour or budget there. Try “maroon wedding saree under 1.5 lakh”, or use the quick options below.</p>);
    const cur = { ...input, ...patch };
    setInput(cur);
    if (cur.occasion && cur.color && cur.budget && step !== "prefs") { setStep("prefs"); return botSay(<p>Got it — {cur.occasion.toLowerCase()}, {cur.color.toLowerCase()}, {inr(cur.budget)}. Any style preferences before I style you?</p>); }
    await nextAsk(cur);
  };

  const onUpload = async (f?: File | null) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    push("me", <img src={url} alt="Uploaded outfit" className="max-h-56 rounded-sm" />);
    const c = await dominantColor(url);
    const cur = { ...input, color: c };
    setInput(cur);
    await botSay(<p>Beautiful! I read the dominant tone as <b>{c}</b>. {" "}</p>, 900);
    await nextAsk(cur);
  };

  const restart = () => { setMsgs([]); setInput({ color: "", occasion: "", budget: 0, prefs: [] }); setPrefs([]); setLooks(null); setStep("occasion"); started.current = false; idRef.current = 0; setTimeout(() => { started.current = true; botSay(<p>Fresh start! What's the occasion?</p>, 400); }, 50); };

  const chips = step === "occasion" ? occasionsList.map((o) => ({ k: o, label: o, on: () => merge({ occasion: o }, <p>{o}</p>) }))
    : step === "outfit" ? outfitColors.map((c) => ({ k: c.name, label: c.name, hex: c.hex, on: () => merge({ color: c.name }, <p>{c.name} outfit</p>) }))
    : step === "budget" ? budgets.map((b) => ({ k: String(b), label: `Under ${inr(b)}`, on: () => merge({ budget: b }, <p>Budget: {inr(b)}</p>) })) : [];

  return (
    <div className="bg-champagne/40">
      <div className="container-x py-10 md:py-14">
        <div className="mx-auto max-w-3xl text-center"><p className="eyebrow flex items-center justify-center gap-2"><Sparkles size={14} /> AI Jewelry Stylist</p><h1 className="mt-2 sm:mt-3 font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-burgundy-dark leading-tight">Dress your jewels to your outfit</h1><p className="mt-2 sm:mt-3 text-xs sm:text-base text-muted">A simulated stylist — recommendations come from rules over our catalogue, no external AI.</p></div>
        <div className="card mx-auto mt-6 sm:mt-10 flex h-[min(760px,82vh)] max-w-3xl flex-col overflow-hidden">
          <div className="flex items-center justify-between bg-burgundy px-4 sm:px-5 py-3 text-ivory"><div className="flex items-center gap-2.5 sm:gap-3"><span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gold/20 text-gold-light shrink-0"><Sparkles size={16} /></span><div><p className="font-serif text-lg sm:text-xl leading-none">Stylist Aarna</p><p className="text-[10px] sm:text-[11px] text-ivory/60">{typing ? "typing…" : "online"}</p></div></div><button onClick={restart} className="flex items-center gap-1.5 text-xs text-ivory/80 hover:text-gold-light"><RotateCcw size={13} /> Start over</button></div>
          <div className="flex-1 space-y-4 overflow-y-auto bg-ivory p-3.5 sm:p-5">
            {msgs.map((m) => (<div key={m.id} className={cn("flex", m.from === "me" && "justify-end")}><div className={cn("max-w-[88%] sm:max-w-[85%] rounded-md px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm leading-relaxed", m.from === "me" ? "bg-burgundy text-ivory" : "bg-white text-ink shadow-soft")}>{m.node}</div></div>))}
            {typing && <div className="flex"><div className="flex gap-1 rounded-md bg-white px-4 py-3 shadow-soft">{[0, 1, 2].map((i) => (<span key={i} className="h-2 w-2 animate-bounce rounded-full bg-gold" style={{ animationDelay: `${i * 0.15}s` }} />))}</div></div>}
            {looks && <div className="space-y-5 pt-2">{looks.map((l) => (<LookCard key={l.title} look={l} budget={input.budget} />))}</div>}
            <div ref={end} />
          </div>
          <div className="border-t border-sand bg-white p-3 sm:p-4">
            {step === "prefs" && !typing && (<div className="mb-3"><div className="flex flex-wrap gap-2">{prefList.map((p) => (<button key={p} onClick={() => setPrefs((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]))} className={cn("chip", prefs.includes(p) && "chip-active")}>{p}</button>))}</div><button onClick={() => { const cur = { ...input, prefs }; setInput(cur); push("me", <p>{prefs.length ? prefs.join(", ") : "No special preferences"}</p>); finish(cur); }} className="btn btn-primary mt-3 w-full"><Sparkles size={15} /> Show my looks</button></div>)}
            {!typing && chips.length > 0 && (<div className="no-scrollbar mb-3 flex max-h-28 flex-wrap gap-1.5 sm:gap-2 overflow-y-auto">{chips.map((c) => (<button key={c.k} onClick={c.on} className="chip text-xs">{(c as { hex?: string }).hex ? <span className="h-3 w-3 rounded-full border border-black/10" style={{ background: (c as { hex?: string }).hex }} /> : null}{c.label}</button>))}</div>)}
            <form onSubmit={onText} className="flex gap-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { onUpload(e.target.files?.[0]); e.target.value = ""; }} />
              <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-outline px-2.5 sm:px-3 shrink-0" aria-label="Upload outfit image"><ImagePlus size={18} /></button>
              <input value={text} onChange={(e) => setText(e.target.value)} className="input text-xs sm:text-sm" placeholder="e.g. Red bridal lehenga, ₹2 lakh…" aria-label="Message the stylist" />
              <button className="btn btn-primary px-3 sm:px-4 shrink-0" aria-label="Send"><Send size={16} /></button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
