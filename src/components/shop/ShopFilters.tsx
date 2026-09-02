"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const categories = [
  { slug: "women", label: "Women" },
  { slug: "men", label: "Men" },
  { slug: "sacs", label: "Sacs" },
  { slug: "accessories", label: "Accessories" },
]

export function ShopFilters() {
  const sp = useSearchParams()
  const currentSort = sp.get("sort")

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs tracking-[0.2em] mb-4">CATÉGORIE</h3>
        <ul className="space-y-2 text-sm">
          <li><Link href="/shop" className="hover:underline">Tous</Link></li>
          {categories.map(c => (
            <li key={c.slug}><Link href={`/shop/${c.slug}`} className="hover:underline">{c.label}</Link></li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xs tracking-[0.2em] mb-4">TRIER</h3>
        <ul className="space-y-2 text-sm">
          <li><Link href="/shop?sort=newest" className={currentSort==="newest"?"font-medium": "hover:underline"}>Nouveautés</Link></li>
          <li><Link href="/shop?sort=price-asc" className={currentSort==="price-asc"?"font-medium": "hover:underline"}>Prix croissant</Link></li>
          <li><Link href="/shop?sort=price-desc" className={currentSort==="price-desc"?"font-medium": "hover:underline"}>Prix décroissant</Link></li>
          <li><Link href="/shop?filter=sale" className="hover:underline">Soldes</Link></li>
        </ul>
      </div>

      <div>
        <h3 className="text-xs tracking-[0.2em] mb-4">TAILLE</h3>
        <div className="flex flex-wrap gap-2">
          {["XS","S","M","L","XL"].map(s => (
            <Link key={s} href={`/shop?size=${s}`} className="w-8 h-8 border border-zinc-200 flex items-center justify-center text-xs hover:border-black">{s}</Link>
          ))}
        </div>
      </div>

      <Link href="/shop" className="block text-xs tracking-widest border border-zinc-200 text-center py-2 hover:bg-zinc-50">EFFACER LES FILTRES</Link>
    </div>
  )
}
