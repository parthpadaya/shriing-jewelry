import type { Brand, JewelryType } from "@/types";
import { pools, pick } from "./images";

type Row = [
  slug: string,
  name: string,
  tagline: string,
  category: string,
  types: JewelryType[],
  priceMin: number,
  priceMax: number,
  colors: [string, string, string],
  city: string,
  founded: number,
  story: string,
  collections: [string, string, string],
  customFeatures: [string, string, string],
  craft: string,
  rating: number,
  reviewCount: number,
  flags: string,
];

const rows: Row[] = [
  ["shringaar-studio", "Shringaar Studio", "Traditional and modern Indian jewelry", "Traditional & Modern", ["Necklace", "Earrings", "Bangle", "Ring"], 9000, 320000, ["#6b1a2b", "#b8923a", "#f6ece0"], "Jaipur", 1998, "Born in a Jaipur karkhana, Shringaar Studio reimagines the grammar of Indian adornment — temple motifs sit beside minimal lines so that every piece can move from the mandap to the boardroom.", ["Heritage Edit", "Modern Muse", "Mandap Moods"], ["Mix-and-match necklace layers", "Custom motif engraving", "Metal & stone swap"], "Every piece passes through 14 hand-finishing stages — from wax carving to final polish — by third-generation Jaipur karigars.", 4.8, 1840, "FN"],
  ["ratnaveda", "Ratnaveda", "Premium gemstone and Navratna jewelry", "Gemstones", ["Ring", "Pendant", "Earrings", "Necklace"], 25000, 450000, ["#1f4e46", "#c9a24a", "#e9f1ed"], "Mumbai", 2004, "Ratnaveda sources untreated stones directly from certified lapidaries and sets them to Vedic specifications, pairing the science of ratna with fine gold craft.", ["Navratna Atelier", "Emerald Archive", "Ruby Reverie"], ["Pick your own stone", "Navratna layout designer", "Lab certificate with each stone"], "Stones are hand-selected, cut by Jaipur lapidaries and bezel-set in 18K and 22K gold with GIA-style grading notes.", 4.9, 960, "F"],
  ["swarnika", "Swarnika", "Gold-first luxury jewelry", "Gold", ["Necklace", "Bangle", "Earrings", "Maang Tikka"], 18000, 620000, ["#6e4a12", "#d4a937", "#faf1d9"], "Thrissur", 1987, "For Swarnika, gold is the protagonist. 22K and 24K statement pieces are cast in solid weight and finished with the warm, buttery lustre Kerala goldsmiths are known for.", ["Aurum Classics", "Solid Gold Bangles", "Bridal Gold Vault"], ["Choose your gold weight", "Hallmark preview", "Buy-back guarantee"], "BIS hallmarked, hollow-free casting with hand-engraved details; every item is weighed and sealed in front of the customer.", 4.7, 2310, "F"],
  ["alankaara", "Alankaara", "Everyday Indian elegance", "Everyday Luxe", ["Earrings", "Pendant", "Ring", "Bracelet"], 4500, 85000, ["#a34a5c", "#c98b7b", "#fbeeea"], "Pune", 2012, "Alankaara designs for the woman who wears her jewelry every single day — light, graceful, with quiet Indian detail that never feels heavy.", ["Morning Raga", "Desk to Dinner", "Little Lotus"], ["Pick-your-pair earring stack", "Birthstone swap", "Lightweight engineering"], "Hollow-light construction reduces weight by 30% while keeping 18K integrity and comfort for all-day wear.", 4.6, 1420, "N"],
  ["kanchan-co", "Kanchan & Co.", "Family jewelry and heirloom redesign", "Heirloom", ["Necklace", "Bangle", "Earrings", "Bracelet"], 22000, 480000, ["#5a3a22", "#b8923a", "#f3e8d9"], "Kolkata", 1952, "Three generations of the Kanchan family have melted, remade and reborn heirlooms. We keep the story, change the silhouette.", ["Dadi Ki Nishani", "Remade Classics", "Family Crest"], ["Heirloom redesign consultation", "Preserve original gemstones", "Old-gold exchange credit"], "Master goldsmiths document your original piece, preserve each stone, and recast the gold into a contemporary design.", 4.8, 760, "F"],
  ["raniwala", "Raniwala", "Royal Indian bridal jewelry", "Bridal", ["Necklace", "Maang Tikka", "Nath", "Waist Belt"], 65000, 980000, ["#8b1230", "#d4a937", "#fbe9e6"], "Jaipur", 1975, "Raniwala creates the full-regalia bridal trousseau — polki chokers, kundan haath phool and kamarbandhs designed to photograph like royal portraits.", ["Maharani Trousseau", "Polki Palace", "Shahi Shaadi"], ["Full trousseau planner", "Matching set builder", "Custom lehenga colour match"], "Kundan-jadau setting with uncut polki, hand-laid foil and enamel backs — a 6-week process per bridal piece.", 4.9, 1120, "F"],
  ["noorvatika", "Noorvatika", "Mughal-inspired luxury", "Luxury", ["Earrings", "Necklace", "Bracelet", "Pendant"], 55000, 720000, ["#1e3a5f", "#c9a24a", "#e9eef5"], "Lucknow", 2008, "Drawing on Mughal gardens, arches and floral inlay (pietra dura), Noorvatika crafts jewelry that glows like a lamp-lit courtyard.", ["Shalimar Gardens", "Jaali Light", "Emerald Court"], ["Choose your jaali pattern", "Emerald & diamond pairing", "Monogram in Nastaliq"], "Floral inlays are set stone-by-stone by Lucknowi karigars trained in Mughal-era enamel and gem inlay.", 4.8, 540, "F"],
  ["manimaya", "ManiMaya", "Gemstone and astrology jewelry", "Astrology", ["Ring", "Pendant", "Bracelet", "Earrings"], 6500, 190000, ["#4b2a7a", "#d6b25e", "#efe9f7"], "Varanasi", 2010, "ManiMaya pairs birth-chart readings with gemstone jewelry — each piece comes with a muhurat to wear it and the mantra to begin with.", ["Rashi Rings", "Graha Pendants", "Nakshatra Edit"], ["Kundli-based stone suggestion", "Muhurat energising", "Custom rashi engraving"], "Stones are energised at Kashi and set in panchdhatu or gold according to classical shastra guidance.", 4.6, 880, "N"],
  ["aadyaa", "Aadyaa", "Minimal daily-wear jewelry", "Minimal", ["Pendant", "Ring", "Earrings", "Bracelet"], 3200, 45000, ["#2f2f2f", "#c0a080", "#f3f0eb"], "Bengaluru", 2018, "Aadyaa strips jewelry back to its essence — thin gold lines, tiny diamonds and a promise of everyday comfort.", ["Thread & Dot", "Whisper Gold", "Dew Drop"], ["Stackable ring builder", "Initial charm", "Chain length picker"], "Laser-precision cutting finished by hand, yielding feather-light 14K and 18K pieces with a seamless polish.", 4.5, 2090, "N"],
  ["zariya", "Zariya", "Convertible Indo-western jewelry", "Convertible", ["Necklace", "Pendant", "Earrings", "Bracelet"], 12000, 150000, ["#0f5c63", "#e0a090", "#e6f2f2"], "Delhi", 2016, "One jewel, five ways to wear — Zariya's detachable designs convert a necklace into a maang tikka, brooch, earrings or a hair chain.", ["Transform Series", "Detach & Style", "Indo-Fusion"], ["Convertible module designer", "Wear-it-5-ways guide", "Add-on modules"], "Magnetic and micro-hinged connectors tested for 10,000 cycles; precision-cast in 18K gold and sterling silver.", 4.7, 690, "FN"],
  ["kesar-jewels", "Kesar Jewels", "Festive and wedding jewelry", "Festive", ["Earrings", "Necklace", "Bangle", "Ring"], 14000, 260000, ["#c4620c", "#e8b04a", "#fdf0dd"], "Jodhpur", 1991, "Saffron-warm and celebratory, Kesar Jewels brings meenakari colour and festive gold to Diwali, Karwa Chauth and every shaadi in between.", ["Diwali Dhamaka", "Meena Mela", "Shaadi Season"], ["Meenakari colour picker", "Festive gift packaging", "Occasion-matched sets"], "Hand-painted meenakari in lac-fired colours over engraved gold, a craft practised by Jodhpur families for centuries.", 4.7, 1330, "F"],
  ["vasundhara", "Vasundhara", "Regional handcrafted jewelry", "Regional Crafts", ["Necklace", "Anklet", "Earrings", "Bangle"], 8000, 210000, ["#7a3b1d", "#b8923a", "#f7e9dd"], "Bhubaneswar", 2001, "Vasundhara maps India's jewelry traditions — Odisha filigree, Kerala temple, Deccan pearls — and works directly with village cooperatives.", ["Silver Filigree", "Temple Trail", "Deccan Pearls"], ["Choose a region & craft", "Meet-your-karigar note", "Village-cooperative provenance"], "Each piece carries the karigar's name and village, crafted with traditional tools: charcoal furnaces, hand-drawn wire and hammer.", 4.7, 610, "N"],
  ["amulya", "Amulya", "Affordable fine jewelry", "Affordable Fine", ["Pendant", "Earrings", "Ring", "Bangle"], 2500, 60000, ["#8c2a40", "#d9bb73", "#fbeff1"], "Surat", 2014, "Amulya believes fine jewelry should be within reach — real gold, real diamonds, honest pricing, and zero compromise on certification.", ["First Gold", "Everyday Diamonds", "Gift Under 10K"], ["Budget-first builder", "Gold-saver plan", "Free engraving"], "Machine-assisted casting with hand setting keeps costs low while retaining BIS hallmark and IGI certification.", 4.4, 3120, "N"],
  ["saanjh", "Saanjh", "Evening and party jewelry", "Evening", ["Earrings", "Necklace", "Bracelet", "Ring"], 15000, 340000, ["#2a1b3d", "#e0a090", "#efe8f3"], "Mumbai", 2015, "Saanjh is made for twilight — diamond drops, rose-gold cocktail rings and statement ear jewels that catch the light at golden hour.", ["Golden Hour", "Cocktail Hour", "After Dark"], ["Outfit-matching stylist", "Rose-gold re-plating", "Statement ear designer"], "Pavé and invisible settings by Mumbai diamond cutters ensure maximum sparkle with minimal metal.", 4.6, 770, "N"],
  ["nayantara", "Nayantara", "Personalized contemporary jewelry", "Personalized", ["Pendant", "Ring", "Bracelet", "Necklace"], 7500, 120000, ["#3b4a7a", "#d9bb73", "#eaedf6"], "Hyderabad", 2017, "Nayantara turns names, dates, coordinates and voices into wearable memories — each piece is made-to-order and made-to-mean.", ["Name Stories", "Date & Coordinates", "Soundwave Series"], ["Name & initial engraving", "Handwriting replica", "Soundwave pendant"], "Laser micro-engraving plus hand finishing; handwriting is traced and cast as a single continuous line.", 4.8, 1580, "FN"],
  ["kalaa-by-you", "Kalaa by You", "Artisan marketplace", "Artisan Marketplace", ["Necklace", "Earrings", "Anklet", "Bracelet"], 1800, 95000, ["#6b4f2a", "#c98b7b", "#f4ecdf"], "Kutch", 2019, "A curated marketplace of independent karigars — each listing is a signed, one-of-one piece with the maker's story attached.", ["Karigar Signatures", "Oxidised Origins", "One of One"], ["Commission a karigar", "Co-design with artist", "Maker video diary"], "Independent studios across Kutch, Odisha and Assam craft limited editions, shipped with the maker's signed note.", 4.6, 520, "N"],
  ["svarna", "Svarna", "Premium certified gold jewelry", "Certified Gold", ["Bangle", "Necklace", "Ring", "Earrings"], 28000, 540000, ["#4a0f1d", "#d4af37", "#f8efe0"], "Mumbai", 1969, "Svarna stands for certainty: every ornament carries a BIS hallmark, purity certificate and transparent price breakup, backed by lifetime exchange.", ["Hallmark Heritage", "Certified Solitaires", "Lifetime Gold"], ["Live purity tracker", "Transparent price breakup", "Lifetime exchange"], "Spectrometer-tested purity and XRF scans on every piece; assay certificates are generated per order.", 4.9, 2640, "F"],
  ["ritu-ratna", "Ritu Ratna", "Seasonal collections", "Seasonal", ["Earrings", "Necklace", "Ring", "Bangle"], 8500, 175000, ["#3f6b3a", "#d9bb73", "#edf3e8"], "Chennai", 2013, "Six seasons, six palettes. Ritu Ratna releases limited edition capsules following the Indian ritu calendar — from Vasant florals to Varsha sapphires.", ["Vasant Blooms", "Grishma Gold", "Varsha Blues"], ["Seasonal stone palette", "Limited-edition pre-order", "Ritu gift boxes"], "Small-batch capsule production — each seasonal run is capped at 108 pieces and numbered by hand.", 4.5, 430, "N"],
  ["devasena", "Devasena", "Traditional bridal sets", "Bridal Sets", ["Necklace", "Maang Tikka", "Bangle", "Nath"], 85000, 850000, ["#7d1a3d", "#c9a24a", "#fae9ef"], "Madurai", 1983, "Devasena specialises in complete South Indian bridal sets — Lakshmi haar, vanki, oddiyanam and thalaikkodi — made to temple-jewelry tradition.", ["Kalyanam Sets", "Muhurtham Heirlooms", "Lakshmi Legacy"], ["Complete bridal set builder", "Regional style preset", "Rent-to-own trial"], "Cast in 22K with hand-chiselled deities, set with rubies, emeralds and Basra pearls by Madurai temple-jewelry masters.", 4.8, 700, "F"],
  ["anaya-jewels", "Anaya Jewels", "Gen Z fashion jewelry", "Fashion", ["Earrings", "Necklace", "Ring", "Bracelet"], 499, 9500, ["#b03a6e", "#e0a090", "#fdeaf3"], "Gurugram", 2021, "Anaya Jewels is bold, playful and made to be mixed — chunky chains, charm stacks and bright crystals in anti-tarnish silver tones.", ["Chunky Chain Club", "Charm Bar", "Crystal Pop"], ["Charm-bar builder", "Stack-it-yourself", "Anti-tarnish guarantee"], "Rhodium-plated brass and 925 silver with 12-month anti-tarnish coating, produced in small drops.", 4.3, 4210, "N"],
];

