import { notFound } from "next/navigation"
import { getProducts } from "@/lib/products"
import { ProductGrid } from "@/components/product/ProductGrid"
import { CATEGORIES } from "@/lib/constants"

const AUDIENCE_SLUGS = ["men", "women"] as const

export async function generateStaticParams() {
  return [...CATEGORIES.map(c => ({ category: c.slug })), ...AUDIENCE_SLUGS.map(a => ({ category: a }))]
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ category: string }>, searchParams: Promise<{ sort?: string; audience?: string }> }) {
  const { category } = await params
  const { sort } = await searchParams
  const isAudience = (AUDIENCE_SLUGS as readonly string[]).includes(category)
  const cat = isAudience ? { name: category === "men" ? "MEN" : "WOMEN", slug: category } : CATEGORIES.find(c => c.slug === category)
  if (!cat) notFound()

  let products = isAudience ? await getProducts({ audience: category }) : await getProducts({ category })
  if (sort === "price-asc") products = [...products].sort((a,b) => a.price-b.price)
  if (sort === "price-desc") products = [...products].sort((a,b) => b.price-a.price)

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8">
      <div className="mb-8 text-center py-8 border-b border-zinc-100">
        <h1 className="text-3xl font-light tracking-[0.3em]">{cat.name}</h1>
        <p className="text-sm text-zinc-500 mt-2">{products.length} produits</p>
      </div>
      <ProductGrid products={products} />
    </div>
  )
}
