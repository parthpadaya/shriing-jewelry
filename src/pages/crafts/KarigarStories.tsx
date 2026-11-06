import { Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero, Reveal } from "@/components/common/ui";
import { brands } from "@/data/brands";
import { crafts } from "@/data/collections";
import { IMG } from "@/data/images";
import { useDocumentTitle } from "@/hooks";

export default function KarigarStories() {
  useDocumentTitle("Karigar Stories");
  const stories = [
    ...crafts.flatMap((c) => c.artisans.map((a) => ({ ...a, place: c.name, to: `/crafts/${c.slug}`, brand: undefined as string | undefined }))),
  ];
  return (
    <>
      <PageHero eyebrow="Karigar Stories" title="The Hands Behind the Gold" sub="Every SHRIING piece carries the name of the artisan who made it. Meet the people who keep India's jewelry traditions alive." image={IMG.craft} />
      <div className="container-x py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((s, i) => (
            <Reveal key={s.name} delay={(i % 3) * 0.08}>
              <article className="card h-full overflow-hidden"><img src={s.image} alt={s.name} loading="lazy" className="aspect-[4/3] w-full object-cover" /><div className="p-6"><p className="eyebrow">{s.place}</p><h2 className="mt-1 font-serif text-3xl text-burgundy-dark">{s.name}</h2><p className="text-sm text-muted">{s.role} · {s.years} years of practice</p><Quote size={18} className="mt-4 text-gold" /><p className="mt-1 font-serif text-xl leading-snug italic">{s.quote}</p><Link to={s.to} className="mt-5 inline-block text-sm text-burgundy underline underline-offset-4">Read the craft story</Link></div></article>
            </Reveal>
          ))}
        </div>
        <h2 className="mt-24 text-center font-serif text-4xl text-burgundy-dark">Brand Karigars</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{brands.slice(0, 8).map((b) => (<Link key={b.slug} to={`/brands/${b.slug}`} className="card flex items-center gap-4 p-4 transition hover:-translate-y-1"><img src={b.artisan.image} alt="" className="h-16 w-16 rounded-full object-cover" /><div><p className="font-medium">{b.artisan.name}</p><p className="text-xs text-muted">{b.name}</p></div></Link>))}</div>
      </div>
    </>
  );
}
