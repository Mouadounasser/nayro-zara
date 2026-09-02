"use client"
import { useState } from "react"
import Link from "next/link"
import { formatMAD } from "@/lib/utils"
import { useToast } from "@/components/ui/toast"
import type { Product } from "@/lib/types"

const audienceLabel: Record<string,string> = { women:"FEMME", men:"HOMME", unisex:"UNISEX", kids:"ENFANT" }

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
      setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } as any : p))
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
    } else toast("Erreur duplication", "error")
  }

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== id))
      toast("Supprimé", "success")
    } else toast("Erreur suppression", "error")
  }

  return (
    <div className="bg-white border border-zinc-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-zinc-50 text-xs tracking-widest">
          <tr>
            <th className="text-left p-3">PRODUIT</th>
            <th className="p-3">AUDIENCE</th>
            <th className="p-3">COULEUR</th>
            <th className="p-3">PRIX</th>
            <th className="p-3">STOCK</th>
            <th className="p-3">ACTIF</th>
            <th className="p-3">NEW</th>
            <th className="p-3">BEST</th>
            <th className="p-3">FEATURED</th>
            <th className="p-3">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className={`border-b border-zinc-100 hover:bg-zinc-50 ${!p.is_active ? "opacity-60 bg-zinc-50" : ""}`}>
              <td className="p-3">
                <div className="font-medium flex items-center gap-2">
                  {p.images?.[0] && <img src={p.images[0].url} alt="" className="w-8 h-10 object-cover border" />}
                  <span>{p.name}</span>
                </div>
                <div className="text-xs text-zinc-500 mt-1">{p.slug} • {p.sku} • {p.category_slug}</div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {p.is_new && <span className="text-[10px] bg-black text-white px-1">NEW</span>}
                  {p.is_bestseller && <span className="text-[10px] bg-amber-500 text-white px-1">BEST</span>}
                  {p.is_featured && <span className="text-[10px] bg-zinc-800 text-white px-1">FEAT</span>}
                  {p.compare_at_price && <span className="text-[10px] bg-red-600 text-white px-1">SALE</span>}
                  {!p.is_active && <span className="text-[10px] bg-zinc-300 text-black px-1">DÉSACTIVÉ</span>}
                </div>
              </td>
              <td className="p-3 text-center">
                <button
                  onClick={() => {
                    const order = ["women","men","unisex","kids"]
                    const next = order[(order.indexOf((p as any).audience || "unisex")+1)%order.length]
                    updateField(p.id, "audience", next)
                  }}
                  className="text-xs px-2 py-1 border border-zinc-200 hover:border-black bg-white"
                  title="Cliquer pour changer"
                >
                  {audienceLabel[(p as any).audience || "unisex"] || "UNISEX"}
                </button>
              </td>
              <td className="p-3 text-center">
                <div className="flex flex-col items-center gap-1">
                  {(p as any).primary_color && <span className="w-6 h-6 rounded-full border border-zinc-200 shadow-sm" style={{background: (p as any).primary_color}} title={(p as any).primary_color_name} />}
                  <span className="text-[11px] text-zinc-600">{(p as any).primary_color_name || (p.variants?.[0]?.color) || "-"}</span>
                </div>
              </td>
              <td className="p-3 text-center text-xs">{formatMAD(p.price)}</td>
              <td className="p-3 text-center text-xs">
                <span className={p.variants.reduce((a,b)=>a+(b.stock||0),0)===0 ? "text-red-600" : ""}>{p.variants.reduce((a,b)=>a+(b.stock||0),0)}</span>
                <div className="text-[10px] text-zinc-400">{p.variants.length} var.</div>
              </td>
              <td className="p-3 text-center">
                <button onClick={() => updateField(p.id, "is_active", !p.is_active)} className={`w-10 h-5 rounded-full p-0.5 transition-colors ${p.is_active ? "bg-black" : "bg-zinc-300"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${p.is_active ? "translate-x-5" : ""}`} />
                </button>
              </td>
              <td className="p-3 text-center">
                <button onClick={() => updateField(p.id, "is_new", !(p as any).is_new)} className={`text-xs px-2 py-1 border ${ (p as any).is_new ? "bg-black text-white border-black" : "bg-white border-zinc-200"}`}>NEW</button>
              </td>
              <td className="p-3 text-center">
                <button onClick={() => updateField(p.id, "is_bestseller", !(p as any).is_bestseller)} className={`text-xs px-2 py-1 border ${ (p as any).is_bestseller ? "bg-amber-500 text-white border-amber-500" : "bg-white border-zinc-200"}`}>BEST</button>
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
      <div className="p-3 bg-zinc-50 border-t text-xs text-zinc-500 text-center">Cliquez sur ACTIF / NEW / BEST / FEATURED / AUDIENCE pour activer/désactiver instantanément. Couleur = couleur principale (filtre boutique).</div>
    </div>
  )
}
