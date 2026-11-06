import { ArrowRight, Compass } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHero, Reveal, SectionHeading } from "@/components/common/ui";
import { crafts } from "@/data/collections";
import { IMG } from "@/data/images";
import { useDocumentTitle } from "@/hooks";
import { cn } from "@/utils/cn";

const zones = [
  { id: "All", label: "All Regions (14)" },
  { id: "North", label: "North India" },
  { id: "South", label: "South India" },
  { id: "West", label: "West India" },
  { id: "East", label: "East India" },
  { id: "East & North-East", label: "North-East" },
];

export default function CraftsPage() {
  useDocumentTitle("Regional Traditions & Craftsmanship");
  const [activeZone, setActiveZone] = useState("All");

  const filtered = crafts.filter((c) => {
    if (activeZone === "All") return true;
    if (activeZone === "East") return c.zone === "East";
    return c.zone === activeZone;
  });

  return (
    <>
      <PageHero
        eyebrow="Regional Heritage"
        title="Centuries of Skill Across All Regions of India"
        sub="From Kashmir's silver-gold filigree and Jaipur's kundan to Assam's junbiri, Cuttack's tarakashi and Kerala's temple gold — discover the traditions, techniques and karigars behind every jewel."
        image={IMG.craft}
      >
        <Link to="/karigar" className="btn btn-gold">Meet the karigars <ArrowRight size={16} /></Link>
      </PageHero>

      <div className="container-x py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand pb-6">
          <div className="flex items-center gap-2 text-burgundy-dark">
            <Compass size={20} className="text-gold shrink-0" />
            <span className="font-serif text-xl sm:text-2xl font-normal">Explore Traditions by Zone</span>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-2 max-w-full pb-1 sm:flex-wrap">
            {zones.map((z) => (
              <button
                key={z.id}
                onClick={() => setActiveZone(z.id)}
                className={cn(
                  "chip shrink-0 cursor-pointer px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium uppercase tracking-wider transition whitespace-nowrap",
                  activeZone === z.id ? "chip-active bg-burgundy text-ivory border-burgundy shadow-sm" : "hover:border-gold hover:bg-champagne"
                )}
              >
                {z.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 sm:mt-14 space-y-14 sm:space-y-20">
          {filtered.map((c, i) => (
            <Reveal key={c.slug}>
              <div className={`grid items-center gap-8 lg:gap-10 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <Link to={`/crafts/${c.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-md shadow-soft">
                  <img src={c.image} alt={`${c.name} craft`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-3 rounded-sm border border-white/50" />
                  <span className="absolute top-4 sm:top-5 left-4 sm:left-5 rounded-full bg-burgundy/85 px-3 sm:px-3.5 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-ivory backdrop-blur-sm">
                    {c.region}
                  </span>
                </Link>
                <div>
                  <p className="eyebrow">{c.region}</p>
                  <h2 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl text-burgundy-dark">{c.name}</h2>
                  <p className="mt-1 font-serif text-lg sm:text-2xl text-gold-dark italic">{c.tagline}</p>
                  <div className="mt-3.5 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                    {c.specialties.map((s) => (
                      <span key={s} className="chip cursor-default bg-champagne/80 text-[11px] sm:text-xs font-medium">{s}</span>
                    ))}
                  </div>
                  <p className="mt-4 sm:mt-5 text-sm sm:text-base line-clamp-4 leading-relaxed text-muted">{c.history}</p>
                  <div className="mt-5 sm:mt-6 flex flex-wrap gap-2.5 sm:gap-3">
                    <Link to={`/crafts/${c.slug}`} className="btn btn-primary flex-1 sm:flex-none text-xs sm:text-sm py-3">
                      Explore {c.name} <ArrowRight size={15} />
                    </Link>
                    <Link to={`/shop?craft=${encodeURIComponent(c.match[0])}`} className="btn btn-outline flex-1 sm:flex-none text-xs sm:text-sm py-3">
                      Shop the craft
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <section className="bg-champagne/60 py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Marketplace"
            title="Commission a Regional Karigar"
            sub="Work directly with independent artisans on Kalaa by You — co-design a one-of-one piece with a maker's story attached."
          />
          <div className="text-center">
            <Link to="/brands/kalaa-by-you" className="btn btn-primary">Visit Kalaa by You</Link>
          </div>
        </div>
      </section>
    </>
  );
}
