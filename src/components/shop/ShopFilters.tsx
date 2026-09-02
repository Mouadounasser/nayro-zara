"use client"
import Link from "next/link"
import { useSearchParams, usePathname } from "next/navigation"

const categories = [
  { slug: "women", label: "Women" },
  { slug: "men", label: "Men" },
  { slug: "sacs", label: "Sacs" },
  { slug: "accessories", label: "Accessories" },
]

const colors = [
  { name: "Noir", hex: "#0a0a0a" },
  { name: "Blanc", hex: "#ffffff" },
  { name: "Beige", hex: "#f5e6c8" },
  { name: "Marron", hex: "#5c4033" },
  { name: "Bleu", hex: "#1e3a8a" },
  { name: "Rouge", hex: "#dc2626" },
  { name: "Vert", hex: "#166534" },
  { name: "Rose", hex: "#f472b6" },
]

export function ShopFilters() {
  const sp = useSearchParams()
  const pathname = usePathname()
  const currentSort = sp.get("sort")
  const currentColor = sp.get("color")
  const currentSize = sp.get("size")

  const makeHref = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(sp.toString())
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null) params.delete(k)
      else params.set(k, v)
    })
    const qs = params.toString()
    // keep current pathname if on /shop/[category] else /shop
    return `${pathname}${qs ? `?${qs}` : ""}`
  }

  const isActiveCategory = (slug: string) => pathname === `/shop/${slug}`

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs tracking-[0.2em] mb-4">CATÉGORIE</h3>
        <ul className="space-y-2 text-sm">
          <li><Link href="/shop" className={`hover:underline ${pathname === "/shop" ? "font-medium" : ""}`}>Tous</Link></li>
          {categories.map(c => (
            <li key={c.slug}><Link href={`/shop/${c.slug}`} className={`hover:underline ${isActiveCategory(c.slug) ? "font-medium text-black" : "text-zinc-600"}`}>{c.label}</Link></li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xs tracking-[0.2em] mb-4">COULEUR</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map(c => {
            const active = currentColor?.toLowerCase() === c.name.toLowerCase()
            return (
              <Link
                key={c.name}
                href={makeHref({ color: active ? null : c.name })}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${active ? "border-black" : "border-white shadow"}`}
                style={{ background: c.hex }}
                title={c.name}
                aria-label={`Filtrer ${c.name}`}
              >
                {active && <span className="w-2 h-2 bg-white rounded-full border border-black/20" />}
              </Link>
            )
          })}
          {currentColor && <Link href={makeHref({ color: null })} className="text-xs underline ml-2 self-center">Effacer</Link>}
        </div>
      </div>

      <div>
        <h3 className="text-xs tracking-[0.2em] mb-4">TRIER</h3>
        <ul className="space-y-2 text-sm">
          <li><Link href={makeHref({ sort: null })} className={!currentSort ? "font-medium" : "hover:underline text-zinc-600"}>Pertinence</Link></li>
          <li><Link href={makeHref({ sort: "newest" })} className={currentSort==="newest"?"font-medium": "hover:underline text-zinc-600"}>Nouveautés</Link></li>
          <li><Link href={makeHref({ sort: "price-asc" })} className={currentSort==="price-asc"?"font-medium": "hover:underline text-zinc-600"}>Prix croissant</Link></li>
          <li><Link href={makeHref({ sort: "price-desc" })} className={currentSort==="price-desc"?"font-medium": "hover:underline text-zinc-600"}>Prix décroissant</Link></li>
          <li><Link href={makeHref({ filter: "sale" })} className="hover:underline text-zinc-600">Soldes</Link></li>
        </ul>
      </div>

      <div>
        <h3 className="text-xs tracking-[0.2em] mb-4">TAILLE</h3>
        <div className="flex flex-wrap gap-2">
          {["XS","S","M","L","XL"].map(s => {
            const active = currentSize === s
            return (
              <Link key={s} href={makeHref({ size: active ? null : s })} className={`w-11 h-11 min-h-[44px] min-w-[44px] border flex items-center justify-center text-xs ${active ? "bg-black text-white border-black" : "border-zinc-200 hover:border-black"}`}>{s}</Link>
            )
          })}
        </div>
      </div>

      <Link href="/shop" className="block text-xs tracking-widest border border-zinc-200 text-center py-3 hover:bg-zinc-50 min-h-[44px] flex items-center justify-center">EFFACER LES FILTRES</Link>
    </div>
  )
}
