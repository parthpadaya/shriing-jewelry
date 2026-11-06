import { ImagePlus, X } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/utils/cn";

export function ImageUpload({ preview, onFile, label = "Upload image", hint = "JPG or PNG up to 10MB", className, aspect = "aspect-[4/3]" }: { preview: string | null; onFile: (f: File | null) => void; label?: string; hint?: string; className?: string; aspect?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className={cn("relative", className)}>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
      {preview ? (
        <div className={cn("relative overflow-hidden rounded-md border border-sand bg-champagne", aspect)}>
          <img src={preview} alt="Uploaded preview" className="h-full w-full object-cover" />
          <button onClick={() => { onFile(null); if (ref.current) ref.current.value = ""; }} className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 shadow hover:bg-white" aria-label="Remove image">
            <X size={16} />
          </button>
          <button onClick={() => ref.current?.click()} className="absolute bottom-2 left-2 rounded-sm bg-white/90 px-3 py-1.5 text-xs font-medium shadow hover:bg-white">Replace</button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0] ?? null); }}
          className={cn("flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gold/50 bg-champagne/40 p-6 text-center transition hover:border-gold hover:bg-champagne", aspect)}
        >
          <ImagePlus className="text-gold-dark" size={28} />
          <span className="text-sm font-medium text-burgundy-dark">{label}</span>
          <span className="text-xs text-muted">{hint} · or drag & drop</span>
        </button>
      )}
    </div>
  );
}