const artisans = [
  { name: "Ramesh Soni", role: "Master Kundan Karigar, Jaipur", quote: "A stone chooses its own place. My job is only to listen.", image: pools.artisan[0] },
  { name: "Lakshmi Iyer", role: "Temple Jewelry Master, Madurai", quote: "Every deity I chisel carries a prayer from my grandmother.", image: pools.artisan[1] },
  { name: "Abdul Rahim", role: "Enamel Artist, Lucknow", quote: "Colour is fire, patience and a steady hand.", image: pools.artisan[2] },
  { name: "Sushila Devi", role: "Filigree Artisan, Cuttack", quote: "Silver thread, thinner than hair, is where my day begins.", image: pools.artisan[3] },
  { name: "Mahesh Patel", role: "Jadau Specialist, Ahmedabad", quote: "Gold is patient — you only need to be more patient.", image: pools.artisan[4] },
  { name: "Farida Khan", role: "Pearl Setter, Hyderabad", quote: "Pearls are the moon's tears. Handle them like secrets.", image: pools.artisan[5] },
];

const coverPool = (types: JewelryType[], i: number) => {
  const t = types[0];
  if (t === "Ring") return pick(pools.ring, i);
  if (t === "Earrings") return pick(pools.earring, i);
  if (t === "Pendant" || t === "Bracelet") return pick(pools.pearl, i);
  return pick(pools.necklace, i);
};

