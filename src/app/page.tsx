import Link from "next/link"
import Image from "next/image"
import { getProducts } from "@/lib/products"
import { ProductGrid } from "@/components/product/ProductGrid"

export default async function HomePage() {
  const featured = await getProducts({ limit: 6 })
  const sacs = await getProducts({ category: "sacs", limit: 4 })

  return (
    <div className="bg-[#fdfcf8]">
      {/* HERO - LUXÈRA inspired: beige, left text, right image */}
      <section className="bg-[#f9f1e8] overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <div className="grid md:grid-cols-2 min-h-[540px] lg:min-h-[620px] items-center gap-8 py-8 md:py-0">
            <div className="order-2 md:order-1 py-8 md:py-16">
              <p className="text-xs tracking-[0.35em] text-zinc-500 mb-4">NOUVELLE COLLECTION</p>
              <h1 className="text-4xl lg:text-5xl font-light leading-tight tracking-tight">
                Timeless Style.<br />
                <span className="italic font-light text-zinc-700">Modern Elegance.</span>
              </h1>
              <p className="text-sm text-zinc-600 mt-4 max-w-md leading-relaxed">
                Carry your vibe — Découvrez des sacs raffinés, durables et pensés pour le Maroc. Conçu à Casablanca, porté partout.
              </p>
              <Link href="/shop" className="inline-block mt-8 bg-black text-white text-xs tracking-[0.2em] px-8 py-3 hover:bg-zinc-800 transition-colors">
                SHOP COLLECTION
              </Link>
            </div>
            <div className="order-1 md:order-2 relative h-[380px] md:h-[540px] lg:h-[620px] overflow-hidden">
              <Image
                src="https://picsum.photos/seed/nayro-hero-luxera/800/1000"
                alt="NAYRO - Femme avec sac noir"
                fill
                priority
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
        {/* Features below hero */}
        <div className="border-t border-black/5 bg-white/50 backdrop-blur">
          <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-4 flex flex-wrap justify-center md:justify-between gap-6 text-xs">
            <span className="flex items-center gap-2 tracking-widest"><span className="w-6 h-6 border border-black/10 flex items-center justify-center">◇</span> QUALITÉ PREMIUM</span>
            <span className="flex items-center gap-2 tracking-widest"><span className="w-6 h-6 border border-black/10 flex items-center justify-center">✈</span> LIVRAISON PARTOUT AU MAROC</span>
            <span className="flex items-center gap-2 tracking-widest"><span className="w-6 h-6 border border-black/10 flex items-center justify-center">✧</span> DESIGN EXCLUSIF NAYRO</span>
          </div>
        </div>
      </section>

      {/* 4 CATEGORY CARDS */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "SACS", sub: "EXPLORE →", img: "https://picsum.photos/seed/nayro-cat-sacs/600/800", href: "/shop/sacs" },
            { title: "ACCESSOIRES", sub: "EXPLORE →", img: "https://picsum.photos/seed/nayro-cat-acc/600/800", href: "/shop/accessories" },
            { title: "NOUVEAUTÉS", sub: "EXPLORE →", img: "https://picsum.photos/seed/nayro-cat-new/600/800", href: "/shop?filter=new" },
            { title: "MEILLEURES VENTES", sub: "SHOP NOW →", img: "https://picsum.photos/seed/nayro-cat-best/600/800", href: "/shop?filter=bestseller" },
          ].map(c => (
            <Link key={c.title} href={c.href} className="group relative h-[280px] lg:h-[340px] overflow-hidden bg-zinc-100">
              <Image src={c.img} alt={c.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm tracking-[0.2em]">{c.title}</p>
                <p className="text-xs tracking-widest opacity-80 mt-1">{c.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-center w-full md:w-auto text-lg tracking-[0.2em]">FEATURED PRODUCTS</h2>
          <Link href="/shop" className="hidden md:block text-xs tracking-[0.2em] border-b border-black pb-1">VIEW ALL →</Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      {/* LOOKBOOK */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8">
        <div className="flex gap-8 mb-6">
          <div>
            <h3 className="text-sm tracking-[0.2em]">LOOKBOOK</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs">Effortless style for every moment. Explore the latest through our lens.</p>
          </div>
          <Link href="/shop" className="ml-auto hidden md:block text-xs border border-black px-4 py-2 h-fit tracking-widest">EXPLORE LOOKBOOK</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "https://picsum.photos/seed/nayro-look1/600/800",
            "https://picsum.photos/seed/nayro-look2/600/800",
            "https://picsum.photos/seed/nayro-look3/600/800",
            "https://picsum.photos/seed/nayro-look4/600/800",
          ].map((img, i) => (
            <div key={i} className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
              <Image src={img} alt={`Look ${i}`} fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>
      </section>

      {/* SEASONAL SALE */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8">
        <div className="bg-black text-white grid md:grid-cols-3 items-center overflow-hidden">
          <div className="p-8 md:p-10">
            <p className="text-xs tracking-[0.3em] opacity-60">SEASONAL</p>
            <p className="text-3xl font-light tracking-wide">SALE</p>
          </div>
          <div className="text-center py-6 md:py-10 border-y md:border-y-0 md:border-x border-white/10">
            <p className="text-2xl tracking-[0.2em]">UP TO</p>
            <p className="text-4xl font-light">40% OFF</p>
            <p className="text-xs tracking-widest opacity-60">ON SELECTED ITEMS</p>
          </div>
          <div className="p-8 flex flex-col items-center md:items-end gap-4">
            <Link href="/shop?filter=sale" className="border border-white text-xs tracking-[0.2em] px-6 py-3 hover:bg-white hover:text-black transition-colors">SHOP THE SALE</Link>
            <div className="hidden md:block relative w-24 h-24">
              <Image src="https://picsum.photos/seed/nayro-sale/200/200" alt="Sale" fill className="object-cover" unoptimized />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-12">
        <h3 className="text-center text-sm tracking-[0.2em] mb-8">WHAT OUR CUSTOMERS SAY</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Emily R.", text: "The quality is exceptional and the styles are timeless. My new favourite brand!", stars: 5 },
            { name: "James L.", text: "Fast delivery, beautiful packaging, and amazing customer service. Highly recommend!", stars: 5 },
            { name: "Sophie M.", text: "Every piece feels so luxurious. I always get compliments!", stars: 5 },
          ].map(t => (
            <div key={t.name} className="bg-white border border-zinc-100 p-6 text-center">
              <p className="text-amber-500 text-xs">{"★".repeat(t.stars)}</p>
              <p className="text-sm text-zinc-600 mt-3 leading-relaxed">&quot;{t.text}&quot;</p>
              <p className="text-xs tracking-widest mt-4">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-sm tracking-[0.2em]">FOLLOW US ON INSTAGRAM</h3>
            <p className="text-xs text-zinc-500">@nayro.shop</p>
          </div>
          <a href="https://instagram.com/nayro.shop" target="_blank" className="hidden md:block text-xs border border-black px-4 py-2 tracking-widest">VIEW INSTAGRAM</a>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {[
            "https://picsum.photos/seed/nayro-ig1/400/400",
            "https://picsum.photos/seed/nayro-ig2/400/400",
            "https://picsum.photos/seed/nayro-ig3/400/400",
            "https://picsum.photos/seed/nayro-ig4/400/400",
            "https://picsum.photos/seed/nayro-ig5/400/400",
            "https://picsum.photos/seed/nayro-ig6/400/400",
          ].map((img, i) => (
            <a key={i} href="https://instagram.com/nayro.shop" target="_blank" className="relative aspect-square overflow-hidden bg-zinc-100 group">
              <Image src={img} alt="Instagram" fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
            </a>
          ))}
        </div>
      </section>

      {/* OUR STORY + JOIN */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8 grid md:grid-cols-2 gap-6">
        <div className="bg-[#f9f1e8] p-8 flex gap-6">
          <div className="flex-1">
            <h4 className="text-sm tracking-[0.2em]">OUR STORY</h4>
            <p className="text-xs text-zinc-600 mt-3 leading-relaxed">NAYRO is more than fashion — it&apos;s a lifestyle. Carry your vibe. We create pieces that blend modern sophistication, empowering you to express your true self.</p>
            <Link href="/about" className="inline-block mt-4 text-xs tracking-widest border-b border-black pb-1">READ MORE →</Link>
          </div>
          <div className="hidden sm:block relative w-24 h-32 shrink-0">
            <Image src="https://picsum.photos/seed/nayro-story/200/300" alt="Our story" fill className="object-cover" unoptimized />
          </div>
        </div>
        <div className="bg-[#f9f1e8] p-8">
          <h4 className="text-sm tracking-[0.2em]">JOIN OUR WORLD</h4>
          <p className="text-xs text-zinc-500 mt-2">Subscribe to get early access to new collections and exclusive offers.</p>
          <form className="mt-4 flex border border-zinc-300 bg-white">
            <input placeholder="Enter your email address" className="flex-1 px-4 py-3 text-sm placeholder:text-zinc-400 focus:outline-none" />
            <button type="submit" className="bg-black text-white text-xs tracking-[0.2em] px-6">SUBSCRIBE</button>
          </form>
        </div>
      </section>

      {/* Extra spacing for pro feel */}
      <div className="h-8" />
    </div>
  )
}
