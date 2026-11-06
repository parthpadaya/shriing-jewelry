import type { JewelryType, MaterialCategory, Product } from "@/types";
import { pools, pick } from "./images";
import { brands } from "./brands";

type PoolKey = keyof typeof pools;
type T = [
  name: string,
  type: JewelryType,
  cat: MaterialCategory,
  metal: string,
  purity: string,
  weight: number,
  stone: string,
  craft: string,
  occasion: string,
  base: number,
  pool: PoolKey,
  desc: string,
];

export const templates: T[] = [
  // 0 - 32: Core Classics
  ["Kundan Polki Bridal Choker", "Necklace", "Kundan", "Yellow Gold", "22K", 64, "Polki Diamonds & Emeralds", "Jaipur Kundan", "Bridal", 285000, "necklace", "A regal choker in hand-set uncut polki and Zambian emerald drops, backed with vivid meenakari in the traditional Jaipur manner."],
  ["Temple Lakshmi Haar", "Necklace", "Temple", "Yellow Gold", "22K", 92, "Rubies", "Kerala Temple", "Wedding", 365000, "necklace", "A long Lakshmi haar with hand-chiselled deities and ruby accents — the quintessential South Indian bridal heirloom."],
  ["Antique Gold Rani Haar", "Necklace", "Gold", "Yellow Gold", "22K", 78, "Pearl Drops", "Rajasthani Handcrafted", "Wedding", 318000, "necklace", "A multi-tier rani haar in antique-finish gold, ending in a cascade of freshwater pearl drops."],
  ["Solitaire Diamond Pendant", "Pendant", "Diamond", "White Gold", "18K", 3.2, "0.50ct VS1 Diamond", "Contemporary", "Gifting", 62000, "pendant", "A timeless four-prong solitaire pendant set with a certified VS1 diamond on a fine 18K chain."],
  ["Polki Chandbali Earrings", "Earrings", "Polki", "Yellow Gold", "22K", 22, "Uncut Polki", "Jaipur Polki", "Wedding", 98000, "earring", "Crescent chandbalis in 22K gold with a shimmering fringe of uncut polki and seed pearls."],
  ["Classic Gold Jhumka", "Jhumka", "Gold", "Yellow Gold", "22K", 14, "None", "Traditional Handcrafted", "Festive", 64000, "earring", "Domed temple jhumkas with hand-beaded gold balls and a graceful bell silhouette."],
  ["Pearl Drop Jhumka", "Jhumka", "Gemstone", "Yellow Gold", "18K", 11, "South Sea Pearls", "Hyderabadi Pearl", "Festive", 48000, "pearl", "Delicate jhumkas topped with lustrous south sea pearls — Hyderabad's most beloved pairing."],
  ["Meenakari Peacock Earrings", "Earrings", "Meenakari", "Yellow Gold", "22K", 16, "Enamel & Rubies", "Jaipur Meenakari", "Festive", 72000, "earring", "Hand-painted peacock earrings in jewel-toned enamel with ruby eyes and gold filigree."],
  ["Diamond Halo Engagement Ring", "Ring", "Diamond", "White Gold", "18K", 4.1, "0.75ct Round Diamond", "Contemporary", "Engagement", 148000, "ring", "A brilliant round centre diamond encircled by a pavé halo on a slender white-gold band."],
  ["Platinum Solitaire Band", "Ring", "Platinum", "Platinum", "950", 6.5, "0.30ct Diamond", "Contemporary", "Engagement", 124000, "ring", "Pure 950 platinum band with a flush-set solitaire — understated, enduring, certified."],
  ["Navratna Cocktail Ring", "Ring", "Gemstone", "Yellow Gold", "22K", 8.8, "Navratna (9 gems)", "Traditional Navratna", "Festive", 54000, "ring", "Nine auspicious gemstones arranged in the classical navagraha mandala in 22K gold."],
  ["Burmese Ruby Cocktail Ring", "Ring", "Gemstone", "Rose Gold", "18K", 5.4, "Burmese Ruby", "Contemporary", "Party", 88000, "ring", "An oval Burmese ruby framed in rose gold with diamond accents — a pulse of colour for the evening."],
  ["Gold Kada Bangles (Pair)", "Bangle", "Gold", "Yellow Gold", "22K", 48, "None", "Handcrafted Kada", "Wedding", 232000, "bangle", "A pair of weighty, hand-engraved kadas with flared terminals — made to be passed on."],
  ["Meenakari Bridal Chooda", "Bangle", "Meenakari", "Yellow Gold", "22K", 56, "Enamel", "Jaipur Meenakari", "Bridal", 268000, "bangle", "Bridal chooda with hand-enamelled floral panels in red, green and white on 22K gold."],
  ["Polki Kada", "Bangle", "Polki", "Yellow Gold", "22K", 36, "Uncut Polki", "Jaipur Polki", "Wedding", 148000, "bangle", "A statement kada studded with uncut polki in gold foil with a soft peacock-blue enamel back."],
  ["Diamond Tennis Bracelet", "Bracelet", "Diamond", "White Gold", "18K", 12.4, "2.0ct Diamonds", "Contemporary", "Party", 178000, "pearl", "Forty-two round brilliants in a continuous line of white gold — red-carpet sparkle."],
  ["Silver Charm Bracelet", "Bracelet", "Silver", "Sterling Silver", "925", 14, "Cubic Zirconia", "Contemporary", "Daily Wear", 4800, "pearl", "Rhodium-finished 925 silver bracelet with detachable lotus, evil-eye and heart charms."],
  ["Rose Gold Minimal Chain", "Necklace", "Gold", "Rose Gold", "14K", 5.6, "None", "Minimal", "Daily Wear", 21500, "pendant", "A whisper-thin rose gold chain with a tiny sliding bead — made for layering."],
  ["Oxidised Silver Jhumka", "Jhumka", "Silver", "Sterling Silver", "925", 18, "None", "Tribal Oxidised", "Daily Wear", 3800, "earring", "Hand-oxidised silver jhumkas with ghungroo bells in a bold tribal pattern."],
  ["Kundan Pearl Maang Tikka", "Maang Tikka", "Kundan", "Yellow Gold", "22K", 18, "Kundan & Pearls", "Kundan", "Bridal", 76000, "necklace", "A classic kundan tikka with a pearl-fringed oval and delicate side chains."],
  ["Maharashtrian Pearl Nath", "Nath", "Gold", "Yellow Gold", "22K", 12, "Pearls", "Maharashtrian Nath", "Bridal", 58000, "pearl", "A crescent Maharashtrian nath with seed-pearl clusters and a gold chain to the ear."],
  ["Kamarbandh Waist Belt", "Waist Belt", "Kundan", "Yellow Gold", "22K", 120, "Kundan & Pearls", "Rajasthani Handcrafted", "Bridal", 580000, "necklace", "A heirloom-weight kamarbandh with flower-and-peacock links, designed to sit over a bridal lehenga."],
  ["Temple Payal Anklets (Pair)", "Anklet", "Silver", "Sterling Silver", "925", 62, "None", "Temple Payal", "Wedding", 14500, "pearl", "Pure silver anklets with hand-strung ghungroo and a traditional clasp."],
  ["Emerald Drop Earrings", "Earrings", "Gemstone", "Yellow Gold", "18K", 9, "Zambian Emeralds", "Mughal-inspired", "Party", 112000, "earring", "Pear-cut Zambian emeralds suspended from diamond-set floral tops in the Mughal manner."],
  ["Convertible Floral Pendant Set", "Necklace", "Gemstone", "Yellow Gold", "18K", 15, "Pearls & CZ", "Indo-western", "Party", 38000, "pendant", "A detachable floral pendant that converts into earrings, a maang tikka or a brooch."],
  ["Layered Crystal Choker", "Necklace", "Fashion", "Gold-plated Brass", "—", 24, "Crystals", "Fashion", "Party", 2400, "pendant", "Layered chains with scattered crystals and a lobster clasp for an instant outfit upgrade."],
  ["Birthstone Name Pendant", "Pendant", "Gemstone", "Yellow Gold", "14K", 3, "Birthstone", "Personalised", "Gifting", 18500, "pendant", "A made-to-order pendant engraved with a name and set with the recipient's birthstone."],
  ["Initial Pavé Diamond Ring", "Ring", "Diamond", "Rose Gold", "14K", 2.8, "Pavé Diamonds", "Personalised", "Gifting", 24800, "ring", "A pavé-set initial ring in rose gold that celebrates the one you love."],
  ["Jadau Haath Phool", "Bracelet", "Kundan", "Yellow Gold", "22K", 34, "Jadau Stones", "Gujarat Jadau", "Bridal", 192000, "bangle", "A hand harness linking a bracelet to five rings, set in the jadau technique of Gujarat."],
  ["Filigree Silver Necklace", "Necklace", "Silver", "Sterling Silver", "925", 38, "None", "Kolkata Filigree", "Festive", 16800, "pendant", "Tarakashi silver filigree, spun and soldered thread by thread by Cuttack artisans."],
  ["Bengali Shakha Pola Set", "Bangle", "Gold", "Yellow Gold", "22K", 24, "Coral & Enamel", "Bengali Gold", "Bridal", 124000, "bangle", "Gold-capped shakha and pola bangles in the Bengali bridal tradition, with hand-carved coral."],
  ["Deccan Satlada Pearl Necklace", "Necklace", "Gemstone", "Yellow Gold", "22K", 54, "Basra Pearls", "Hyderabadi Pearl", "Wedding", 208000, "pearl", "Seven strands of Basra pearls with gold spacers — the grand signature of Hyderabad."],

  // 32 - 87: 55+ New Royal, Bridal & Fine Jewelry Masterpieces
  // Bridal Necklaces & Chokers
  ["Royal Rajputana Polki Aad Choker", "Necklace", "Kundan", "Yellow Gold", "22K", 84, "Uncut Polki & Emeralds", "Jaipur Kundan", "Bridal", 395000, "necklace", "Traditional Rajasthani bridal choker with gold mesh backing, ruby clusters and natural Basra pearl drops."],
  ["Kasu Mala Goddess Coin Necklace", "Necklace", "Temple", "Yellow Gold", "22K", 72, "Rubies", "Kerala Temple", "Bridal", 295000, "necklace", "Traditional South Indian bridal coin necklace with stamped Lakshmi motifs and cabochon rubies."],
  ["Manga Malai Mango Choker", "Necklace", "Temple", "Yellow Gold", "22K", 68, "Rubies & Emeralds", "Kerala Temple", "Bridal", 278000, "necklace", "Iconic paisley mango-motif bridal necklace in 22K gold encrusted with kemp rubies and emeralds."],
  ["Kolhapuri Saaj Bridal Necklace", "Necklace", "Gold", "Yellow Gold", "22K", 52, "None", "Maharashtrian Craft", "Bridal", 215000, "necklace", "Sacred Maharashtrian bridal necklace with 21 auspicious leaves and avatars, handcrafted in pure gold."],
  ["Shringaar Jadau Choker Set", "Necklace", "Kundan", "Yellow Gold", "22K", 78, "Uncut Diamonds & Rubies", "Gujarat Jadau", "Bridal", 345000, "necklace", "An opulent Gujarat jadau choker set featuring hand-set polki diamonds and deep crimson rubies."],
  ["Mughal Nizami Guluband", "Necklace", "Polki", "Yellow Gold", "22K", 62, "Polki & Zambian Emeralds", "Deccan Jewelry", "Bridal", 290000, "necklace", "A grand high-collar royal guluband choker with five rows of uncut polki and emerald bead tassels."],
  ["Bengali Sita Haar", "Necklace", "Gold", "Yellow Gold", "22K", 65, "None", "Bengali Gold", "Bridal", 265000, "necklace", "Long traditional Bengali royal bridal necklace with intricate die-stamped gold medallions and filigree chain."],
  ["Maharashtrian Thushi Choker", "Necklace", "Gold", "Yellow Gold", "22K", 38, "Red Kemp Stone", "Maharashtrian Craft", "Bridal", 165000, "necklace", "Close-fitting traditional choker of tiny gold rava beads woven on black tassel cord with ruby centerpiece."],
  ["Kundan Meenakari Hasli Necklace", "Necklace", "Meenakari", "Yellow Gold", "22K", 58, "Polki & Enamel", "Jaipur Meenakari", "Bridal", 248000, "necklace", "Solid torque collar necklace featuring lotus meenakari engraving on reverse and brilliant kundan on front."],
  ["Navratna Royal Bridal Collar", "Necklace", "Gemstone", "Yellow Gold", "22K", 75, "Navratna 9 Sacred Gems", "Traditional Navratna", "Bridal", 320000, "necklace", "Magnificent bridal collar uniting ruby, diamond, pearl, emerald, sapphire, coral, cats eye, hessonite, topaz."],
  ["Guttapusalu Pearl Cluster Haar", "Necklace", "Gemstone", "Yellow Gold", "22K", 82, "Basra Pearls & Rubies", "Kerala Temple", "Bridal", 340000, "pearl", "Traditional Andhra-heritage bridal necklace with fringe bunches of seed pearls and ruby-studded gold pendants."],
  ["Diamond Emerald Royal Choker", "Necklace", "Diamond", "White Gold", "18K", 45, "4.5ct Diamonds & Emerald", "Contemporary", "Bridal", 425000, "necklace", "Modern high-jewelry bridal choker featuring certified brilliant diamonds framing a 12ct Columbian emerald."],
  ["Kashmiri Dejhoor Bridal Chain", "Necklace", "Gold", "Yellow Gold", "22K", 32, "Rubies", "Kashmir Filigree", "Bridal", 138000, "necklace", "Sacred hexagonal gold ear-to-neck talisman worn by Kashmiri brides on ceremonial athoor cords."],
  ["Heritage Filigree Haar", "Necklace", "Silver", "Sterling Silver", "925", 65, "Gold Plated Filigree", "Kolkata Filigree", "Bridal", 28000, "pendant", "Intricate Tarakashi bridal necklace handcrafted in pure 925 silver with heavy 24K micron gold plating."],
  ["Padmavati Jadau Rani Haar", "Necklace", "Kundan", "Yellow Gold", "22K", 95, "Jadau Polki & Rubies", "Rajasthani Handcrafted", "Bridal", 410000, "necklace", "Seven-tier royal bridal rani haar with hand-cut polki slices and peacock-feather enameled links."],
  ["Solitaire Diamond Tennis Necklace", "Necklace", "Diamond", "Platinum", "950", 28, "8.0ct VVS Diamonds", "Contemporary", "Bridal", 650000, "necklace", "An uninterrupted graduated river of certified natural VVS diamonds set in high-polish 950 platinum."],
  ["South Indian Mulla Mottu Mala", "Necklace", "Temple", "Yellow Gold", "22K", 58, "Rubies", "Kerala Temple", "Bridal", 242000, "necklace", "Traditional jasmine bud bridal necklace with closely-spaced gold florets and fine ruby highlights."],
  ["Chik Bengali Bridal Collar", "Necklace", "Gold", "Yellow Gold", "22K", 42, "Seed Pearls", "Bengali Gold", "Bridal", 175000, "necklace", "Wide mesh chokers crafted by Kolkata goldsmiths, draping smoothly against the collarbone."],

  // Bridal Forehead, Face & Waist
  ["Royal Rajputana Kundan Borla", "Maang Tikka", "Kundan", "Yellow Gold", "22K", 16, "Polki & Pearls", "Jaipur Kundan", "Bridal", 68000, "necklace", "Spherical Rajasthani forehead ornament adorned with concentric rings of polki and seed pearls."],
  ["Matha Patti Multi-Strand Tiara", "Maang Tikka", "Kundan", "Yellow Gold", "22K", 38, "Polki & Emerald Drops", "Jaipur Kundan", "Bridal", 162000, "necklace", "Elaborate multi-tier bridal crown headpiece framing the hairline with polki florets and emerald beads."],
  ["Temple Nethi Chutti", "Maang Tikka", "Temple", "Yellow Gold", "22K", 24, "Kemp Rubies", "Kerala Temple", "Bridal", 98000, "necklace", "South Indian bridal forehead set featuring Surya and Chandra sun-and-moon crest clips."],
  ["Nizami Pearl Bridal Nath", "Nath", "Gemstone", "Yellow Gold", "22K", 14, "Basra Pearls & Emerald", "Deccan Jewelry", "Bridal", 62000, "pearl", "Grand Hyderabadi nose ring with a crescent cluster of Basra pearls and emerald drop on a pearl chain."],
  ["Rajasthani Kundan Nathni", "Nath", "Kundan", "Yellow Gold", "22K", 12, "Polki & Ruby", "Jaipur Kundan", "Bridal", 54000, "pearl", "Delicate gold wire hoop with a floral kundan motif and triple ruby bead tassels."],
  ["Oddiyanam Temple Gold Waist Belt", "Waist Belt", "Temple", "Yellow Gold", "22K", 145, "Rubies & Emeralds", "Kerala Temple", "Bridal", 640000, "necklace", "Imperial temple waist belt depicting Goddess Lakshmi surrounded by dancing celestial apsaras."],
  ["Polki Diamond Kamarbandh", "Waist Belt", "Polki", "Yellow Gold", "22K", 110, "Uncut Polki", "Jaipur Polki", "Bridal", 510000, "necklace", "Flexible segmented gold waist belt studded with brilliant uncut polki slices and pearl clusters."],
  ["Kundan Jadau Haath Phool", "Bracelet", "Kundan", "Yellow Gold", "22K", 42, "Polki & Seed Pearls", "Gujarat Jadau", "Bridal", 185000, "bangle", "Five-finger bridal hand harness with delicate pearl chains leading to a central rosette medallion."],
  ["Filigree Silver Haath Phool", "Bracelet", "Silver", "Sterling Silver", "925", 48, "24K Gold Plated", "Kolkata Filigree", "Bridal", 18500, "pearl", "Ethereal silver filigree hand ornament with floral rings and spun-wire hand strands."],
  ["Vanki Bajuband Armlet", "Bangle", "Temple", "Yellow Gold", "22K", 44, "Rubies", "Kerala Temple", "Bridal", 192000, "bangle", "Inverted V-shaped South Indian bridal armlet featuring snake and peacock motifs in antique gold."],
  ["Peacock Meenakari Bajuband", "Bangle", "Meenakari", "Yellow Gold", "22K", 38, "Enamel & Pearls", "Jaipur Meenakari", "Bridal", 168000, "bangle", "Articulated royal Rajasthani armlet with vibrant peacock enamel work and gold dori ties."],
  ["Bridal Ghungroo Chandi Payal", "Anklet", "Silver", "Sterling Silver", "925", 95, "None", "Rajasthani Handcrafted", "Bridal", 22000, "pearl", "Heavy Rajasthani bridal anklets with bells that create a gentle melody with every bridal step."],

  // Bangles & Kadas
  ["Punjabi Chooda Kaleere Set", "Bangle", "Gold", "Yellow Gold", "22K", 36, "Gold Dori & Pearls", "Handcrafted Kada", "Bridal", 158000, "bangle", "Traditional bridal chooda set complemented with hand-crafted 22K gold umbrella kaleere pendants."],
  ["Gajra Gold Bangle Pair", "Bangle", "Gold", "Yellow Gold", "22K", 54, "None", "Traditional Handcrafted", "Wedding", 245000, "bangle", "Pair of floral openwork bangles inspired by jasmine flower garlands, crafted in solid 22K gold."],
  ["Navratna Openable Kada", "Bangle", "Gemstone", "Yellow Gold", "22K", 42, "Navratna 9 Gems", "Traditional Navratna", "Wedding", 188000, "bangle", "Heavy screw-clasp kada studded with the nine planetary gems in handcrafted floral collets."],
  ["Pachchikam Polki Bangle", "Bangle", "Polki", "Silver", "925", 32, "Polki & 24K Gold Gilt", "Gujarat Jadau", "Bridal", 38000, "bangle", "Handcrafted Pachchikam bangle featuring uncut stones pressed into hand-chased silver bezel frames."],
  ["Ruby Temple Kangan Pair", "Bangle", "Temple", "Yellow Gold", "22K", 60, "Kemp Rubies", "Kerala Temple", "Bridal", 268000, "bangle", "Regal South Indian bridal bangles with raised lion-head (simha mukha) terminals and ruby pavé."],
  ["Diamond Eternity Bangle", "Bangle", "Diamond", "Rose Gold", "18K", 18, "3.2ct Diamonds", "Contemporary", "Wedding", 225000, "bangle", "Seamless channel-set natural diamond bangle in 18K rose gold with concealed safety clasp."],
  ["Kolkata Bala Gold Bangles", "Bangle", "Gold", "Yellow Gold", "22K", 46, "None", "Bengali Gold", "Bridal", 205000, "bangle", "Iconic Bengali solid gold bridal bangles with chased floral creepers and makara head terminals."],
  ["Thewa Art Bangle Pair", "Bangle", "Gold", "Yellow Gold", "22K", 38, "Gold Leaf on Glass", "Rajasthani Handcrafted", "Wedding", 145000, "bangle", "Rare Pratapgarh Thewa heritage craft — 24K gold foil fused onto colored terracotta glass."],
  ["Zambian Emerald Kada", "Bangle", "Gemstone", "Yellow Gold", "18K", 36, "Cabochon Emeralds", "Contemporary", "Party", 175000, "bangle", "Fluted gold hinged bangle set with three lush cabochon emeralds and brilliant diamond accents."],
  ["South Sea Pearl Bangle", "Bangle", "Gemstone", "Yellow Gold", "18K", 22, "South Sea Pearls", "Hyderabadi Pearl", "Festive", 88000, "pearl", "Twin open-end bangle tipped with two magnificent golden South Sea cultured pearls."],

  // Earrings & Chandbalis
  ["Royal Hyderabadi Chandbali", "Earrings", "Polki", "Yellow Gold", "22K", 28, "Polki & Basra Pearls", "Deccan Jewelry", "Bridal", 128000, "earring", "Crescent-shaped multi-tier bridal chandbalis with seed pearl netting and emerald drops."],
  ["Karanphool Jhumka Earrings", "Earrings", "Kundan", "Yellow Gold", "22K", 34, "Kundan & Rubies", "Jaipur Kundan", "Bridal", 148000, "earring", "Ear-covering sunflower stud with hanging double-tier jhumka and pearl hair support sahara chains."],
  ["Temple Jhumka with Ear Chains", "Jhumka", "Temple", "Yellow Gold", "22K", 26, "Rubies & Pearls", "Kerala Temple", "Bridal", 118000, "earring", "Antique temple jhumkas linked to delicate hair chains (maattal) that hook onto the bridal coiffure."],
  ["Diamond Chandelier Earrings", "Earrings", "Diamond", "White Gold", "18K", 16, "2.8ct Diamonds", "Contemporary", "Wedding", 215000, "earring", "Cascade of articulated round and marquise diamonds designed to capture light with every movement."],
  ["Kaan Bala Bengali Earrings", "Earrings", "Gold", "Yellow Gold", "22K", 18, "None", "Bengali Gold", "Wedding", 82000, "earring", "Large ear-contouring ear cuffs in delicate filigree, a cherished Bengali wedding ornament."],
  ["Solitaire Stud Earrings", "Earrings", "Diamond", "Platinum", "950", 4.2, "1.5ct Solitaire Pair", "Contemporary", "Daily Wear", 185000, "ring", "A pair of certified brilliant-cut round solitaire diamond studs in four-prong platinum settings."],
  ["Meenakari Lotus Jhumki", "Jhumka", "Meenakari", "Yellow Gold", "22K", 19, "Enamel & Pearls", "Jaipur Meenakari", "Festive", 79000, "earring", "Pastel blue and pink Jaipur enamelled bell jhumkis crowned with pearl tassels."],
  ["Emerald & Polki Ear Cuffs", "Earrings", "Polki", "Yellow Gold", "18K", 22, "Emeralds & Polki", "Contemporary", "Party", 135000, "earring", "Modern ear climber cuffs set with uncut polki diamonds and vibrant Colombian emerald briolettes."],

  // Rings & Cocktail Pieces
  ["Royal Polki Arsi Mirror Ring", "Ring", "Polki", "Yellow Gold", "22K", 18, "Polki & Mirror Glass", "Jaipur Polki", "Bridal", 78000, "ring", "Traditional thumb ring worn by Rajput brides featuring a polished mirror framed in uncut diamonds."],
  ["Three-Stone Emerald Cut Ring", "Ring", "Diamond", "Platinum", "950", 6.2, "1.8ct Diamond Trio", "Contemporary", "Engagement", 265000, "ring", "Center emerald-cut diamond flanked by two trapezoid side diamonds in bespoke platinum."],
  ["Kundan Floral Statement Ring", "Ring", "Kundan", "Yellow Gold", "22K", 14, "Kundan & Rubies", "Jaipur Kundan", "Festive", 62000, "ring", "Expansive bloom ring covering two knuckles with open-set polki petals and enamel center."],
  ["Oval Ceylon Sapphire Solitaire", "Ring", "Gemstone", "Platinum", "950", 5.8, "3.5ct Royal Blue Sapphire", "Contemporary", "Engagement", 210000, "ring", "Natural unheated Ceylon sapphire of velvety royal blue framed by micropavé diamond band."],
  ["Vintage Art Deco Diamond Band", "Ring", "Diamond", "White Gold", "18K", 4.8, "0.90ct Diamonds", "Contemporary", "Wedding", 95000, "ring", "Geometric milgrain-edged eternity band echoing the golden era of 1920s high design."],
  ["Solitaire Cushion Halo Ring", "Ring", "Diamond", "Rose Gold", "18K", 4.4, "1.2ct Cushion Diamond", "Contemporary", "Engagement", 198000, "ring", "Warm antique cushion-cut solitaire diamond encircled by a double rose gold pavé halo."],
  ["Temple Lakshmi Mudra Ring", "Ring", "Temple", "Yellow Gold", "22K", 9.5, "Ruby Accent", "Kerala Temple", "Festive", 46000, "ring", "Solid carved 22K gold ring carrying the auspicious blessing of Goddess Lakshmi."],
  ["Royal Polki Choker with Carved Emeralds", "Necklace", "Polki", "Yellow Gold", "22K", 72, "Uncut Polki & Carved Emeralds", "Jaipur Polki", "Bridal", 360000, "necklace", "Masterpiece bridal choker adorned with fluted Russian emerald beads and certified Syndicate uncut polki."],

  // 89 - 104: Comprehensive Regional Traditions Across India
  // Assam & North East (Ahom Dynasty & Nature Motifs)
  ["Assamese Junbiri Gold Locket Haar", "Necklace", "Gold", "Yellow Gold", "22K", 46, "Red Meenakari Lac", "Assamese Craft", "Bridal", 198000, "necklace", "Historic Assamese half-moon lac-filled crescent necklace embossed with red and green enamel florals."],
  ["Assamese Dholbiri Traditional Necklace", "Necklace", "Gold", "Yellow Gold", "22K", 38, "Lac & Pearls", "Assamese Craft", "Festive", 162000, "necklace", "Traditional royal Ahom drum-shaped pendant strung on ruby-tinted seed beads and pearl tassels."],
  ["Assamese Gamkharu Gold Embossed Cuff", "Bangle", "Gold", "Yellow Gold", "22K", 52, "None", "Assamese Craft", "Bridal", 228000, "bangle", "Heavy hinged Assamese bridal wrist cuff with embossed floral scrollwork and traditional silver clasp."],
  ["Lokaparo Twin Pigeon Earrings", "Earrings", "Gold", "Yellow Gold", "22K", 16, "Rubies & Pearls", "Assamese Craft", "Festive", 74000, "earring", "Sacred Assamese bridal ear ornaments featuring back-to-back twin pigeons symbolising eternal union."],

  // Odisha (Cuttack Tarakashi & Puri Jagannath Heritage)
  ["Cuttack Tarakashi Silver-Gold Mathamani", "Maang Tikka", "Silver", "Sterling Silver", "925", 26, "24K Micron Gold Plated", "Odisha Tarakashi", "Bridal", 14500, "necklace", "Ethereal 500-year-old Cuttack spiderweb silver filigree forehead ornament dipped in 24K pure gold."],
  ["Jagannath Temple Belpatra Haar", "Necklace", "Temple", "Yellow Gold", "22K", 74, "Rubies", "Odisha Temple", "Bridal", 310000, "necklace", "Sacred Puri temple necklace shaped in auspicious three-leafed wood-apple motifs set with cabochon rubies."],
  ["Cuttack Spiderweb Filigree Kangan Pair", "Bangle", "Silver", "Sterling Silver", "925", 58, "Gold Dipped Filigree", "Odisha Tarakashi", "Wedding", 19800, "bangle", "Pair of Cuttack gossamer filigree bangles hand-woven from silver wire thinner than human hair."],

  // Banaras & Awadh (GI-Tagged Gulabi Meenakari & Court Elegance)
  ["Banarasi Gulabi Meenakari Lotus Haar", "Necklace", "Meenakari", "Yellow Gold", "22K", 68, "Pink Enamel & Polki", "Banarasi Meenakari", "Bridal", 285000, "necklace", "Rare Varanasi GI-tagged pink enamel necklace featuring blooming lotus medallions and uncut polki diamonds."],
  ["Nawabi Royal Passa (Jhoomar)", "Maang Tikka", "Kundan", "Yellow Gold", "22K", 32, "Polki & Basra Pearls", "Awadhi Craft", "Bridal", 138000, "necklace", "Graceful Awadhi side-headpiece of tiered chandelier arches tipped with Basra pearl drops."],
  ["Awadhi Hansuli Choker with Pearls", "Necklace", "Gold", "Yellow Gold", "22K", 54, "Pearls", "Awadhi Craft", "Bridal", 235000, "necklace", "Rigid crescent collar adorned with Lucknowi floral jaali work and double-row seed pearl trimming."],

  // Tamil Nadu (Chettinad & Thanjavur Nakshi)
  ["Chettinad Antique Kemp Vanki", "Bangle", "Temple", "Yellow Gold", "22K", 48, "Burmese Kemp Rubies", "Tamil Temple", "Bridal", 210000, "bangle", "Traditional inverted V-shaped Chettinad armlet embossed with snake coils and raw unheated kemp stones."],
  ["Thanjavur Nakshi Lakshmi Haar", "Necklace", "Temple", "Yellow Gold", "22K", 88, "Rubies & Emeralds", "Tamil Temple", "Bridal", 380000, "necklace", "Repoussé carved temple gold necklace with makara crocodile terminals and Gajalakshmi medallion."],

  // Karnataka (Mysore & Coorg Heirlooms)
  ["Mysore Royal Gandaberunda Haar", "Necklace", "Temple", "Yellow Gold", "22K", 82, "Rubies & Pearls", "Mysore Temple", "Bridal", 355000, "necklace", "Imperial Wodeyar two-headed mythological bird crest set with antique rubies and Basra pearls."],
  ["Coorgi Kokkethathi Crescent Pendant", "Necklace", "Gemstone", "Yellow Gold", "22K", 44, "Rubies & Pearls", "Coorg Traditional", "Bridal", 192000, "necklace", "Traditional Kodava crescent bridal talisman crowned with a serpent hood and rimmed with seed pearls."],

  // Pahari & Himalayan (Himachal & Uttarakhand)
  ["Tehri Garhwali Royal Nath", "Nath", "Gold", "Yellow Gold", "22K", 18, "Rubies & Pearls", "Pahari Traditional", "Bridal", 82000, "pearl", "Grand ceremonial gold circular nath of Garhwal and Kumaon, intricately chased with dancing peacocks."],
  ["Pahari Chandrahaar Silver-Gold Haar", "Necklace", "Silver", "Sterling Silver", "925", 85, "Gold Vermeil", "Pahari Traditional", "Wedding", 24500, "pendant", "Magnificent five-tier crescent filigree necklace worn by mountain brides across Himachal and Kashmir."],
];