export const brands: Brand[] = rows.map((r, i) => {
  const [slug, name, tagline, category, types, priceMin, priceMax, colors, city, founded, story, cols, customFeatures, craft, rating, reviewCount, flags] = r;
  const blurbs = [
    "Signature pieces that define the house.",
    "Our most-loved designs, refreshed each season.",
    "Limited runs crafted for moments that matter.",
  ];
  return {
    id: i + 1,
    slug,
    name,
    tagline,
    category,
    types,
    priceMin,
    priceMax,
    primary: colors[0],
    accent: colors[1],
    soft: colors[2],
    city,
    founded,
    story,
    collections: cols.map((c, k) => ({
      name: c,
      blurb: blurbs[k],
      image: k === 0 ? coverPool(types, i + 3) : k === 1 ? pick(pools.gem.concat(pools.pearl), i + k) : pick(pools.necklace.concat(pools.earring), i + k * 3),
    })),
    customFeatures,
    craft,
    rating,
    reviewCount,
    popularity: Math.round(reviewCount / 10 + rating * 20),
    isNew: flags.includes("N"),
    featured: flags.includes("F"),
    image: coverPool(types, i),
    monogram: name
      .replace(/[^A-Za-z& ]/g, "")
      .split(" ")
      .filter((w) => w !== "&")
      .slice(0, 2)
      .map((w) => w[0])
      .join(""),
    offers: [
      ["Flat 10% off on making charges", "Free insured shipping over ₹10,000"],
      ["Complimentary engraving on all orders", "No-cost EMI up to 6 months"],
      ["Extra 5% off on first order — use SHRI5", "Free gift box with every purchase"],
    ][i % 3],
    artisan: artisans[i % artisans.length],
  };
});

export const getBrand = (slug?: string) => brands.find((b) => b.slug === slug);
export const brandCategories = Array.from(new Set(brands.map((b) => b.category)));
export const jewelryTypes: JewelryType[] = ["Necklace", "Earrings", "Ring", "Bangle", "Bracelet", "Pendant", "Maang Tikka", "Nath", "Waist Belt", "Anklet", "Jhumka"];
