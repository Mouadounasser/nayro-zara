"use client"
import { useWishlist } from "@/lib/wishlist-context"
import { mockProducts } from "@/lib/mock-data"
import { ProductGrid } from "@/components/product/ProductGrid"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WishlistPage() {
  const { ids } = useWishlist()
  const products = mockProducts.filter(p => ids.includes(p.id))

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-light tracking-[0.2em] mb-4">WISHLIST</h1>
        <p className="text-zinc-500 mb-8">Aucun favori pour l&apos;instant</p>
        <Link href="/shop"><Button className="rounded-none tracking-widest text-xs">DÉCOUVRIR LA BOUTIQUE</Button></Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8">
      <h1 className="text-2xl font-light tracking-[0.2em] mb-2">WISHLIST</h1>
      <p className="text-sm text-zinc-500 mb-8">{products.length} articles</p>
      <ProductGrid products={products} />
    </div>
  )
}
