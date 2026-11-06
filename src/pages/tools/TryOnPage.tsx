import { motion } from "framer-motion";
import { Camera, CameraOff, Upload } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/common/ui";
import { IMG } from "@/data/images";
import { useDocumentTitle, useObjectUrl } from "@/hooks";
import { toast } from "@/store/useStore";
import { cn } from "@/utils/cn";

const metals = { Gold: ["#F7E394", "#D4AF37", "#8F6F24"], Rose: ["#F7D2C4", "#D99A86", "#9A5D4B"], Silver: ["#F6F7F9", "#C9CCD1", "#8A8F98"] } as const;
type Kind = "Earrings" | "Necklace" | "Maang Tikka";

function Piece({ kind, metal, id }: { kind: Kind; metal: keyof typeof metals; id: string }) {
  const [l, b, d] = metals[metal];
  const grad = <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={l} /><stop offset=".5" stopColor={b} /><stop offset="1" stopColor={d} /></linearGradient></defs>;
  if (kind === "Earrings")
    return (<svg viewBox="0 0 40 90" className="h-full w-full drop-shadow-lg">{grad}<circle cx="20" cy="8" r="5" fill={`url(#${id})`} /><path d="M6 36 Q20 20 34 36 L38 56 H2Z" fill={`url(#${id})`} stroke={d} strokeWidth=".8" /><circle cx="20" cy="42" r="4" fill="#C0152F" stroke={d} strokeWidth=".6" />{[8, 20, 32].map((x) => (<circle key={x} cx={x} cy="56" r="2.2" fill={`url(#${id})`} />))}{[10, 20, 30].map((x, i) => (<circle key={x} cx={x} cy={66 + (i === 1 ? 6 : 0)} r="5" fill="#f5efe2" stroke="#cfc3ae" strokeWidth=".6" />))}</svg>);
  if (kind === "Necklace")
    return (<svg viewBox="0 0 300 160" className="h-full w-full drop-shadow-lg">{grad}<path d="M10 6 Q150 190 290 6" fill="none" stroke={`url(#${id})`} strokeWidth="5" strokeDasharray="8 4" strokeLinecap="round" /><path d="M150 100 C 170 122 172 138 150 150 C 128 138 130 122 150 100Z" fill="#1f8a5a" stroke={d} strokeWidth="1.5" /><circle cx="150" cy="95" r="4" fill={`url(#${id})`} />{[-60, -30, 30, 60].map((x) => (<circle key={x} cx={150 + x} cy={Math.abs(x) > 40 ? 76 : 88} r="5" fill="#f5efe2" stroke="#cfc3ae" />))}</svg>);
  return (<svg viewBox="0 0 200 120" className="h-full w-full drop-shadow-lg">{grad}<path d="M5 8 Q100 -4 195 8" fill="none" stroke={`url(#${id})`} strokeWidth="3" /><path d="M100 4 L100 30" stroke={`url(#${id})`} strokeWidth="3" /><path d="M100 30 C 130 50 128 90 100 112 C 72 90 70 50 100 30Z" fill={`url(#${id})`} stroke={d} strokeWidth="1.5" /><circle cx="100" cy="64" r="11" fill="#C0152F" stroke={d} /><circle cx="100" cy="112" r="5" fill="#f5efe2" stroke="#cfc3ae" /></svg>);
}

