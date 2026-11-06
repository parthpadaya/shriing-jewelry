import { pools, px } from "./images";

export const homeCategories = [
  { name: "Gold Jewelry", image: px(37485315, 700), to: "/shop?category=Gold" },
  { name: "Diamond Jewelry", image: px(5737315, 700), to: "/shop?category=Diamond" },
  { name: "Rings", image: px(2849742, 700), to: "/shop?type=Ring" },
  { name: "Necklaces", image: px(31772511, 700), to: "/shop?type=Necklace" },
  { name: "Earrings", image: px(37601639, 700), to: "/shop?type=Earrings" },
  { name: "Bangles", image: px(37485314, 700), to: "/shop?type=Bangle" },
  { name: "Bridal Sets", image: px(35059564, 700), to: "/shop?occasion=Bridal" },
  { name: "Gemstones", image: px(34703308, 700), to: "/shop?category=Gemstone" },
  { name: "Daily Wear", image: pools.pearl[1], to: "/shop?occasion=Daily Wear" },
  { name: "Personalized Gifts", image: pools.pendant[0], to: "/gifting" },
];

export const adminCategories = [
  { id: "c1", name: "Gold", products: 24, status: "Active" },
  { id: "c2", name: "Silver", products: 11, status: "Active" },
  { id: "c3", name: "Diamond", products: 17, status: "Active" },
  { id: "c4", name: "Platinum", products: 3, status: "Active" },
  { id: "c5", name: "Gemstone", products: 14, status: "Active" },
  { id: "c6", name: "Kundan", products: 9, status: "Active" },
  { id: "c7", name: "Polki", products: 5, status: "Active" },
  { id: "c8", name: "Temple", products: 4, status: "Active" },
  { id: "c9", name: "Meenakari", products: 6, status: "Active" },
  { id: "c10", name: "Fashion", products: 7, status: "Draft" },
];
