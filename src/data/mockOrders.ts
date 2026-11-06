import { brands } from "./brands";
import { products } from "./products";
import { pools } from "./images";

export const ORDER_STATUSES = ["Placed", "In Production", "Quality Check", "Shipped", "Delivered", "Cancelled"];

const customerNames = ["Ananya Sharma", "Priya Menon", "Kavya Reddy", "Rohan Mehta", "Simran Kaur", "Aditi Banerjee", "Meera Iyer", "Arjun Nair", "Neha Gupta", "Ishita Joshi", "Vikram Singh", "Pooja Shah"];
const cities = ["Mumbai", "Kochi", "Hyderabad", "Ahmedabad", "Chandigarh", "Kolkata", "Chennai", "Bengaluru", "Delhi", "Pune", "Jaipur", "Surat"];

export const adminOrders = Array.from({ length: 16 }, (_, i) => {
  const p = products[(i * 7 + 3) % products.length];
  const b = brands.find((x) => x.slug === p.brandSlug)!;
  return {
    id: `SHR-${24100 + i}`,
    customer: customerNames[i % customerNames.length],
    brand: b.name,
    brandSlug: b.slug,
    product: p.name,
    amount: p.price + (i % 3) * 1500,
    date: new Date(2026, 0, 28 - i * 2).toISOString().slice(0, 10),
    payment: ["UPI", "Card", "Net Banking", "EMI"][i % 4],
    status: ORDER_STATUSES[i % 5],
  };
});

export const adminCustomers = customerNames.map((n, i) => ({
  id: `CU-${1001 + i}`,
  name: n,
  email: n.toLowerCase().replace(" ", ".") + "@example.com",
  city: cities[i],
  orders: 1 + (i % 6),
  spent: 38000 + i * 27500,
  tier: i % 4 === 0 ? "Gold" : i % 3 === 0 ? "Silver" : "Standard",
  status: i === 7 ? "Blocked" : "Active",
}));

export const customRequests = [
  ["Halo solitaire ring, 18K white gold, 0.8ct oval", "Ring", "Pending"],
  ["Name necklace 'Aarohi' in script, rose gold", "Necklace", "Approved"],
  ["Traditional jhumka with 3 pearl drops", "Jhumka", "In Review"],
  ["Charm bracelet with evil-eye + lotus", "Bracelet", "Pending"],
  ["Heirloom polki necklace redesign — keep stones", "Heirloom", "In Review"],
  ["Soundwave pendant from wedding vows", "Apni Kahani", "Approved"],
  ["Signet ring with initials 'RM'", "Ring", "Rejected"],
  ["Emerald drop earrings, 22K yellow gold", "Earrings", "Pending"],
].map((r, i) => ({
  id: `CR-${510 + i}`,
  brand: brands[(i * 3) % brands.length].name,
  customer: customerNames[(i + 2) % customerNames.length],
  brief: r[0],
  type: r[1],
  estimate: 24000 + i * 18500,
  status: r[2],
}));

export const bridalOrders = [
  ["South Indian", "Maroon Kanjeevaram", 485000, "Design Approved"],
  ["Rajasthani", "Rani Pink", 720000, "In Production"],
  ["Bengali", "Red & Gold", 310000, "Quality Check"],
  ["Punjabi", "Bright Red", 395000, "Placed"],
  ["Gujarati", "Panetar White", 428000, "Shipped"],
  ["Maharashtrian", "Paithani Purple", 265000, "In Production"],
].map((r, i) => ({
  id: `BR-${70 + i}`,
  customer: customerNames[(i + 5) % customerNames.length],
  style: r[0],
  outfit: r[1],
  total: r[2],
  weddingDate: new Date(2026, 3 + i, 12 + i).toISOString().slice(0, 10),
  status: r[3],
}));