export default function TryOnPage() {
  useDocumentTitle("Virtual Try-On");
  const [mode, setMode] = useState<"sample" | "camera" | "upload">("sample");
  const [photo, setPhoto] = useObjectUrl();
  const [kind, setKind] = useState<Kind>("Earrings");
  const [metal, setMetal] = useState<keyof typeof metals>("Gold");
  const [size, setSize] = useState(100);
  const [spread, setSpread] = useState(46);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");

  const stop = () => { stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null; };
  useEffect(() => stop, []);

  const startCamera = async () => {
    try {
      stop();
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      stream.current = s; setMode("camera");
      setTimeout(() => { if (video.current) { video.current.srcObject = s; video.current.play().catch(() => undefined); } }, 50);
    } catch {
      toast("Camera unavailable — try uploading a photo instead");
      setMode("upload");
    }
  };

  const base = size / 100;
  const place = kind === "Earrings" ? { top: "40%", left: "50%" } : kind === "Necklace" ? { top: "66%", left: "50%" } : { top: "17%", left: "50%" };

  return (
    <>
      <PageHero eyebrow="Virtual Try-On" title="See It On You" sub="Use your camera or a photo, then drag, resize and recolour simulated jewelry overlays." image={IMG.jhumka} />
      <div className="container-x grid gap-8 py-12 lg:grid-cols-[1fr_380px]">
        <div>
          <div ref={box} className="relative mx-auto aspect-[3/4] w-full max-w-lg touch-none overflow-hidden rounded-md bg-ink shadow-lift">
            {mode === "camera" ? <video ref={video} muted playsInline className="h-full w-full -scale-x-100 object-cover" /> : <img src={mode === "upload" && photo ? photo : IMG.portrait} alt="Try-on base" className="h-full w-full object-cover" />}
            {kind === "Earrings" ? (
              <motion.div drag dragConstraints={box} dragMomentum={false} className="absolute z-10 cursor-grab active:cursor-grabbing" style={{ top: place.top, left: "50%", width: `${spread * 2}%`, marginLeft: `-${spread}%`, height: `${12 * base * 2}%` }}>
                <div className="absolute left-0 h-full" style={{ width: `${26 * base}%` }}><Piece kind="Earrings" metal={metal} id={`${id}a`} /></div>
                <div className="absolute right-0 h-full" style={{ width: `${26 * base}%` }}><Piece kind="Earrings" metal={metal} id={`${id}b`} /></div>
              </motion.div>
            ) : (
              <motion.div drag dragConstraints={box} dragMomentum={false} className="absolute z-10 cursor-grab active:cursor-grabbing" style={{ top: place.top, left: place.left, width: `${(kind === "Necklace" ? 52 : 26) * base}%`, translate: "-50% -50%" }}>
                <Piece kind={kind} metal={metal} id={`${id}c`} />
              </motion.div>
            )}
            <span className="absolute top-3 left-3 rounded-full bg-black/55 px-3 py-1 text-[11px] tracking-widest text-white uppercase">Simulated overlay · drag to adjust</span>
          </div>
        </div>
        <div className="card h-fit space-y-6 p-6">
          <div><p className="label">Source</p><div className="grid grid-cols-3 gap-2"><button onClick={startCamera} className={cn("btn btn-sm border border-sand", mode === "camera" && "bg-burgundy text-ivory")}><Camera size={14} /> Camera</button><label className={cn("btn btn-sm cursor-pointer border border-sand", mode === "upload" && "bg-burgundy text-ivory")}><Upload size={14} /> Upload<input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { stop(); setPhoto(f); setMode("upload"); } }} /></label><button onClick={() => { stop(); setMode("sample"); }} className={cn("btn btn-sm border border-sand", mode === "sample" && "bg-burgundy text-ivory")}><CameraOff size={14} /> Sample</button></div></div>
          <div><p className="label">Jewelry</p><div className="flex flex-wrap gap-2">{(["Earrings", "Necklace", "Maang Tikka"] as Kind[]).map((k) => (<button key={k} onClick={() => setKind(k)} className={cn("chip", kind === k && "chip-active")}>{k}</button>))}</div></div>
          <div><p className="label">Metal</p><div className="flex gap-3">{(Object.keys(metals) as (keyof typeof metals)[]).map((m) => (<button key={m} onClick={() => setMetal(m)} aria-label={m} title={m} className={cn("h-9 w-9 rounded-full border-2", metal === m ? "scale-110 border-burgundy" : "border-white ring-1 ring-sand")} style={{ background: metals[m][1] }} />))}</div></div>
          <div><div className="flex justify-between"><span className="label">Size</span><span className="text-xs">{size}%</span></div><input type="range" min={50} max={180} value={size} onChange={(e) => setSize(+e.target.value)} className="w-full accent-burgundy" aria-label="Size" /></div>
          {kind === "Earrings" && <div><div className="flex justify-between"><span className="label">Spacing</span></div><input type="range" min={30} max={60} value={spread} onChange={(e) => setSpread(+e.target.value)} className="w-full accent-burgundy" aria-label="Spacing" /></div>}
          <div className="flex gap-3"><button onClick={() => toast("Look saved to your device (simulated)")} className="btn btn-outline flex-1">Save look</button><Link to={`/shop?type=${kind === "Maang Tikka" ? "Maang Tikka" : kind === "Earrings" ? "Earrings" : "Necklace"}`} className="btn btn-primary flex-1">Shop this style</Link></div>
          <p className="text-xs text-muted">Your photo or camera feed never leaves your browser.</p>
        </div>
      </div>
    </>
  );
}