// Rich, curated product picks per brand (8-12 picks each = 200+ unique marketplace products)
const picks: Record<string, [number, number[]]> = {
  "shringaar-studio": [1.0, [0, 4, 12, 8, 17, 32, 36, 48, 50, 96, 97]],
  ratnaveda: [1.05, [10, 11, 23, 6, 26, 41, 51, 64, 70, 83, 102]],
  swarnika: [1.1, [2, 5, 12, 19, 17, 33, 48, 63, 68, 86, 100, 101]],
  alankaara: [0.9, [17, 5, 16, 27, 26, 45, 77, 82, 84, 92]],
  "kanchan-co": [1.0, [2, 28, 12, 4, 1, 35, 39, 57, 72, 98, 104]],
  raniwala: [1.15, [0, 21, 20, 19, 13, 32, 46, 55, 56, 87, 103]],
  noorvatika: [1.1, [23, 4, 28, 0, 15, 37, 53, 72, 79, 87, 96, 97]],
  manimaya: [1.0, [10, 11, 26, 23, 6, 41, 64, 83, 86, 102]],
  aadyaa: [0.85, [17, 16, 27, 3, 26, 45, 52, 77, 84]],
  zariya: [1.0, [24, 3, 15, 4, 27, 43, 45, 75, 79, 93]],
  "kesar-jewels": [1.0, [7, 13, 4, 5, 30, 40, 60, 78, 82, 96]],
  vasundhara: [0.95, [29, 22, 1, 31, 18, 43, 58, 69, 76, 89, 90, 93, 94, 95]],
  amulya: [0.7, [3, 17, 27, 5, 12, 33, 45, 77, 84, 93]],
  saanjh: [1.0, [15, 23, 11, 4, 24, 43, 70, 75, 81]],
  nayantara: [0.95, [26, 27, 3, 17, 16, 47, 77, 84, 85]],
  "kalaa-by-you": [0.9, [18, 29, 22, 25, 7, 43, 61, 69, 76, 89, 91, 95, 104]],
  svarna: [1.05, [12, 2, 9, 8, 5, 33, 48, 63, 86, 100]],
  "ritu-ratna": [1.0, [7, 5, 31, 10, 25, 40, 71, 82, 92]],
  devasena: [1.1, [1, 0, 13, 20, 21, 33, 34, 52, 55, 59, 86, 99, 100, 101]],
  "anaya-jewels": [0.6, [25, 16, 18, 17, 27, 37, 46, 79]],
};

