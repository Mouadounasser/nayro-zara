"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

type Variant = { id?: string; size: string; color: string; stock: number; sku?: string }

export default function EditProductPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>(null)
  const [variants, setVariants] = useState<Variant[]>([])
  const [images, setImages] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/products/${id}`).then(r=>r.json()).then(data => {
      if(data.error) { toast(data.error, "error"); return }
      setForm(data)
      setVariants(data.product_variants || data.variants || [])
      setImages(data.product_images || data.images || [])
      setLoading(false)
    }).catch(()=> setLoading(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, variants }),
      })
      if(!res.ok) throw new Error((await res.json()).error)
      toast("Produit mis à jour", "success")
      router.push("/admin/products")
    } catch(e:any) {
      toast(e.message, "error")
    } finally { setSaving(false)}
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("productId", id)
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    const data = await res.json()
    if(res.ok) {
      setImages([...images, { url: data.url, alt: file.name, position: images.length }])
      toast("Image uploadée", "success")
    } else {
      toast(data.error || "Erreur upload", "error")
    }
    setUploading(false)
  }

  const addVariant = () => setVariants([...variants, { size: "M", color: "Black", stock: 5 }])
  const removeVariant = (idx: number) => setVariants(variants.filter((_,i)=>i!==idx))
  const updateVariant = (idx: number, field: string, value: any) => {
    const copy = [...variants]
    ;(copy[idx] as any)[field] = value
    setVariants(copy)
  }

  if(loading) return <div className="p-8">Chargement...</div>
  if(!form) return <div className="p-8">Produit introuvable</div>

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl tracking-[0.2em] mb-6">EDITER: {form.name}</h1>
      <div className="bg-white border border-zinc-200 p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs tracking-widest">NOM</label>
            <Input value={form.name} onChange={e=> setForm({...form, name: e.target.value})} className="mt-1 rounded-none" />
          </div>
          <div>
            <label className="text-xs tracking-widest">SLUG</label>
            <Input value={form.slug} onChange={e=> setForm({...form, slug: e.target.value})} className="mt-1 rounded-none font-mono" />
          </div>
        </div>

        <div>
          <label className="text-xs tracking-widest">DESCRIPTION</label>
          <textarea value={form.description || ""} onChange={e=> setForm({...form, description: e.target.value})} rows={3} className="mt-1 w-full border border-zinc-200 p-3 text-sm" />
        </div>
        <div>
          <label className="text-xs tracking-widest">SHORT DESCRIPTION</label>
          <Input value={form.short_description || ""} onChange={e=> setForm({...form, short_description: e.target.value})} className="mt-1 rounded-none" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs tracking-widest">PRIX</label>
            <Input type="number" value={form.price} onChange={e=> setForm({...form, price: Number(e.target.value)})} className="mt-1 rounded-none" />
          </div>
          <div>
            <label className="text-xs tracking-widest">PRIX COMPARÉ</label>
            <Input type="number" value={form.compare_at_price || ""} onChange={e=> setForm({...form, compare_at_price: e.target.value ? Number(e.target.value) : null})} className="mt-1 rounded-none" placeholder="Sale price" />
          </div>
          <div>
            <label className="text-xs tracking-widest">SKU</label>
            <Input value={form.sku} onChange={e=> setForm({...form, sku: e.target.value})} className="mt-1 rounded-none font-mono" />
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
          <label className="flex items-center gap-2 text-xs tracking-widest"><input type="checkbox" checked={!!form.is_active} onChange={e=> setForm({...form, is_active: e.target.checked})} /> ACTIF</label>
          <label className="flex items-center gap-2 text-xs tracking-widest"><input type="checkbox" checked={!!form.is_featured} onChange={e=> setForm({...form, is_featured: e.target.checked})} /> FEATURED</label>
          <label className="flex items-center gap-2 text-xs tracking-widest"><input type="checkbox" checked={!!form.is_new} onChange={e=> setForm({...form, is_new: e.target.checked})} /> NEW</label>
          <label className="flex items-center gap-2 text-xs tracking-widest"><input type="checkbox" checked={!!form.is_bestseller} onChange={e=> setForm({...form, is_bestseller: e.target.checked})} /> BESTSELLER</label>
        </div>

        {/* Variants */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs tracking-[0.2em]">VARIANTES / STOCK</h3>
            <button onClick={addVariant} className="text-xs border border-black px-3 py-1">AJOUTER TAILLE</button>
          </div>
          <div className="space-y-2">
            {variants.map((v, idx)=> (
              <div key={idx} className="grid grid-cols-4 gap-2 items-center border border-zinc-100 p-2">
                <Input placeholder="Taille" value={v.size} onChange={e=> updateVariant(idx, "size", e.target.value)} className="rounded-none h-9" />
                <Input placeholder="Couleur" value={v.color} onChange={e=> updateVariant(idx, "color", e.target.value)} className="rounded-none h-9" />
                <Input type="number" placeholder="Stock" value={v.stock} onChange={e=> updateVariant(idx, "stock", Number(e.target.value))} className="rounded-none h-9" />
                <button onClick={()=> removeVariant(idx)} className="text-xs text-red-600 border border-red-200 py-2">RETIRER</button>
              </div>
            ))}
            {variants.length===0 && <p className="text-xs text-zinc-500 border border-dashed p-4 text-center">Aucune variante — ajoutez des tailles</p>}
          </div>
        </div>

        {/* Images */}
        <div>
          <h3 className="text-xs tracking-[0.2em] mb-2">IMAGES</h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {images.map((img, i)=> (
              <div key={i} className="relative aspect-[3/4] bg-zinc-100 overflow-hidden border">
                <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
                <span className="absolute top-1 left-1 bg-black text-white text-[10px] px-1">{i===0 ? "PRINCIPALE" : i+1}</span>
              </div>
            ))}
          </div>
          <label className="block border border-dashed border-zinc-300 p-4 text-center cursor-pointer hover:bg-zinc-50">
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
            <span className="text-xs tracking-widest">{uploading ? "UPLOAD..." : "CLIQUER POUR UPLOADER IMAGE (Supabase Storage → products)"}</span>
          </label>
          <p className="text-xs text-zinc-500 mt-1">Max 5MB, JPG/PNG. L’upload crée l’image dans Supabase Storage et l’associe au produit.</p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} disabled={saving} className="flex-1 rounded-none tracking-widest text-xs h-11">{saving ? "ENREGISTREMENT..." : "ENREGISTRER"}</Button>
          <Button variant="outline" onClick={()=> router.push("/admin/products")} className="rounded-none tracking-widest text-xs">ANNULER</Button>
        </div>
      </div>
    </div>
  )
}
