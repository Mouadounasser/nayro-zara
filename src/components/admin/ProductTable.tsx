"use client"
import { useState } from "react"
import Link from "next/link"
import { formatMAD } from "@/lib/utils"
import { useToast } from "@/components/ui/toast"
import type { Product } from "@/lib/types"

export function ProductTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const { toast } = useToast()

  const updateField = async (id: string, field: string, value: any) => {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", field, value }),
    })
    if (res.ok) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
      toast("Mis à jour", "success")
    } else {
      const err = await res.json()
      toast(err.error || "Erreur", "error")
    }
  }

  const duplicate = async (id: string) => {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "duplicate" }),
    })
    if (res.ok) {
      const dup = await res.json()
      toast(`Dupliqué: ${dup.slug}`, "success")
      window.location.reload()
    } else {
      toast("Erreur duplication", "error")
    }
  }

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== id))
      toast("Supprimé", "success")
    } else {
      toast("Erreur suppression", "error")
    }
  }

  return (
    <div className="bg-white border border-zinc-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-zinc-50 text-xs tracking-widest">
          <tr>
            <th className="text-left p-3">PRODUIT</th>
            <th className="p-3">PRIX</th>
            <th className="p-3">STOCK</th>
            <th className="p-3">ACTIF</th>
            <th className="p-3">FEATURED</th>
            <th className="p-3">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-b border-zinc-100 hover:bg-zinc-50">
              <td className="p-3">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-zinc-500">{p.slug} • {p.sku} • {p.category_slug}</div>
                <div className="flex gap-1 mt-1">
                  {p.is_new && <span className="text-[10px] bg-black text-white px-1">NEW</span>}
                  {p.is_bestseller && <span className="text-[10px] bg-amber-500 text-white px-1">BEST</span>}
                  {p.compare_at_price && <span className="text-[10px] bg-red-600 text-white px-1">SALE</span>}
                </div>
              </td>
              <td className="p-3 text-center text-xs">{formatMAD(p.price)}</td>
              <td className="p-3 text-center text-xs">{p.variants.reduce((a,b)=>a+b.stock,0)}</td>
              <td className="p-3 text-center">
                <button onClick={() => updateField(p.id, "is_active", !p.is_active)} className={`w-10 h-5 rounded-full p-0.5 transition-colors ${p.is_active ? "bg-black" : "bg-zinc-300"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${p.is_active ? "translate-x-5" : ""}`} />
                </button>
              </td>
              <td className="p-3 text-center">
                <button onClick={() => updateField(p.id, "is_featured", !p.is_featured)} className={`text-xs px-2 py-1 border ${p.is_featured ? "bg-black text-white border-black" : "bg-white border-zinc-200"}`}>★</button>
              </td>
              <td className="p-3">
                <div className="flex gap-1 flex-wrap justify-center">
                  <Link href={`/admin/products/${p.id}/edit`} className="text-xs border border-zinc-200 px-2 py-1 hover:bg-zinc-100">EDIT</Link>
                  <button onClick={() => duplicate(p.id)} className="text-xs border border-zinc-200 px-2 py-1 hover:bg-zinc-100">DUP</button>
                  <button onClick={() => remove(p.id)} className="text-xs border border-red-200 text-red-600 px-2 py-1 hover:bg-red-50">DEL</button>
                  <Link href={`/product/${p.slug}`} className="text-xs underline px-1">VOIR</Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && <div className="p-8 text-center text-sm text-zinc-500">Aucun produit</div>}
    </div>
  )
}
