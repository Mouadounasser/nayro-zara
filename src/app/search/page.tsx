import { getProducts } from "@/lib/products"
import { ProductGrid } from "@/components/product/ProductGrid"
import { Input } from "@/components/ui/input"

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const products = q ? await getProducts({ search: q }) : []

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8">
      <h1 className="text-2xl font-light tracking-[0.2em] mb-6">RECHERCHE</h1>
      <form className="max-w-xl mb-8">
        <Input name="q" defaultValue={q} placeholder="Rechercher produits, catégories, SKU..." autoFocus className="rounded-none h-12" />
      </form>

      {q ? (
        <>
          <p className="text-sm text-zinc-500 mb-6">{products.length} résultats pour &quot;{q}&quot;</p>
          <ProductGrid products={products} />
        </>
      ) : (
        <p className="text-sm text-zinc-500">Tapez pour rechercher parmi nos collections.</p>
      )}
    </div>
  )
}
