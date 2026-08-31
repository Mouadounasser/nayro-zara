import { getProducts } from "@/lib/products"
import Link from "next/link"

export default async function AdminDashboard() {
  const products = await getProducts()
  // Mock stats
  const stats = [
    { label: "REVENUE", value: "42 830 MAD" },
    { label: "COMMANDES", value: `${products.length * 3}` },
    { label: "EN ATTENTE", value: "7" },
    { label: "PRODUITS", value: String(products.length) },
    { label: "CLIENTS", value: "128" },
    { label: "STOCK FAIBLE", value: "2" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-light tracking-[0.2em] mb-8">DASHBOARD</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map(s=> (
          <div key={s.label} className="bg-white border border-zinc-200 p-6">
            <p className="text-xs tracking-[0.2em] text-zinc-500">{s.label}</p>
            <p className="text-2xl font-light mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-zinc-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm tracking-[0.2em]">PRODUITS RÉCENTS</h2>
          <Link href="/admin/products" className="text-xs border border-black px-4 py-2 hover:bg-black hover:text-white">GERER</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs tracking-widest text-zinc-500 border-b">
              <tr><th className="text-left py-2">PRODUIT</th><th>PRIX</th><th>STOCK</th><th>STATUT</th></tr>
            </thead>
            <tbody>
              {products.slice(0,5).map(p=> (
                <tr key={p.id} className="border-b border-zinc-100">
                  <td className="py-3">{p.name}</td>
                  <td className="text-center">{p.price} MAD</td>
                  <td className="text-center">{p.variants.reduce((a,v)=> a+v.stock,0)}</td>
                  <td className="text-center"><span className="text-xs bg-green-100 px-2 py-1">ACTIF</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
