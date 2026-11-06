import { Check } from "lucide-react";
import type { DesignState, Group } from "@/utils/customizer";
import { cn } from "@/utils/cn";
import { compactInr } from "@/utils/format";

export function OptionGroup({ group, value, onChange }: { group: Group; value: string | number; onChange: (v: string | number) => void }) {
  return (
    <fieldset className="border-b border-sand/70 py-5 first:pt-0 last:border-0">
      <legend className="mb-3 flex w-full items-center justify-between text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
        <span>{group.label}</span>
        {(group.kind === "range") && <span className="text-sm tracking-normal text-burgundy normal-case">{group.unit === "₹" ? compactInr(Number(value)) : `${value}${group.unit ? " " + group.unit : ""}`}</span>}
      </legend>
      {group.kind === "choice" && (
        <div className="flex flex-wrap gap-2">
          {group.options?.map((o) => (
            <button key={o.value} type="button" onClick={() => onChange(o.value)} className={cn("chip", String(value) === o.value && "chip-active")} aria-pressed={String(value) === o.value}>
              {o.hex && <span className="h-3 w-3 rounded-full border border-black/10" style={{ background: o.hex }} />}
              {o.label}
            </button>
          ))}
        </div>
      )}
      {group.kind === "swatch" && (
        <div className="flex flex-wrap gap-3">
          {group.options?.map((o) => (
            <button key={o.value} type="button" onClick={() => onChange(o.value)} title={o.label} aria-label={o.label} aria-pressed={String(value) === o.value}
              className={cn("relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition", String(value) === o.value ? "scale-110 border-burgundy shadow-soft" : "border-white shadow ring-1 ring-sand")} style={{ background: o.hex }}>
              {String(value) === o.value && <Check size={16} className="text-burgundy-dark drop-shadow" />}
            </button>
          ))}
          <span className="self-center text-xs text-muted">{group.options?.find((o) => o.value === String(value))?.label}</span>
        </div>
      )}
      {group.kind === "range" && (
        <>
          <input type="range" min={group.min} max={group.max} step={group.step} value={Number(value)} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-burgundy" aria-label={group.label} />
          <div className="mt-1 flex justify-between text-[11px] text-muted"><span>{group.unit === "₹" ? compactInr(group.min!) : group.min}</span><span>{group.unit === "₹" ? compactInr(group.max!) : group.max}</span></div>
          {group.help && <p className="mt-1 text-xs text-muted">{group.help}</p>}
        </>
      )}
      {group.kind === "text" && (
        <input className="input" value={String(value)} maxLength={group.maxLength} placeholder={group.placeholder} onChange={(e) => onChange(e.target.value)} aria-label={group.label} />
      )}
      {group.kind === "multi" && (
        <div className="flex flex-wrap gap-2">
          {group.options?.map((o) => {
            const sel = String(value).split(",").filter(Boolean);
            const on = sel.includes(o.value);
            return (
              <button key={o.value} type="button" onClick={() => {
                const next = on ? sel.filter((x) => x !== o.value) : sel.length < (group.max ?? 5) ? [...sel, o.value] : sel;
                onChange(next.join(","));
              }} className={cn("chip", on && "chip-active")} aria-pressed={on}>
                {o.label} <span className="opacity-60">+{compactInr(o.add ?? 0)}</span>
              </button>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}

export type { DesignState };