export const adminArtisans = [
  ["Ramesh Soni", "Kundan Master", "Jaipur", 34],
  ["Lakshmi Iyer", "Temple Jewelry", "Madurai", 38],
  ["Abdul Rahim", "Enamel Artist", "Lucknow", 28],
  ["Sushila Devi", "Filigree", "Cuttack", 29],
  ["Mahesh Patel", "Jadau", "Ahmedabad", 30],
  ["Farida Khan", "Pearl Setter", "Hyderabad", 27],
].map((r, i) => ({
  id: `AR-${i + 1}`,
  name: r[0] as string,
  craft: r[1] as string,
  city: r[2] as string,
  years: r[3] as number,
  activeOrders: 2 + (i % 4),
  status: i === 4 ? "On Leave" : "Active",
  image: pools.artisan[i % pools.artisan.length],
}));

export const adminCoupons = [
  { id: "CP-1", code: "SHRI10", discount: "10% off", minOrder: 15000, uses: 412, status: "Active" },
  { id: "CP-2", code: "WELCOME500", discount: "₹500 off", minOrder: 5000, uses: 988, status: "Active" },
  { id: "CP-3", code: "GOLD5", discount: "5% off on Gold", minOrder: 50000, uses: 156, status: "Active" },
  { id: "CP-4", code: "DIWALI15", discount: "15% off", minOrder: 25000, uses: 301, status: "Expired" },
  { id: "CP-5", code: "BRIDE20", discount: "20% off making", minOrder: 200000, uses: 44, status: "Active" },
];

export const adminReviews = Array.from({ length: 10 }, (_, i) => ({
  id: `RV-${i + 1}`,
  product: products[(i * 9) % products.length].name,
  customer: customerNames[i % customerNames.length],
  rating: i % 4 === 3 ? 3 : i % 3 === 0 ? 4 : 5,
  comment: ["Absolutely stunning craftsmanship.", "Delivery was slightly delayed but product is lovely.", "Perfect for my wedding!", "Slightly smaller than expected.", "Loved the packaging and certificate."][i % 5],
  status: i % 5 === 3 ? "Pending" : "Published",
}));

export const adminCollections = [
  { id: "CL-1", name: "The Wedding Edit", products: 32, season: "Year-round", status: "Live" },
  { id: "CL-2", name: "Festive Glow", products: 24, season: "Diwali 2026", status: "Live" },
  { id: "CL-3", name: "Everyday Luxe", products: 41, season: "Year-round", status: "Live" },
  { id: "CL-4", name: "Gemstone Stories", products: 18, season: "Year-round", status: "Live" },
  { id: "CL-5", name: "Forever Begins", products: 14, season: "Valentine's", status: "Draft" },
  { id: "CL-6", name: "After Dark", products: 21, season: "Party Season", status: "Live" },
];

export const adminContent = [
  { id: "CT-1", title: "Homepage Hero — Every Jewel Has a Story", section: "Home", updated: "2026-01-22", status: "Published" },
  { id: "CT-2", title: "Announcement Bar — Akshaya Tritiya Offer", section: "Global", updated: "2026-01-25", status: "Published" },
  { id: "CT-3", title: "Bridal Studio Intro Copy", section: "Bridal", updated: "2026-01-14", status: "Published" },
  { id: "CT-4", title: "Craftsmanship Journal — Jaipur Kundan", section: "Crafts", updated: "2026-01-09", status: "Draft" },
  { id: "CT-5", title: "Gifting Guide — Valentine's", section: "Gifting", updated: "2026-01-27", status: "Draft" },
  { id: "CT-6", title: "Return & Exchange Policy", section: "Policies", updated: "2025-12-18", status: "Published" },
];

export const revenueByMonth = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m, i) => ({
  month: m,
  revenue: Math.round((2.4 + Math.sin(i / 1.6) * 0.8 + i * 0.22 + (m === "Oct" || m === "Nov" ? 1.4 : 0)) * 10) / 10,
  orders: 180 + i * 22 + (m === "Oct" || m === "Nov" ? 140 : 0),
}));

export const salesByBrand = brands.slice(0, 8).map((b, i) => ({ name: b.name.split(" ")[0], sales: 62 - i * 5 + (i % 3) * 3 }));

export const productionStages = ["Design Approved", "Casting", "Stone Setting", "Polishing", "Quality Check", "Ready to Ship"];