const rnd = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const round = (n: number) => (n > 20000 ? Math.round(n / 500) * 500 : n > 3000 ? Math.round(n / 100) * 100 : Math.round(n / 10) * 10 - 1);

export const products: Product[] = brands.flatMap((b, bi) => {
  const [factor, idxs] = picks[b.slug] ?? [1, [0, 1, 2, 3, 4, 5, 6, 7]];
  return idxs.map((ti, k) => {
    const t = templates[ti] ?? templates[0];
    const seed = bi * 20 + k + 1;
    const price = round(t[9] * factor * (0.94 + rnd(seed) * 0.14));
    const imgs = [
      pick(pools[t[10]], ti + bi),
      pick(pools[t[10]], ti + bi + 1),
      pick(pools[t[10]], ti + bi + 2),
      pick(pools.gem, bi + k),
    ];
    const stock = Math.floor(rnd(seed + 3) * 14);
    return {
      id: `${b.slug}-${ti}`,
      name: t[0],
      brandSlug: b.slug,
      type: t[1],
      category: t[2],
      metal: t[3],
      purity: t[4],
      weight: Math.round(t[5] * (0.95 + rnd(seed + 1) * 0.12) * 10) / 10,
      stone: t[6],
      craft: t[7],
      occasion: t[8],
      price,
      mrp: round(price * (1.08 + rnd(seed + 2) * 0.12)),
      inStock: stock > 1,
      stockCount: stock,
      rating: Math.round((4.2 + rnd(seed + 5) * 0.75) * 10) / 10,
      reviewCount: 8 + Math.floor(rnd(seed + 6) * 190),
      images: imgs,
      description: t[11],
      convertible: ti === 24 || b.slug === "zariya",
      isNew: rnd(seed + 7) > 0.72,
      trending: rnd(seed + 8) > 0.68,
    } as Product;
  });
});

export const getProduct = (id?: string) => products.find((p) => p.id === id);
export const productsByBrand = (slug: string) => products.filter((p) => p.brandSlug === slug);
export const similarProducts = (p: Product, n = 4) =>
  products
    .filter((x) => x.id !== p.id)
    .map((x) => ({ x, s: (x.type === p.type ? 3 : 0) + (x.category === p.category ? 2 : 0) + (x.occasion === p.occasion ? 1 : 0) + rnd(x.price) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((o) => o.x);

export const metals = ["Yellow Gold", "White Gold", "Rose Gold", "Platinum", "Sterling Silver", "Gold-plated Brass"];
export const purities = ["24K", "22K", "18K", "14K", "925", "950"];
export const occasions = ["Bridal", "Wedding", "Festive", "Party", "Engagement", "Daily Wear", "Gifting"];
export const stoneTypes = ["Diamond", "Polki", "Ruby", "Emerald", "Pearl", "Kundan", "Navratna", "Birthstone", "None"];
export const craftStyles = Array.from(new Set(templates.map((t) => t[7])));
export const materialCategories: MaterialCategory[] = ["Gold", "Silver", "Diamond", "Platinum", "Gemstone", "Kundan", "Polki", "Temple", "Meenakari", "Fashion"];
