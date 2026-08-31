"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast"

type Variant = { size: string; color: string; stock: number }

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    compare_at_price: "",
    sku: "",
    category_slug: "women",
    description: "",
    short_description: "",
    is_active: true,
    is_featured: false,
    is_new: true,
    is_bestseller: false,
  })
  const [variants, setVariants] = useState<Variant[]>([
    { size: "S", color: "Black", stock: 10 },
    { size: "M", color: "Black", stock: 10 },
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
        variants,
      }
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erreur")
      }
      const data = await res.json()
      toast(`Produit créé: ${data.slug}`, "success")
      router.push(`/admin/products/${data.id}/edit`)
    } catch (err: any) {
      toast(err.message, "error")
    } finally {
      setLoading(false)
    }
  }

  const addVariant = () => setVariants([...variants, { size: "L", color: "Black", stock: 5 }])
  const updateVariant = (idx: number, field: keyof Variant, value: any) => {
    const copy = [...variants]
    ;(copy[idx] as any)[field] = value
    setVariants(copy)
  }
  const removeVariant = (idx: number) => setVariants(variants.filter((_, i) => i !== idx))

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl tracking-[0.2em] mb-2">NOUVEAU PRODUIT</h1>
      <p className="text-xs text-zinc-500 mb-6">Création avancée — tous les champs NAYRO + variantes + upload image après création</p>
      <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs tracking-widest">NOM *</label>
            <Input required value={form.name} onChange={e=> setForm({...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")})} className="mt-1 rounded-none" placeholder="Robe Chemise Linen" />
          </div>
          <div>
            <label className="text-xs tracking-widest">SLUG *</label>
            <Input required value={form.slug} onChange={e=> setForm({...form, slug: e.target.value})} className="mt-1 rounded-none font-mono" placeholder="robe-chemise-linen" />
          </div>
        </div>

        <div>
          <label className="text-xs tracking-widest">DESCRIPTION</label>
          <textarea value={form.description} onChange={e=> setForm({...form, description: e.target.value})} rows={3} className="mt-1 w-full border border-zinc-200 p-3 text-sm" placeholder="Description détaillée..." />
        </div>
        <div>
          <label className="text-xs tracking-widest">SHORT DESCRIPTION</label>
          <Input value={form.short_description} onChange={e=> setForm({...form, short_description: e.target.value})} className="mt-1 rounded-none" placeholder="Robe chemise lin • Ceinture incluse" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs tracking-widest">PRIX (MAD) *</label>
            <Input required type="number" value={form.price} onChange={e=> setForm({...form, price: e.target.value})} className="mt-1 rounded-none" />
          </div>
          <div>
            <label className="text-xs tracking-widest">PRIX COMPARÉ (SALE)</label>
            <Input type="number" value={form.compare_at_price} onChange={e=> setForm({...form, compare_at_price: e.target.value})} className="mt-1 rounded-none" placeholder="1199" />
          </div>
          <div>
            <label className="text-xs tracking-widest">SKU *</label>
            <Input required value={form.sku} onChange={e=> setForm({...form, sku: e.target.value})} className="mt-1 rounded-none font-mono" placeholder="NAY-W-013" />
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center gap-2 text-xs tracking-widest"><input type="checkbox" checked={form.is_active} onChange={e=> setForm({...form, is_active: e.target.checked})} /> ACTIF</label>
          <label className="flex items-center gap-2 text-xs tracking-widest"><input type="checkbox" checked={form.is_featured} onChange={e=> setForm({...form, is_featured: e.target.checked})} /> FEATURED</label>
          <label className="flex items-center gap-2 text-xs tracking-widest"><input type="checkbox" checked={form.is_new} onChange={e=> setForm({...form, is_new: e.target.checked})} /> NEW</label>
          <label className="flex items-center gap-2 text-xs tracking-widest"><input type="checkbox" checked={form.is_bestseller} onChange={e=> setForm({...form, is_bestseller: e.target.checked})} /> BESTSELLER</label>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs tracking-[0.2em]">VARIANTES / STOCK</h3>
            <button type="button" onClick={addVariant} className="text-xs border border-black px-3 py-1">AJOUTER</button>
          </div>
          <div className="space-y-2">
            {variants.map((v, idx)=> (
              <div key={idx} className="grid grid-cols-4 gap-2 items-center border border-zinc-100 p-2">
                <Input placeholder="Taille" value={v.size} onChange={e=> updateVariant(idx, "size", e.target.value)} className="rounded-none h-9" />
                <Input placeholder="Couleur" value={v.color} onChange={e=> updateVariant(idx, "color", e.target.value)} className="rounded-none h-9" />
                <Input type="number" placeholder="Stock" value={v.stock} onChange={e=> updateVariant(idx, "stock", Number(e.target.value))} className="rounded-none h-9" />
                <button type="button" onClick={()=> removeVariant(idx)} className="text-xs text-red-600 border border-red-200 py-2">RETIRER</button>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-2">Les variantes déterminent les tailles proposées dans boutique et stock décrémenté à la commande.</p>
        </div>

        <Button type="submit" disabled={loading} className="w-full rounded-none tracking-widest text-xs h-11">
          {loading ? "CRÉATION..." : "CRÉER LE PRODUIT → ÉDITER IMAGES"}
        </Button>
        <p className="text-xs text-zinc-500 text-center">Après création, vous serez redirigé vers l’édition pour uploader les images (Storage bucket `products`).</p>
      </form>
    </div>
  )
}
