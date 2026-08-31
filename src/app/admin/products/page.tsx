import { getProducts } from "@/lib/products"
import Link from "next/link"
import { formatMAD } from "@/lib/utils"

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl tracking-[0.2em]">PRODUITS</h1>
        <Link href="/admin/products/new" className="bg-black text-white text-xs tracking-[0.2em] px-6 py-3">NOUVEAU PRODUIT</Link>
      </div>

      <div className="bg-white border border-zinc-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50 text-xs tracking-widest">
            <tr>
              <th className="text-left p-3">PRODUIT</th>
              <th className="p-3">SKU</th>
              <th className="p-3">CATÉGORIE</th>
              <th className="p-3">PRIX</th>
              <th className="p-3">STOCK</th>
              <th className="p-3">STATUT</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p=> (
              <tr key={p.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                <td className="p-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-zinc-500">{p.slug}</div>
                </td>
                <td className="p-3 text-center font-mono text-xs">{p.sku}</td>
                <td className="p-3 text-center text-xs">{p.category_slug}</td>
                <td className="p-3 text-center">{formatMAD(p.price)}</td>
                <td className="p-3 text-center">{p.variants.reduce((a,b)=>a+b.stock,0)}</td>
                <td className="p-3 text-center"><span className={`text-xs px-2 py-1 ${p.is_active ? "bg-green-100":"bg-zinc-200"}`}>{p.is_active?"ACTIF":"INACTIF"}</span></td>
                <td className="p-3 text-center">
                  <Link href={`/product/${p.slug}`} className="text-xs underline">VOIR</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
