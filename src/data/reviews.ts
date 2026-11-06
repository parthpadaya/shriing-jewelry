import type { Review } from "@/types";

const names = ["Ananya Sharma", "Priya Menon", "Kavya Reddy", "Ritu Agarwal", "Sneha Patil", "Meera Iyer", "Aditi Banerjee", "Simran Kaur", "Divya Nair", "Pooja Shah", "Neha Gupta", "Ishita Joshi"];
const cities = ["Mumbai", "Bengaluru", "Delhi", "Chennai", "Kolkata", "Hyderabad", "Pune", "Jaipur", "Ahmedabad", "Kochi", "Lucknow", "Chandigarh"];
const titles = ["Stunning craftsmanship", "Worth every rupee", "Exactly like the photos", "Wore it at my sister's wedding", "Beautiful finish", "Great gifting choice", "Heirloom quality", "Lightweight and elegant"];
const texts = [
  "The detailing is far better than I expected. Arrived in a gorgeous box with the certificate and everyone at the function asked where I got it from.",
  "I customised the engraving and it came out perfectly. The team shared progress photos through production, which made it feel very personal.",
  "Delivery was quick and the packaging felt premium. The gold has a lovely warm glow in daylight.",
  "I was nervous ordering fine jewelry online, but the live price breakup and hallmark details gave me confidence. Happy customer!",
  "Gifted this to my mother on our anniversary and she hasn't taken it off since. The finish is flawless.",
  "Comfortable for long hours and the stones sparkle beautifully. Customer support helped me choose the right size.",
];

const hash = (s: string) => Array.from(s).reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export const getReviews = (seed: string, n = 6): Review[] =>
  Array.from({ length: n }, (_, i) => {
    const h = hash(seed + i);
    const d = new Date(2025, (h % 12), 1 + (h % 27));
    return {
      id: `${seed}-${i}`,
      name: names[(h + i) % names.length],
      city: cities[(h >> 3) % cities.length],
      rating: i % 5 === 3 ? 4 : 5,
      title: titles[(h >> 2) % titles.length],
      text: texts[(h >> 1) % texts.length],
      date: d.toISOString(),
    };
  });
