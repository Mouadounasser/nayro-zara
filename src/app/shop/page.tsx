import { getProducts } from "@/lib/products"
import { ProductGrid } from "@/components/product/ProductGrid"
import { ShopFilters } from "@/components/shop/ShopFilters"

export const metadata = { title: "Shop | NAYRO" }

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ filter?: string; sort?: string; q?: string; color?: string; size?: string; audience?: string }> }) {
  const params = await searchParams
  let products = await getProducts({ search: params.q, audience: params.audience })

  if (params.filter === "new") products = products.filter(p => p.is_new)
  if (params.filter === "sale") products = products.filter(p => !!p.compare_at_price)
  if (params.filter === "bestseller") products = products.filter(p => p.is_bestseller)
  if (params.color) products = products.filter(p => p.variants.some(v => v.color?.toLowerCase() === params.color?.toLowerCase()))
  if (params.size) products = products.filter(p => p.variants.some(v => v.size === params.size))

  if (params.sort === "price-asc") products = [...products].sort((a,b) => a.price - b.price)
  if (params.sort === "price-desc") products = [...products].sort((a,b) => b.price - a.price)
  if (params.sort === "newest") products = [...products].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-[0.2em]">BOUTIQUE</h1>
        <p className="text-sm text-zinc-500 mt-2">{products.length} produits</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[240px] shrink-0">
          <ShopFilters />
        </div>
        <div className="flex-1">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  )
}
