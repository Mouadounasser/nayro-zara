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
  const [uploading, setUploading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    compare_at_price: "",
    sku: "",
    category_slug: "sacs",
    description: "",
    short_description: "",
    is_active: true,
    is_featured: false,
    is_new: true,
    is_bestseller: false,
  })
  const [variants, setVariants] = useState<Variant[]>([
    { size: "One Size", color: "Noir", stock: 10 },
  ])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast("Image trop grande (max 5MB)", "error")
      return
    }
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (res.ok) {
        setImageUrls([...imageUrls, data.url])
        toast("Image uploadée", "success")
      } else {
        toast(data.error || "Erreur upload", "error")
      }
    } catch {
      toast("Erreur upload", "error")
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
        variants,
        image_urls: imageUrls,
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

  const addVariant = () => setVariants([...variants, { size: "One Size", color: "Noir", stock: 5 }])
  const updateVariant = (idx: number, field: keyof Variant, value: any) => {
    const copy = [...variants]
    ;(copy[idx] as any)[field] = value
    setVariants(copy)
  }
  const removeVariant = (idx: number) => setVariants(variants.filter((_, i) => i !== idx))

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl tracking-[0.2em] mb-2">NOUVEAU PRODUIT</h1>
      <p className="text-xs text-zinc-500 mb-6">Ajoutez un produit réel NAYRO — sacs, accessoires. Images uploadées vers Supabase Storage.</p>
      <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs tracking-widest">NOM *</label>
            <Input required value={form.name} onChange={e=> setForm({...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")})} className="mt-1 rounded-none" placeholder="Sac à dos AOLA KIDS" />
          </div>
          <div>
            <label className="text-xs tracking-widest">SLUG *</label>
            <Input required value={form.slug} onChange={e=> setForm({...form, slug: e.target.value})} className="mt-1 rounded-none font-mono" placeholder="sac-a-dos-aola-kids" />
          </div>
        </div>

        <div>
          <label className="text-xs tracking-widest">DESCRIPTION</label>
          <textarea value={form.description} onChange={e=> setForm({...form, description: e.target.value})} rows={3} className="mt-1 w-full border border-zinc-200 p-3 text-sm" placeholder="Description détaillée du sac..." />
        </div>
        <div>
          <label className="text-xs tracking-widest">SHORT DESCRIPTION</label>
          <Input value={form.short_description} onChange={e=> setForm({...form, short_description: e.target.value})} className="mt-1 rounded-none" placeholder="AOLA KIDS • 220 DH" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs tracking-widest">PRIX (MAD) *</label>
            <Input required type="number" value={form.price} onChange={e=> setForm({...form, price: e.target.value})} className="mt-1 rounded-none" />
          </div>
          <div>
            <label className="text-xs tracking-widest">PRIX COMPARÉ (SALE)</label>
            <Input type="number" value={form.compare_at_price} onChange={e=> setForm({...form, compare_at_price: e.target.value})} className="mt-1 rounded-none" placeholder="249" />
          </div>
          <div>
            <label className="text-xs tracking-widest">SKU *</label>
            <Input required value={form.sku} onChange={e=> setForm({...form, sku: e.target.value})} className="mt-1 rounded-none font-mono" placeholder="NAY-SAC-001" />
          </div>
        </div>

        <div>
          <label className="text-xs tracking-widest">CATÉGORIE</label>
          <select value={form.category_slug} onChange={e=> setForm({...form, category_slug: e.target.value})} className="mt-1 w-full h-11 border border-zinc-200 px-4">
            <option value="sacs">SACS</option>
            <option value="accessories">ACCESSOIRES</option>
            <option value="new">NOUVEAUTÉS</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center gap-2 text-xs tracking-widest"><input type="checkbox" checked={form.is_active} onChange={e=> setForm({...form, is_active: e.target.checked})} /> ACTIF</label>
          <label className="flex items-center gap-2 text-xs tracking-widest"><input type="checkbox" checked={form.is_featured} onChange={e=> setForm({...form, is_featured: e.target.checked})} /> FEATURED</label>
          <label className="flex items-center gap-2 text-xs tracking-widest"><input type="checkbox" checked={form.is_new} onChange={e=> setForm({...form, is_new: e.target.checked})} /> NEW</label>
          <label className="flex items-center gap-2 text-xs tracking-widest"><input type="checkbox" checked={form.is_bestseller} onChange={e=> setForm({...form, is_bestseller: e.target.checked})} /> BESTSELLER</label>
        </div>

        {/* Image Upload - FIXED */}
        <div>
          <h3 className="text-xs tracking-[0.2em] mb-2">IMAGES (upload direct)</h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {imageUrls.map((url, i)=> (
              <div key={i} className="relative aspect-[3/4] bg-zinc-100 border overflow-hidden group">
                <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                <button type="button" onClick={()=> setImageUrls(imageUrls.filter((_, idx)=> idx!==i))} className="absolute top-1 right-1 bg-black text-white text-xs px-1 opacity-0 group-hover:opacity-100">X</button>
                {i===0 && <span className="absolute bottom-1 left-1 bg-black text-white text-[10px] px-1">PRINCIPALE</span>}
              </div>
            ))}
          </div>
          <label className="block border border-dashed border-zinc-300 p-4 text-center cursor-pointer hover:bg-zinc-50">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
            <span className="text-xs tracking-widest">{uploading ? "UPLOAD EN COURS..." : "CLIQUEZ POUR UPLOADER UNE IMAGE (JPG/PNG, max 5MB)"}</span>
          </label>
          <p className="text-xs text-zinc-500 mt-2">Upload direct vers Supabase Storage (bucket `products`). Si aucune image, une image placeholder sera créée automatiquement. Vous pourrez aussi ajouter plus d’images après création via l’édition.</p>
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
        </div>

        <Button type="submit" disabled={loading || uploading} className="w-full rounded-none tracking-widest text-xs h-11">
          {loading ? "CRÉATION..." : "CRÉER LE PRODUIT"}
        </Button>
      </form>
    </div>
  )
}
