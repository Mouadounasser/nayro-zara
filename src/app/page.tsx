import Link from "next/link"
import Image from "next/image"
import { getProducts } from "@/lib/products"
import { ProductGrid } from "@/components/product/ProductGrid"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const newArrivals = await getProducts({ isNew: true, limit: 8 })
  const bestSellers = await getProducts({ bestseller: true, limit: 4 })

  return (
    <div className="bg-[#fdfcf8]">
      {/* HERO */}
      <section className="relative h-[75vh] md:h-[88vh] overflow-hidden bg-zinc-900">
        <Image
          src="https://picsum.photos/seed/nayro-hero/1920/1080"
          alt="NAYRO New Collection"
          fill
          priority
          className="object-cover opacity-90"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <p className="text-xs tracking-[0.35em] mb-4 opacity-90">NOUVELLE COLLECTION 2026</p>
          <h1 className="text-5xl md:text-7xl font-light tracking-[0.15em] mb-6">NAYRO</h1>
          <p className="text-sm md:text-base tracking-wide opacity-80 max-w-lg mb-8">
            Discover the latest collection. Minimal. Modern. Crafted for Morocco.
          </p>
          <Link href="/shop">
            <Button variant="secondary" size="lg" className="tracking-[0.2em] text-xs bg-white text-black hover:bg-zinc-100 rounded-none h-12 px-10">
              SHOP NOW
            </Button>
          </Link>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs tracking-widest hidden md:block">
          SCROLL
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-16 md:py-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-xl md:text-2xl font-light tracking-[0.2em]">NEW ARRIVALS</h2>
          <Link href="/shop?filter=new" className="text-xs tracking-[0.2em] border-b border-black pb-1 hover:opacity-70">VOIR TOUT</Link>
        </div>
        <ProductGrid products={newArrivals} />
      </section>

      {/* BEST SELLERS */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-16 md:py-20">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-xl md:text-2xl font-light tracking-[0.2em]">BEST SELLERS</h2>
            <Link href="/shop?filter=bestseller" className="text-xs tracking-[0.2em] border-b border-black pb-1 hover:opacity-70">VOIR TOUT</Link>
          </div>
          <ProductGrid products={bestSellers} />
        </div>
      </section>

      {/* EDITORIAL */}
      <section className="grid md:grid-cols-2">
        <div className="relative h-[60vh] md:h-[80vh] bg-zinc-100">
          <Image src="https://picsum.photos/seed/nayro-editorial1/800/1000" alt="Editorial" fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-xs tracking-[0.3em] mb-2">EDITORIAL</p>
            <h3 className="text-2xl font-light tracking-wide">L&apos;ESSENCE DE L&apos;HIVER</h3>
          </div>
        </div>
        <div className="relative h-[60vh] md:h-[80vh] bg-zinc-900 flex flex-col justify-center px-8 md:px-16 text-white">
          <p className="text-xs tracking-[0.3em] opacity-60 mb-4">CRAFT</p>
          <h3 className="text-3xl md:text-4xl font-light leading-tight mb-4">
            DES MATIÈRES<br />NOBLES,<br />DES COUPES<br />ÉPURÉES
          </h3>
          <p className="text-sm opacity-70 max-w-sm mb-8 leading-relaxed">
            Laine froide, cachemire, cuir pleine fleur. Chaque pièce NAYRO est pensée pour durer, saison après saison.
          </p>
          <Link href="/shop" className="text-xs tracking-[0.3em] border border-white/30 px-6 py-3 w-fit hover:bg-white hover:text-black transition-colors">
            DÉCOUVRIR
          </Link>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-16 md:py-20">
        <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] mb-8">SHOP BY CATEGORY</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "WOMEN", href: "/shop/women", img: "https://picsum.photos/seed/nayro-cat-w/600/800" },
            { label: "MEN", href: "/shop/men", img: "https://picsum.photos/seed/nayro-cat-m/600/800" },
            { label: "SHOES", href: "/shop/shoes", img: "https://picsum.photos/seed/nayro-cat-s/600/800" },
            { label: "ACCESSORIES", href: "/shop/accessories", img: "https://picsum.photos/seed/nayro-cat-a/600/800" },
          ].map(cat => (
            <Link key={cat.label} href={cat.href} className="group relative aspect-[3/4] overflow-hidden bg-zinc-100">
              <Image src={cat.img} alt={cat.label} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <span className="absolute bottom-4 left-4 text-white text-sm tracking-[0.2em]">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* NAYRO WORLD */}
      <section className="bg-[#0a0a0a] text-white py-16 md:py-24">
        <div className="mx-auto max-w-[800px] px-4 text-center">
          <p className="text-xs tracking-[0.4em] opacity-50 mb-6">NAYRO WORLD</p>
          <h2 className="text-2xl md:text-4xl font-light leading-tight mb-6">
            UN VESTIAIRE MINIMAL,<br />PENSÉ POUR LE MAROC
          </h2>
          <p className="text-sm opacity-60 leading-relaxed max-w-xl mx-auto">
            NAYRO célèbre une élégance discrète. Des coupes nettes, des matières durables et une attention portée à chaque détail. Conçu à Casablanca, porté partout.
          </p>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-16 border-t border-zinc-200">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-lg tracking-[0.2em] mb-2">NEWSLETTER</h3>
          <p className="text-sm text-zinc-500 mb-6">Be the first to discover what&apos;s next.</p>
          <form className="flex border border-zinc-300">
            <input placeholder="Votre adresse email" className="flex-1 px-4 py-3 text-sm placeholder:text-zinc-400 focus:outline-none" />
            <button type="submit" className="bg-black text-white text-xs tracking-[0.2em] px-8 hover:bg-zinc-800">S&apos;ABONNER</button>
          </form>
        </div>
      </section>
    </div>
  )
}
