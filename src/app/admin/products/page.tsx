import { getProducts } from "@/lib/products"
import Link from "next/link"
import { ProductTable } from "@/components/admin/ProductTable"

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl tracking-[0.2em]">PRODUITS</h1>
          <p className="text-xs text-zinc-500 mt-1">{products.length} produits • Cliquez sur ACTIF/FEATURED pour basculer • EDIT pour modifier complet</p>
        </div>
        <Link href="/admin/products/new" className="bg-black text-white text-xs tracking-[0.2em] px-6 py-3">NOUVEAU PRODUIT</Link>
      </div>

      <ProductTable initialProducts={products} />
    </div>
  )
}
