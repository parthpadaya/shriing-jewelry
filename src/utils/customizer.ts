import { GOLD_24K, GST_RATE } from "./format";

export type Opt = { value: string; label: string; hex?: string; add?: number; mult?: number; w?: number };
export type Group = {
  key: string;
  label: string;
  kind: "choice" | "swatch" | "text" | "range" | "multi";
  options?: Opt[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
  maxLength?: number;
  help?: string;
};
export type BuilderKind = "ring" | "necklace" | "jhumka" | "bracelet";
export type DesignState = Record<string, string | number>;

const rates: Record<string, number> = {
  "24K": GOLD_24K,
  "22K": GOLD_24K * 0.9167,
  "18K": GOLD_24K * 0.75,
  "14K": GOLD_24K * 0.585,
  "Silver 925": 95,
  "Platinum 950": 3650,
};
export const metalRate = (m: string) => rates[m] ?? rates["18K"];

const metalColors: Opt[] = [
  { value: "Yellow", label: "Yellow Gold", hex: "#E0B848" },
  { value: "White", label: "White Gold", hex: "#E3E4E8" },
  { value: "Rose", label: "Rose Gold", hex: "#E6A596" },
];

export const metalPalette = (state: DesignState, metalKey: string) => {
  const m = String(state[metalKey] ?? "18K");
  const col = m.startsWith("Silver") || m.startsWith("Platinum") ? "White" : String(state.metalColor ?? "Yellow");
  if (col === "White") return { base: "#C9CCD1", light: "#F6F7F9", dark: "#8A8F98" };
  if (col === "Rose") return { base: "#D99A86", light: "#F7D2C4", dark: "#9A5D4B" };
  return { base: "#D4AF37", light: "#F7E394", dark: "#8F6F24" };
};

const ringMetals: Opt[] = ["18K", "14K", "22K", "Silver 925", "Platinum 950"].map((v) => ({ value: v, label: v === "Silver 925" || v === "Platinum 950" ? v : `${v} Gold` }));
const necklaceMetals: Opt[] = ["22K", "18K", "14K", "Silver 925"].map((v) => ({ value: v, label: v === "Silver 925" ? v : `${v} Gold` }));
const stoneColors: Opt[] = [
  { value: "White", label: "White", hex: "#EAF4FB" },
  { value: "Red", label: "Ruby Red", hex: "#C0152F" },
  { value: "Green", label: "Emerald Green", hex: "#148A5A" },
  { value: "Blue", label: "Sapphire Blue", hex: "#243F94" },
  { value: "Pink", label: "Rose Pink", hex: "#E7679C" },
  { value: "Yellow", label: "Citrine Yellow", hex: "#F0C53C" },
  { value: "Purple", label: "Amethyst", hex: "#6B3FA0" },
];

export interface BuilderConfig {
  kind: BuilderKind;
  title: string;
  blurb: string;
  metalKey: string;
  groups: Group[];
  defaults: DesignState;
}

export const builders: Record<BuilderKind, BuilderConfig> = {
  ring: {
    kind: "ring",
    title: "Ring Builder",
    blurb: "From solitaire to cocktail — craft a ring that fits your story.",
    metalKey: "metal",
    defaults: { ringType: "Solitaire", metal: "18K", metalColor: "Yellow", stone: "Diamond", shape: "Round", stoneColor: "White", size: 14, engraving: "", budget: 150000 },
    groups: [
      { key: "ringType", label: "Ring type", kind: "choice", options: [
        { value: "Solitaire", label: "Solitaire", w: 3.4, add: 0, mult: 1 },
        { value: "Halo", label: "Halo", w: 4.2, add: 9500, mult: 1 },
        { value: "Three-Stone", label: "Three-Stone", w: 4.6, add: 14000, mult: 1 },
        { value: "Eternity", label: "Eternity Band", w: 4, add: 22000, mult: 0.4 },
        { value: "Cocktail", label: "Cocktail", w: 7.2, add: 0, mult: 1.35 },
        { value: "Signet", label: "Signet", w: 8.5, add: 0, mult: 0.2 },
      ] },
      { key: "metal", label: "Metal", kind: "choice", options: ringMetals },
      { key: "metalColor", label: "Metal colour", kind: "swatch", options: metalColors },
      { key: "stone", label: "Stone type", kind: "choice", options: [
        { value: "Diamond", label: "Diamond", add: 42000 },
        { value: "Ruby", label: "Ruby", add: 24000 },
        { value: "Emerald", label: "Emerald", add: 28000 },
        { value: "Sapphire", label: "Sapphire", add: 26000 },
        { value: "Moissanite", label: "Moissanite", add: 7500 },
        { value: "Pearl", label: "Pearl", add: 5200 },
        { value: "None", label: "No stone", add: 0 },
      ] },
      { key: "shape", label: "Stone shape", kind: "choice", options: [
        { value: "Round", label: "Round", mult: 1 }, { value: "Princess", label: "Princess", mult: 0.96 }, { value: "Oval", label: "Oval", mult: 1.08 },
        { value: "Pear", label: "Pear", mult: 1.1 }, { value: "Emerald", label: "Emerald cut", mult: 1.06 }, { value: "Cushion", label: "Cushion", mult: 1.04 },
      ] },
      { key: "stoneColor", label: "Stone colour", kind: "swatch", options: stoneColors },
      { key: "size", label: "Ring size (Indian)", kind: "range", min: 8, max: 24, step: 1, help: "Not sure? Use our size guide at checkout." },
      { key: "engraving", label: "Engraving (inside band)", kind: "text", maxLength: 14, placeholder: "e.g. Forever, A & R" },
      { key: "budget", label: "Your budget", kind: "range", min: 10000, max: 500000, step: 5000, unit: "₹" },
    ],
  },
  necklace: {
    kind: "necklace",
    title: "Necklace Builder",
    blurb: "Pick the chain, the pendant, the stone — we'll string it together.",
    metalKey: "purity",
    defaults: { type: "Princess", chain: "Cable", pendant: "Solitaire Drop", purity: "18K", metalColor: "Yellow", gemstone: "Diamond", length: 18, name: "", initial: "" },
    groups: [
      { key: "type", label: "Necklace type", kind: "choice", options: [
        { value: "Choker", label: "Choker", w: 0.8 }, { value: "Princess", label: "Princess", w: 1 }, { value: "Matinee", label: "Matinee", w: 1.2 },
        { value: "Rani Haar", label: "Rani Haar", w: 2.6 }, { value: "Mangalsutra", label: "Mangalsutra", w: 1.4 }, { value: "Pendant Necklace", label: "Pendant Necklace", w: 1 },
      ] },
      { key: "chain", label: "Chain style", kind: "choice", options: [
        { value: "Rope", label: "Rope", mult: 1 }, { value: "Cable", label: "Cable", mult: 0.9 }, { value: "Box", label: "Box", mult: 1.1 },
        { value: "Figaro", label: "Figaro", mult: 1.15 }, { value: "Snake", label: "Snake", mult: 1.25 }, { value: "Beaded", label: "Beaded", mult: 1.05 },
      ] },
      { key: "pendant", label: "Pendant", kind: "choice", options: [
        { value: "None", label: "None", w: 0 }, { value: "Solitaire Drop", label: "Solitaire Drop", w: 1.6 }, { value: "Heart", label: "Heart", w: 2.2 },
        { value: "Lotus", label: "Lotus", w: 3 }, { value: "Om", label: "Om", w: 2.4 }, { value: "Peacock", label: "Peacock", w: 4 }, { value: "Initial Disc", label: "Initial Disc", w: 2 },
      ] },
      { key: "purity", label: "Metal purity", kind: "choice", options: necklaceMetals },
      { key: "metalColor", label: "Metal colour", kind: "swatch", options: metalColors },
      { key: "gemstone", label: "Gemstone", kind: "choice", options: [
        { value: "None", label: "None", add: 0, hex: "#EAF4FB" }, { value: "Diamond", label: "Diamond", add: 28000, hex: "#EAF4FB" }, { value: "Ruby", label: "Ruby", add: 16000, hex: "#C0152F" },
        { value: "Emerald", label: "Emerald", add: 19000, hex: "#148A5A" }, { value: "Sapphire", label: "Sapphire", add: 17000, hex: "#243F94" },
        { value: "Pearl", label: "Pearl", add: 6500, hex: "#F3EEE4" }, { value: "Amethyst", label: "Amethyst", add: 4200, hex: "#6B3FA0" },
      ] },
      { key: "length", label: "Length", kind: "range", min: 14, max: 32, step: 1, unit: "in" },
      { key: "name", label: "Name engraving", kind: "text", maxLength: 12, placeholder: "e.g. Aarohi" },
      { key: "initial", label: "Initial engraving", kind: "text", maxLength: 1, placeholder: "A" },
    ],
  },
  jhumka: {
    kind: "jhumka",
    title: "Jhumka Builder",
    blurb: "Dome, drops, stones, finish — design jhumkas that swing just right.",
    metalKey: "purity",
    defaults: { dome: "Medium", pearls: 3, stoneColor: "Red", hook: "Push-back", finish: "Polished", weight: 14, style: "Traditional", purity: "22K", metalColor: "Yellow" },
    groups: [
      { key: "dome", label: "Dome size", kind: "choice", options: [
        { value: "Small", label: "Small (10mm)", mult: 0.9 }, { value: "Medium", label: "Medium (14mm)", mult: 1 }, { value: "Large", label: "Large (18mm)", mult: 1.1 }, { value: "Statement", label: "Statement (24mm)", mult: 1.25 },
      ] },
      { key: "pearls", label: "Pearl drops (per ear)", kind: "range", min: 0, max: 5, step: 1 },
      { key: "stoneColor", label: "Stone colour", kind: "swatch", options: [{ value: "None", label: "No stone", hex: "#E7DBC2" }, ...stoneColors.slice(1)] },
      { key: "hook", label: "Hook type", kind: "choice", options: [
        { value: "Push-back", label: "Push-back", add: 0 }, { value: "French Hook", label: "French Hook", add: 0 }, { value: "Sahara Chain", label: "Sahara Chain", add: 1400 }, { value: "Screw-back", label: "Screw-back", add: 300 },
      ] },
      { key: "finish", label: "Finish", kind: "choice", options: [
        { value: "Polished", label: "Polished", add: 0 }, { value: "Matte", label: "Matte", add: 400 }, { value: "Antique", label: "Antique", add: 600 }, { value: "Oxidised", label: "Oxidised", add: 300 },
      ] },
      { key: "weight", label: "Weight (pair)", kind: "range", min: 6, max: 40, step: 1, unit: "g" },
      { key: "style", label: "Design", kind: "choice", options: [{ value: "Traditional", label: "Traditional", add: 0 }, { value: "Contemporary", label: "Contemporary", add: 1200 }] },
      { key: "purity", label: "Metal", kind: "choice", options: ["22K", "18K", "Silver 925"].map((v) => ({ value: v, label: v === "Silver 925" ? v : `${v} Gold` })) },
      { key: "metalColor", label: "Metal colour", kind: "swatch", options: metalColors },
    ],
  },
  bracelet: {
    kind: "bracelet",
    title: "Bracelet Builder",
    blurb: "Choose a chain, add charms, engrave a name — wear your story.",
    metalKey: "metal",
    defaults: { chain: "Cable", charms: "Heart,Evil Eye", name: "", metal: "18K", metalColor: "Yellow", size: "Medium" },
    groups: [
      { key: "chain", label: "Chain design", kind: "choice", options: [
        { value: "Cable", label: "Cable", w: 8, add: 0 }, { value: "Tennis", label: "Tennis (diamond)", w: 10, add: 38000 }, { value: "Rope", label: "Rope", w: 9, add: 0 }, { value: "Link", label: "Curb Link", w: 12, add: 0 }, { value: "Beaded", label: "Beaded", w: 7, add: 0 },
      ] },
      { key: "charms", label: "Charms (up to 5)", kind: "multi", max: 5, options: [
        { value: "Heart", label: "Heart", add: 1800 }, { value: "Evil Eye", label: "Evil Eye", add: 2200 }, { value: "Lotus", label: "Lotus", add: 2000 },
        { value: "Om", label: "Om", add: 1900 }, { value: "Star", label: "Star", add: 1700 }, { value: "Elephant", label: "Elephant", add: 2400 },
      ] },
      { key: "name", label: "Name engraving", kind: "text", maxLength: 10, placeholder: "e.g. Mira" },
      { key: "metal", label: "Metal", kind: "choice", options: ringMetals },
      { key: "metalColor", label: "Metal colour", kind: "swatch", options: metalColors },
      { key: "size", label: "Size", kind: "choice", options: [
        { value: "Small", label: 'Small 6.0"', mult: 0.94 }, { value: "Medium", label: 'Medium 6.5"', mult: 1 }, { value: "Large", label: 'Large 7.0"', mult: 1.07 }, { value: "XL", label: 'XL 7.5"', mult: 1.14 },
      ] },
    ],
  },
};

const opt = (kind: BuilderKind, key: string, value: string | number) =>
  builders[kind].groups.find((g) => g.key === key)?.options?.find((o) => o.value === String(value));

export interface Quote {
  lines: { label: string; amount: number }[];
  subtotal: number;
  gst: number;
  total: number;
  weight: number;
}

const finish = (lines: Quote["lines"], weight: number): Quote => {
  const subtotal = lines.reduce((a, l) => a + l.amount, 0);
  const gst = subtotal * GST_RATE;
  return { lines: lines.map((l) => ({ ...l, amount: Math.round(l.amount) })), subtotal: Math.round(subtotal), gst: Math.round(gst), total: Math.round(subtotal + gst), weight: Math.round(weight * 10) / 10 };
};

export function quote(kind: BuilderKind, s: DesignState): Quote {
  if (kind === "ring") {
    const rt = opt("ring", "ringType", s.ringType);
    const weight = (rt?.w ?? 3.4) * (1 + (Number(s.size) - 14) * 0.025);
    const metal = weight * metalRate(String(s.metal));
    const stoneBase = opt("ring", "stone", s.stone)?.add ?? 0;
    const shape = opt("ring", "shape", s.shape)?.mult ?? 1;
    const fancy = s.stone === "Diamond" && s.stoneColor !== "White" ? 1.18 : 1;
    const stone = stoneBase * shape * (rt?.mult ?? 1) * fancy;
    const lines = [
      { label: `Metal (${weight.toFixed(1)}g ${s.metal})`, amount: metal },
      { label: `${s.stone === "None" ? "No stone" : `${s.stone} · ${s.shape}`}`, amount: stone },
      { label: "Accent stones & setting", amount: rt?.add ?? 0 },
      { label: "Making charges", amount: metal * 0.14 + 1800 },
    ];
    if (s.engraving) lines.push({ label: "Engraving", amount: 450 });
    return finish(lines, weight);
  }
  if (kind === "necklace") {
    const type = opt("necklace", "type", s.type)?.w ?? 1;
    const chain = opt("necklace", "chain", s.chain)?.mult ?? 1;
    const pend = opt("necklace", "pendant", s.pendant)?.w ?? 0;
    const weight = Number(s.length) * 0.42 * type * chain + pend + (s.name ? 0.4 : 0);
    const metal = weight * metalRate(String(s.purity));
    const gem = s.pendant === "None" && s.gemstone !== "None" ? (opt("necklace", "gemstone", s.gemstone)?.add ?? 0) * 0.5 : opt("necklace", "gemstone", s.gemstone)?.add ?? 0;
    const lines = [
      { label: `Metal (${weight.toFixed(1)}g ${s.purity})`, amount: metal },
      { label: s.gemstone === "None" ? "No gemstone" : `${s.gemstone} gemstone`, amount: gem },
      { label: "Making charges", amount: metal * 0.16 + 2200 },
    ];
    if (s.name) lines.push({ label: "Name engraving", amount: 650 });
    if (s.initial) lines.push({ label: "Initial engraving", amount: 350 });
    return finish(lines, weight);
  }
  if (kind === "jhumka") {
    const weight = Number(s.weight);
    const metal = weight * metalRate(String(s.purity));
    const dome = opt("jhumka", "dome", s.dome)?.mult ?? 1;
    const lines = [
      { label: `Metal (${weight}g ${s.purity})`, amount: metal },
      { label: `Pearl drops × ${Number(s.pearls) * 2}`, amount: Number(s.pearls) * 2 * 900 },
      { label: s.stoneColor === "None" ? "No stones" : `${s.stoneColor} stones`, amount: s.stoneColor === "None" ? 0 : 5800 },
      { label: "Making charges", amount: metal * 0.15 * dome + 1500 },
      { label: `${s.hook} hook · ${s.finish}`, amount: (opt("jhumka", "hook", s.hook)?.add ?? 0) + (opt("jhumka", "finish", s.finish)?.add ?? 0) },
      { label: `${s.style} design`, amount: opt("jhumka", "style", s.style)?.add ?? 0 },
    ];
    return finish(lines, weight);
  }
  const chain = opt("bracelet", "chain", s.chain);
  const size = opt("bracelet", "size", s.size)?.mult ?? 1;
  const charms = String(s.charms || "").split(",").filter(Boolean);
  const weight = ((chain?.w ?? 8) * size) + charms.length * 0.8 + (s.name ? 0.6 : 0);
  const metal = weight * metalRate(String(s.metal));
  const charmCost = charms.reduce((a, c) => a + (opt("bracelet", "charms", c)?.add ?? 0), 0);
  const lines = [
    { label: `Metal (${weight.toFixed(1)}g ${s.metal})`, amount: metal },
    { label: `${chain?.label} chain detail`, amount: chain?.add ?? 0 },
    { label: `Charms × ${charms.length}`, amount: charmCost },
    { label: "Making charges", amount: metal * 0.15 + 1600 },
  ];
  if (s.name) lines.push({ label: "Name engraving", amount: 600 });
  return finish(lines, weight);
}

export function summarize(kind: BuilderKind, s: DesignState): string[] {
  return builders[kind].groups
    .filter((g) => g.key !== "budget")
    .map((g) => {
      const v = s[g.key];
      if (v === "" || v === undefined) return null;
      const label = g.kind === "choice" || g.kind === "swatch" ? g.options?.find((o) => o.value === String(v))?.label ?? v : g.kind === "multi" ? String(v).replace(/,/g, ", ") || "None" : v;
      return `${g.label}: ${label}${g.unit && g.kind === "range" ? ` ${g.unit}` : ""}`;
    })
    .filter(Boolean) as string[];
}

export const stoneHex = (kind: BuilderKind, s: DesignState) => {
  if (kind === "necklace") return builders.necklace.groups.find((g) => g.key === "gemstone")?.options?.find((o) => o.value === s.gemstone)?.hex ?? "#EAF4FB";
  const g = builders[kind].groups.find((x) => x.key === "stoneColor");
  return g?.options?.find((o) => o.value === s.stoneColor)?.hex ?? "#EAF4FB";
};
