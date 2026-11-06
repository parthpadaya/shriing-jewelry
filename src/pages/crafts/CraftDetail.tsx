import { Flame, Quote } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { EmptyState, PageHero, Reveal, SectionHeading } from "@/components/common/ui";
import { ProductCard } from "@/components/product/ProductCard";
import { crafts } from "@/data/collections";
import { products } from "@/data/products";
import { useDocumentTitle } from "@/hooks";

export default function CraftDetail() {
  const { slug } = useParams();
  const c = crafts.find((x) => x.slug === slug);
  useDocumentTitle(c ? `${c.name} Craftsmanship` : "Craft");
  if (!c) return <div className="container-x py-24"><EmptyState title="Craft not found" action={<Link to="/crafts" className="btn btn-primary">All crafts</Link>} /></div>;
  const featured = products.filter((p) =>
    c.match.some((m) => new RegExp(m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(`${p.craft} ${p.name}`))
  ).slice(0, 8);
  const fallback = featured.length ? featured : products.filter((p) => p.trending).slice(0, 4);
  return (
    <>
      <PageHero eyebrow={c.region} title={c.name} sub={c.tagline} image={c.image}><div className="flex flex-wrap gap-2">{c.specialties.map((s) => (<span key={s} className="rounded-full border border-gold/60 px-4 py-1.5 text-sm text-gold-light">{s}</span>))}</div></PageHero>
      <section className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-2">
        <Reveal><p className="eyebrow">Craft History</p><h2 className="mt-3 font-serif text-4xl text-burgundy-dark md:text-5xl">A tradition older than the trade routes</h2><p className="mt-5 text-lg leading-relaxed text-muted">{c.history}</p></Reveal>
        <Reveal delay={0.1}><img src={c.image} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-md object-cover shadow-lift" /></Reveal>
      </section>
      <section className="bg-champagne/60 py-16 md:py-24"><div className="container-x">
        <SectionHeading eyebrow="Manufacturing Story" title="From Wax to Wedding" sub="Five stages, dozens of hands — how a piece is made in the traditional manner." />
        <ol className="grid gap-5 md:grid-cols-5">{c.story.map((s, i) => (<Reveal key={s} delay={i * 0.07}><li className="card h-full p-5"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy font-serif text-xl text-gold-light">{i + 1}</span><p className="mt-4 text-sm leading-relaxed text-ink/85">{s}</p>{i === 2 && <Flame size={16} className="mt-3 text-gold" />}</li></Reveal>))}</ol>
      </div></section>
      <section className="container-x py-16 md:py-24">
        <SectionHeading eyebrow="Karigar Profiles" title="The Hands Behind the Craft" />
        <div className="grid gap-8 md:grid-cols-2">{c.artisans.map((a) => (<Reveal key={a.name}><div className="card flex flex-col overflow-hidden sm:flex-row"><img src={a.image} alt={a.name} loading="lazy" className="h-64 w-full object-cover sm:h-auto sm:w-48" /><div className="p-6"><h3 className="font-serif text-3xl text-burgundy-dark">{a.name}</h3><p className="text-sm text-gold-dark">{a.role} · {a.years} years</p><Quote size={20} className="mt-4 text-gold" /><p className="mt-1 font-serif text-xl leading-snug text-ink/85 italic">{a.quote}</p></div></div></Reveal>))}</div>
      </section>
      <section className="container-x pb-24"><SectionHeading eyebrow="Featured Jewelry" title={`${c.name} Collection`} align="left" action={<Link to="/shop" className="btn btn-outline btn-sm">Shop all</Link>} />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">{fallback.map((p, i) => (<ProductCard key={p.id} p={p} index={i} />))}</div>
        <div className="mt-14 flex flex-wrap justify-center gap-3">{crafts.filter((x) => x.slug !== c.slug).map((x) => (<Link key={x.slug} to={`/crafts/${x.slug}`} className="chip">{x.name}</Link>))}</div>
      </section>
    </>
  );
}
