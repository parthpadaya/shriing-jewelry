import type { JewelryType, Product } from "@/types";
import { products } from "@/data/products";
import { outfitColors } from "@/data/collections";

export interface StyleInput {
  color: string;
  occasion: string;
  budget: number;
  prefs: string[];
}

const colorKeywords: Record<string, string[]> = {
  Red: ["ruby", "kundan", "polki", "temple", "meenakari", "yellow gold"],
  Maroon: ["ruby", "polki", "kundan", "temple", "yellow gold"],
  Pink: ["rose", "pearl", "polki", "meenakari", "diamond"],
  Peach: ["rose", "pearl", "diamond", "polki"],
  Gold: ["pearl", "emerald", "kundan", "ruby", "yellow gold"],
  Ivory: ["pearl", "polki", "diamond", "emerald", "ruby"],
  Green: ["polki", "pearl", "kundan", "diamond", "yellow gold"],
  Teal: ["pearl", "diamond", "rose", "polki"],
  "Royal Blue": ["diamond", "pearl", "white gold", "polki", "emerald"],
  Purple: ["pearl", "diamond", "polki", "emerald", "yellow gold"],
  Black: ["diamond", "pearl", "silver", "emerald", "ruby", "white gold"],
};

export const colorReason: Record<string, string> = {
  Red: "Warm 22K gold and ruby accents amplify red without competing with it.",
  Maroon: "Polki and gold glow richly against deep maroon fabric.",
  Pink: "Pearls and soft rose-tone metals complement pink's gentle warmth.",
  Peach: "Rose gold and pearls echo peach's soft glow.",
  Gold: "Contrasting emerald and ruby accents lift a gold outfit from tonal to striking.",
  Ivory: "Ivory is a canvas — rich polki, emerald or ruby pieces create a statement.",
  Green: "Kundan and pearls in warm gold frame green with classic Indian elegance.",
  Teal: "Diamonds and pearls give teal a cool, luminous finish.",
  "Royal Blue": "White metals and pearls echo the cool tones of royal blue.",
  Purple: "Pearls and diamonds soften purple while gold keeps it regal.",
  Black: "Diamonds and emeralds create dramatic contrast against black.",
};

const score = (p: Product, input: StyleInput, variant: number) => {
  const hay = `${p.category} ${p.stone} ${p.craft} ${p.metal} ${p.name}`.toLowerCase();
  let s = 0;
  (colorKeywords[input.color] ?? []).forEach((k, i) => {
    if (hay.includes(k)) s += 4 - Math.min(i, 3) * 0.5;
  });
  if (p.occasion.toLowerCase() === input.occasion.toLowerCase()) s += 3;
  if (["Bridal", "Wedding"].includes(input.occasion) && ["Bridal", "Wedding"].includes(p.occasion)) s += 2;
  input.prefs.forEach((pr) => {
    const k = pr.toLowerCase();
    if (hay.includes(k)) s += 2;
    if (k === "traditional" && /kundan|polki|temple|meenakari|handcrafted|jadau/.test(hay)) s += 2;
    if (k === "contemporary" && /contemporary|minimal|indo-western|personalised/.test(hay)) s += 2;
    if (k === "minimal" && p.weight < 10) s += 2;
    if (k === "statement" && p.weight > 30) s += 2;
  });
  s += p.rating / 5 + ((p.id.length * (variant + 3)) % 7) / 7;
  return s;
};

const roles: { role: string; types: JewelryType[]; share: number }[] = [
  { role: "Necklace", types: ["Necklace", "Pendant"], share: 0.38 },
  { role: "Earrings", types: ["Earrings", "Jhumka"], share: 0.2 },
  { role: "Bangles", types: ["Bangle", "Bracelet"], share: 0.28 },
  { role: "Maang Tikka", types: ["Maang Tikka", "Nath", "Pendant"], share: 0.14 },
];

export interface Look {
  title: string;
  pieces: { role: string; product: Product }[];
  total: number;
  note: string;
}

export function recommend(input: StyleInput, variant = 0): Look {
  const used = new Set<string>();
  const pieces = roles.map((r) => {
    const alloc = input.budget * r.share;
    const pool = products
      .filter((p) => r.types.includes(p.type) && !used.has(p.id))
      .map((p) => ({ p, s: score(p, input, variant) - (p.price > alloc * 1.15 ? 6 : 0) }))
      .sort((a, b) => b.s - a.s);
    const chosen = pool[0]?.p ?? products[0];
    used.add(chosen.id);
    return { role: r.role, product: chosen };
  });
  const total = pieces.reduce((a, x) => a + x.product.price, 0);
  return {
    title: ["Classic Heritage", "Contemporary Edit", "Statement Glamour"][variant % 3],
    pieces,
    total,
    note: colorReason[input.color] ?? "Chosen to harmonise with your outfit palette.",
  };
}

export const parseBudget = (text: string): number | null => {
  const t = text.toLowerCase().replace(/,/g, "");
  const m = t.match(/(\d+(?:\.\d+)?)\s*(lakh|lac|l\b|cr|crore|k\b)/);
  if (m) {
    const n = parseFloat(m[1]);
    const u = m[2];
    if (u.startsWith("l")) return n * 100000;
    if (u.startsWith("c")) return n * 10000000;
    return n * 1000;
  }
  const r = t.match(/(\d{4,8})/);
  return r ? parseInt(r[1], 10) : null;
};

export const parseColor = (text: string) => outfitColors.find((c) => text.toLowerCase().includes(c.name.toLowerCase()))?.name ?? null;

export const parseOccasion = (text: string) => {
  const t = text.toLowerCase();
  if (/bridal|bride|lehenga|shaadi/.test(t)) return "Bridal";
  if (/wedding|sangeet|reception/.test(t)) return "Wedding";
  if (/party|cocktail|evening/.test(t)) return "Party";
  if (/festiv|diwali|puja|navratri/.test(t)) return "Festive";
  if (/engage/.test(t)) return "Engagement";
  if (/office|daily|everyday|work/.test(t)) return "Daily Wear";
  return null;
};
