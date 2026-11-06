import { AnimatePresence, motion } from "framer-motion";
import { GitCompareArrows, MessageCircle, Send, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProduct } from "@/data/products";
import { useStore, useUI } from "@/store/useStore";
import { languages, t } from "@/utils/i18n";
import { useGoldRate } from "@/hooks";
import type { LangCode } from "@/types";

export function CompareBar() {
  const lang = useStore((s) => s.language);
  const compare = useStore((s) => s.compare);
  const clear = useStore((s) => s.clearCompare);
  const toggle = useStore((s) => s.toggleCompare);
  return (
    <AnimatePresence>
      {compare.length > 0 && (
        <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} className="fixed inset-x-0 bottom-0 z-[55] border-t border-gold/40 bg-burgundy-dark text-ivory shadow-lift">
          <div className="container-x flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <GitCompareArrows size={18} className="text-gold-light" />
              <div className="flex gap-2">
                {compare.map((id) => {
                  const p = getProduct(id);
                  return p ? (
                    <div key={id} className="relative">
                      <img src={p.images[0]} alt={p.name} className="h-11 w-11 rounded-sm border border-gold/40 object-cover" />
                      <button onClick={() => toggle(id)} aria-label="Remove" className="absolute -top-1.5 -right-1.5 rounded-full bg-ivory p-0.5 text-burgundy"><X size={10} /></button>
                    </div>
                  ) : null;
                })}
              </div>
              <span className="hidden text-sm text-ivory/70 sm:inline">{compare.length}/4 {t(lang, "compareBtn")}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={clear} className="btn btn-sm text-ivory/80 hover:text-ivory">X</button>
              <Link to="/compare" className="btn btn-gold btn-sm">{t(lang, "compareBtn")}</Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type Msg = { from: "bot" | "me"; text: string };

export function VernacularAssistant() {
  const { assistantOpen, setAssistant } = useUI();
  const lang = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);
  const { rate } = useGoldRate();
  const nav = useNavigate();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { setMsgs([{ from: "bot", text: t(lang, "greet") }]); }, [lang]);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const quick = [
    { label: t(lang, "customize"), to: "/customize" },
    { label: t(lang, "bridal"), to: "/bridal" },
    { label: t(lang, "aiStylist"), to: "/ai-stylist" },
    { label: t(lang, "shop"), to: "/shop" },
  ];

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const q = text.trim();
    if (!q) return;
    const l = q.toLowerCase();
    let reply = t(lang, "assistantHelp");
    if (/gold|rate|सोना|भाव|தங்க|బంగారు|ಚಿನ್ನ|সোনা|સોના|सोन्या/.test(l)) {
      reply = `${t(lang, "goldRate")}: 24K ₹${rate.toLocaleString("en-IN")}/g · 22K ₹${Math.round(rate * 0.9167).toLocaleString("en-IN")}/g`;
    } else if (/deliver|ship|कब|days|डिलीवरी/.test(l)) {
      reply = t(lang, "readyToShipMsg");
    } else if (/custom|design|engrav|डिज़ाइन|कस्टमाइज़/.test(l)) {
      reply = t(lang, "customDesignMsg");
    } else if (/bride|bridal|wedding|shaadi|शादी|दुल्हन/.test(l)) {
      reply = t(lang, "bridalSetMsg");
    } else if (/return|exchange|वापसी|एक्सचेंज/.test(l)) {
      reply = t(lang, "returnsExchangeMsg");
    }
    setMsgs((m) => [...m, { from: "me", text: q }, { from: "bot", text: reply }]);
    setText("");
  };

  return (
    <>
      <button onClick={() => setAssistant(!assistantOpen)} aria-label="Open assistant" className="fixed right-4 bottom-4 z-[56] flex h-14 w-14 items-center justify-center rounded-full bg-burgundy text-gold-light shadow-lift transition hover:scale-105 sm:right-6 sm:bottom-6">
        {assistantOpen ? <X /> : <MessageCircle />}
      </button>
      <AnimatePresence>
        {assistantOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} className="fixed right-4 bottom-24 z-[56] flex h-[480px] max-h-[70vh] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-md border border-sand bg-ivory shadow-lift sm:right-6">
            <div className="bg-burgundy px-4 py-3 text-ivory">
              <div className="flex items-center justify-between">
                <p className="font-serif text-xl">{t(lang, "sahayakTitle")}</p>
                <select value={lang} onChange={(e) => setLanguage(e.target.value as LangCode)} className="rounded-sm border border-gold/40 bg-burgundy-dark px-2 py-1 text-xs" aria-label="Assistant language">
                  {languages.map((l) => (<option key={l.code} value={l.code}>{l.native}</option>))}
                </select>
              </div>
              <p className="text-xs text-ivory/60">{t(lang, "assistantSub")}</p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <div key={i} className={m.from === "me" ? "flex justify-end" : "flex"}>
                  <p className={`max-w-[85%] rounded-md px-3.5 py-2.5 text-sm leading-relaxed ${m.from === "me" ? "bg-burgundy text-ivory" : "bg-white text-ink shadow-soft"}`}>{m.text}</p>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-1">
                {quick.map((q) => (<button key={q.to} onClick={() => { nav(q.to); setAssistant(false); }} className="chip">{q.label}</button>))}
              </div>
              <div ref={end} />
            </div>
            <form onSubmit={send} className="flex gap-2 border-t border-sand p-3">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t(lang, "ask")} className="input" aria-label="Message" />
              <button className="btn btn-primary px-3" aria-label="Send"><Send size={16} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
