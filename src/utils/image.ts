import { outfitColors } from "@/data/collections";

const hexToRgb = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

/** Finds the nearest named outfit colour to the dominant tone of an image. */
export function dominantColor(url: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = c.height = 32;
        const ctx = c.getContext("2d")!;
        ctx.drawImage(img, 0, 0, 32, 32);
        const d = ctx.getImageData(0, 0, 32, 32).data;
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < d.length; i += 4) {
          const mx = Math.max(d[i], d[i + 1], d[i + 2]);
          const mn = Math.min(d[i], d[i + 1], d[i + 2]);
          if (mx - mn < 25 && (mx > 215 || mx < 40)) continue; // skip near white / black backgrounds
          r += d[i]; g += d[i + 1]; b += d[i + 2]; n++;
        }
        if (!n) return resolve("Ivory");
        r /= n; g /= n; b /= n;
        let best = outfitColors[0].name, bd = Infinity;
        outfitColors.forEach((o) => {
          const [or, og, ob] = hexToRgb(o.hex);
          const dist = (or - r) ** 2 + (og - g) ** 2 + (ob - b) ** 2;
          if (dist < bd) { bd = dist; best = o.name; }
        });
        resolve(best);
      } catch {
        resolve("Red");
      }
    };
    img.onerror = () => resolve("Red");
    img.src = url;
  });
}
