"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast"

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", slug: "", price: "", sku: "", category_slug: "women", description: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erreur")
      }
      toast("Produit créé", "success")
      router.push("/admin/products")
    } catch (err: any) {
      toast(err.message, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl tracking-[0.2em] mb-6">NOUVEAU PRODUIT</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 p-6 space-y-4">
        <div>
          <label className="text-xs tracking-widest">NOM</label>
          <Input required value={form.name} onChange={e=> setForm({...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-")})} className="mt-1 rounded-none" />
        </div>
        <div>
          <label className="text-xs tracking-widest">SLUG</label>
          <Input required value={form.slug} onChange={e=> setForm({...form, slug: e.target.value})} className="mt-1 rounded-none font-mono" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs tracking-widest">PRIX (MAD)</label>
            <Input required type="number" value={form.price} onChange={e=> setForm({...form, price: e.target.value})} className="mt-1 rounded-none" />
          </div>
          <div>
            <label className="text-xs tracking-widest">SKU</label>
            <Input required value={form.sku} onChange={e=> setForm({...form, sku: e.target.value})} className="mt-1 rounded-none font-mono" />
          </div>
        </div>
        <div>
          <label className="text-xs tracking-widest">CATÉGORIE</label>
          <select value={form.category_slug} onChange={e=> setForm({...form, category_slug: e.target.value})} className="mt-1 w-full h-11 border border-zinc-200 px-4">
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="shoes">Shoes</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
        <div>
          <label className="text-xs tracking-widest">DESCRIPTION</label>
          <textarea value={form.description} onChange={e=> setForm({...form, description: e.target.value})} rows={4} className="mt-1 w-full border border-zinc-200 p-3 text-sm" />
        </div>
        <Button type="submit" disabled={loading} className="w-full rounded-none tracking-widest text-xs h-11">
          {loading ? "CRÉATION..." : "CRÉER LE PRODUIT"}
        </Button>
        <p className="text-xs text-zinc-500">Nécessite Supabase configuré. Sinon, le produit sera stocké localement (démo).</p>
      </form>
    </div>
  )
}
