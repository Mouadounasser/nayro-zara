"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

type Variant = { id?: string; size: string; color: string; color_hex?: string; image_url?: string | null; stock: number; sku?: string; is_active?: boolean }

const COLORS = [
  { name: "Noir", hex: "#0a0a0a" },
  { name: "Blanc", hex: "#ffffff" },
  { name: "Beige", hex: "#f5e6c8" },
  { name: "Camel", hex: "#c19a6b" },
  { name: "Marron", hex: "#5c4033" },
  { name: "Bleu", hex: "#1e3a8a" },
  { name: "Bleu Clair", hex: "#60a5fa" },
  { name: "Rouge", hex: "#dc2626" },
  { name: "Bordeaux", hex: "#7f1d1d" },
  { name: "Vert", hex: "#166534" },
  { name: "Olive", hex: "#84cc16" },
  { name: "Rose", hex: "#f472b6" },
  { name: "Violet", hex: "#7c3aed" },
  { name: "Orange", hex: "#ea580c" },
  { name: "Gris", hex: "#6b7280" },
  { name: "Jaune", hex: "#facc15" },
] as const

const AUDIENCES = [
  { value: "women", label: "Women", sub: "FEMME" },
  { value: "men", label: "Men", sub: "HOMME" },
] as const

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
  const [categories, setCategories] = useState<{slug:string,name:string}[]>([])

  useEffect(() => {
    fetch("/api/admin/categories").then(r=>r.json()).then(d=>{
      if(d.categories?.length) setCategories(d.categories.map((c:any)=>({slug:c.slug,name:c.name})))
    }).catch(()=>{})
    fetch(`/api/admin/products/${id}`).then(r=>r.json()).then(data => {
      if(data.error) { toast(data.error, "error"); setLoading(false); return }
      setForm(data)
      setVariants((data.product_variants || data.variants || []).map((v:any)=>({...v, is_active: v.is_active ?? true, color_hex: v.color_hex || "#0a0a0a"})))
      setImages(data.product_images || data.images || [])
      setLoading(false)
    }).catch(()=> setLoading(false))
  }, [id])

  const handleSave = async () => {
    if(!form.audience || !["men","women"].includes(form.audience)) { toast("Veuillez choisir Men ou Women", "error"); return }
    setSaving(true)
    try {
      const cleanVariants = variants.map((v:any)=> ({
        ...v,
        size: v.size?.trim() ? v.size.trim() : null,
        color: v.color?.trim() ? v.color.trim() : null,
        color_hex: v.color?.trim() ? v.color_hex : null,
        image_url: v.image_url || null,
      }))
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, variants: cleanVariants }),
      })
      if(!res.ok) throw new Error((await res.json()).error)
      toast("Produit mis à jour", "success")
      router.push("/admin/products")
    } catch(e:any) { toast(e.message, "error") }
    finally { setSaving(false)}
  }

  const updateImageColor = async (idx:number, color:string|null) => {
    const hex = color ? (COLORS.find(c=>c.name===color)?.hex || null) : null
    const copy=[...images]; copy[idx] = { ...copy[idx], color, color_hex: hex }; setImages(copy)
    // persist if image has id
    const img = copy[idx]
    if(img.id) {
      await fetch(`/api/admin/product-images/${img.id}`, { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ color, color_hex: hex }) }).catch(()=>{})
    }
  }
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("productId", id)
    // if admin has selected a color for next upload, tag it
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    const data = await res.json()
    if(res.ok) {
      setImages([...images, { url: data.url, alt: file.name, position: images.length, color: null, color_hex: null }])
      toast("Image uploadée — taguez sa couleur ci-dessous", "success")
    } else toast(data.error || "Erreur upload", "error")
    setUploading(false)
    e.target.value=""
  }

  const addVariant = () => setVariants([...variants, { size: "M", color: form.primary_color_name || "Noir", color_hex: form.primary_color || "#0a0a0a", image_url: null, stock: 5, is_active: true }])
  const handleVariantImage = async (idx:number, file:File) => {
    const v = variants[idx]
    const fd=new FormData(); fd.append("file", file); fd.append("productId", id); if(v.color) fd.append("color", v.color); if(v.color_hex) fd.append("color_hex", v.color_hex)
    const res=await fetch("/api/admin/upload",{method:"POST",body:fd}); const data=await res.json()
    if(res.ok){ const copy=[...variants]; (copy[idx] as any).image_url=data.url; setVariants(copy); setImages(prev=>[...prev,{url:data.url,alt:file.name,position:prev.length, color: v.color || null, color_hex: v.color_hex || null}]); toast("Image variante uploadée","success") } else toast(data.error||"Erreur","error")
  }
  const removeVariant = (idx: number) => setVariants(variants.filter((_,i)=>i!==idx))
  const updateVariant = (idx: number, field: string, value: any) => {
    const copy = [...variants]
    ;(copy[idx] as any)[field] = value
    if(field==="color") {
      const f = COLORS.find(c=>c.name===value)
      if(f) copy[idx].color_hex = f.hex
    }
    setVariants(copy)
  }

  if(loading) return <div className="p-8">Chargement...</div>
  if(!form) return <div className="p-8">Produit introuvable</div>

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-xl tracking-[0.2em]">EDITER: {form.name}</h1>
        <label className={`flex items-center gap-3 px-4 py-2 border cursor-pointer ${form.is_active ? "bg-black text-white border-black" : "bg-white border-zinc-300"}`}>
          <input type="checkbox" checked={!!form.is_active} onChange={e=> setForm({...form, is_active: e.target.checked})} />
          <span className="text-xs tracking-widest">{form.is_active ? "ACTIF" : "DÉSACTIVÉ"}</span>
        </label>
      </div>

      <div className="bg-white border border-zinc-200 p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs tracking-widest">NOM</label>
            <Input value={form.name} onChange={e=> setForm({...form, name: e.target.value})} className="mt-1 rounded-none" />
          </div>
          <div>
            <label className="text-xs tracking-widest">SLUG</label>
            <Input value={form.slug} onChange={e=> setForm({...form, slug: e.target.value})} className="mt-1 rounded-none font-mono text-xs" />
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
            <Input type="number" value={form.compare_at_price || ""} onChange={e=> setForm({...form, compare_at_price: e.target.value ? Number(e.target.value) : null})} className="mt-1 rounded-none" />
          </div>
          <div>
            <label className="text-xs tracking-widest">SKU</label>
            <Input value={form.sku} onChange={e=> setForm({...form, sku: e.target.value})} className="mt-1 rounded-none font-mono text-xs" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs tracking-widest">CATÉGORIE — par type</label>
            <select value={form.category_slug} onChange={e=> setForm({...form, category_slug: e.target.value})} className="mt-1 w-full h-11 border border-zinc-200 px-4 bg-white text-sm">
              {categories.map(c=> <option key={c.slug} value={c.slug}>{c.name.toUpperCase()}</option>)}
              <option value="sacs">SACS</option>
              <option value="accessories">ACCESSOIRES</option>
              <option value="women">Women</option>
              <option value="men">Men</option>
              <option value="shoes">Shoes</option>
              <option value="new">NOUVEAUTÉS</option>
            </select>
          </div>
          <div>
            <label className="text-xs tracking-widest">POUR QUI? — audience</label>
            <div className="mt-1 grid grid-cols-4 gap-2">
              {AUDIENCES.map(a=> (
                <button key={a.value} type="button" onClick={()=> setForm({...form, audience: a.value})} className={`h-11 border text-xs tracking-widest flex flex-col items-center justify-center ${form.audience===a.value ? "bg-black text-white border-black" : "bg-white border-zinc-200 hover:border-black"}`}>
                  <span>{a.label}</span>
                  <span className="text-[10px] opacity-60">{a.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs tracking-widest">COULEUR PRINCIPALE</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {COLORS.map(c=> (
              <button key={c.hex} type="button" onClick={()=> setForm({...form, primary_color: c.hex, primary_color_name: c.name})} className={`w-9 h-9 rounded-full border-2 ${form.primary_color===c.hex ? "border-black scale-110" : "border-white shadow"}`} style={{background:c.hex}} title={c.name} />
            ))}
            <label className="w-9 h-9 rounded-full border border-dashed flex items-center justify-center cursor-pointer">
              <input type="color" value={form.primary_color || "#0a0a0a"} onChange={e=> setForm({...form, primary_color: e.target.value})} className="sr-only" />
              <span className="text-xs">+</span>
            </label>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="w-6 h-6 rounded-full border" style={{background: form.primary_color || "#0a0a0a"}} />
            <Input value={form.primary_color_name || ""} onChange={e=> setForm({...form, primary_color_name: e.target.value})} className="rounded-none h-9 max-w-[160px]" placeholder="Noir" />
            <Input value={form.primary_color || ""} onChange={e=> setForm({...form, primary_color: e.target.value})} className="rounded-none h-9 max-w-[120px] font-mono text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t">
          {[
            {k:"is_active", label:"ACTIF", desc:"Visible"},
            {k:"is_featured", label:"FEATURED", desc:"Home"},
            {k:"is_new", label:"NEW", desc:"Badge new"},
            {k:"is_bestseller", label:"BEST", desc:"Badge best"},
          ].map(t=> (
            <label key={t.k} className={`flex items-center justify-between px-3 py-3 border cursor-pointer ${form[t.k] ? "bg-black text-white border-black" : "bg-white border-zinc-200"}`}>
              <div><div className="text-xs tracking-widest">{t.label}</div><div className="text-[10px] opacity-60">{t.desc}</div></div>
              <input type="checkbox" checked={!!form[t.k]} onChange={e=> setForm({...form, [t.k]: e.target.checked})} className="w-4 h-4" />
            </label>
          ))}
        </div>

        {/* Variants — pro with color + image per color */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs tracking-[0.2em]">VARIANTES / STOCK — image par couleur</h3>
            <button onClick={addVariant} className="text-xs bg-black text-white px-4 py-2">+ AJOUTER</button>
          </div>
          <div className="space-y-3">
            {variants.map((v, idx)=> (
              <div key={idx} className={`border p-3 space-y-3 ${v.is_active===false ? "bg-zinc-50 opacity-60" : "bg-white"}`}>
                <div className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-3">
                  <label className="text-[10px] tracking-widest">TAILLE <span className="opacity-50">(optionnel)</span></label>
                  <Input placeholder="— Sans taille" value={v.size || ""} onChange={e=> updateVariant(idx, "size", e.target.value)} className="rounded-none h-9 mt-1" />
                  <p className="text-[10px] text-zinc-500 mt-1">Vide si pas de taille</p>
                </div>
                <div className="col-span-4">
                  <label className="text-[10px] tracking-widest">COULEUR <span className="opacity-50">(optionnel)</span></label>
                  <div className="flex gap-2 mt-1">
                    <span className="w-9 h-9 rounded-full border shrink-0" style={{background: v.color_hex || "#fff"}} />
                    <Input placeholder="— Sans couleur" value={v.color || ""} onChange={e=> updateVariant(idx, "color", e.target.value)} className="rounded-none h-9 flex-1" />
                  </div>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {COLORS.slice(0,8).map(c=> <button key={c.hex} type="button" onClick={()=> updateVariant(idx, "color_hex", c.hex)} className={`w-6 h-6 rounded-full border ${v.color_hex===c.hex ? "border-black" : "border-white shadow"}`} style={{background:c.hex}} />)}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] tracking-widest">STOCK</label>
                    <Input type="number" value={v.stock} onChange={e=> updateVariant(idx, "stock", Number(e.target.value))} className="rounded-none h-9 mt-1" />
                  </div>
                  <div className="col-span-3 flex flex-col gap-2">
                    <label className={`flex items-center gap-2 text-xs px-2 py-1 border cursor-pointer ${v.is_active!==false ? "bg-green-50 border-green-200 text-green-700" : "bg-zinc-100"}`}>
                      <input type="checkbox" checked={v.is_active!==false} onChange={e=> updateVariant(idx, "is_active", e.target.checked)} />
                      {v.is_active!==false ? "ACTIVE" : "DÉSACTIVÉ"}
                    </label>
                    <button onClick={()=> removeVariant(idx)} className="text-xs text-red-600 border border-red-200 py-1.5">RETIRER</button>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 p-2">
                  <div className="w-16 h-16 bg-white border overflow-hidden shrink-0">
                    {v.image_url ? <img src={v.image_url} alt={v.color} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">Aucune</div>}
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] tracking-widest">IMAGE POUR { (v.color||"COULEUR").toUpperCase()} — s’affiche quand client choisit cette couleur</label>
                    <div className="flex gap-2 mt-1">
                      <label className="text-xs border bg-white px-3 py-1.5 cursor-pointer hover:bg-zinc-50">
                        <input type="file" accept="image/*" onChange={e=> e.target.files?.[0] && handleVariantImage(idx, e.target.files[0])} className="hidden" />
                        UPLOADER {v.color}
                      </label>
                      {images.length>0 && (
                        <select value={v.image_url || ""} onChange={e=> updateVariant(idx, "image_url", e.target.value || null)} className="text-xs border px-2 py-1 bg-white">
                          <option value="">— Choisir parmi images produit —</option>
                          {images.map((im:any,i:number)=> <option key={i} value={im.url}>Image {i+1}</option>)}
                        </select>
                      )}
                      {v.image_url && <button type="button" onClick={()=> updateVariant(idx, "image_url", null)} className="text-xs underline">Retirer</button>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Images — multi par couleur */}
        <div>
          <h3 className="text-xs tracking-[0.2em] mb-2">IMAGES — multi par couleur (ex: Brown = 3 images)</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {images.map((img, i)=> (
              <div key={img.id || i} className="group relative bg-zinc-100 border overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 bg-black text-white text-[10px] px-1">{i===0 ? "PRINCIPALE" : i+1}</span>
                  {img.color && <span className="absolute bottom-1 right-1 text-[10px] px-1.5 py-0.5 bg-white border flex items-center gap-1"><span className="w-2 h-2 rounded-full border" style={{background: img.color_hex || "#0a0a0a"}} />{img.color}</span>}
                  <button onClick={async()=>{
                    if(!confirm("Supprimer cette image ?")) return;
                    if(img.id) await fetch(`/api/admin/product-images/${img.id}`,{method:"DELETE"}).catch(()=>{});
                    setImages(images.filter((_,idx)=>idx!==i))
                  }} className="absolute top-1 right-1 bg-black text-white text-xs px-1.5 py-0.5 opacity-0 group-hover:opacity-100">✕</button>
                </div>
                <div className="p-2 bg-white">
                  <select value={img.color || ""} onChange={e=> updateImageColor(i, e.target.value || null)} className="w-full text-xs border border-zinc-200 px-1 py-1 bg-white">
                    <option value="">— Toutes couleurs</option>
                    {COLORS.map(c=> <option key={c.name} value={c.name}>{c.name}</option>)}
                    {variants.map(v=> v.color && !COLORS.find(c=>c.name===v.color) ? <option key={v.color} value={v.color}>{v.color}</option> : null)}
                  </select>
                </div>
              </div>
            ))}
          </div>
          <label className="block border border-dashed border-zinc-300 p-4 text-center cursor-pointer hover:bg-zinc-50">
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
            <span className="text-xs tracking-widest">{uploading ? "UPLOAD..." : "+ AJOUTER IMAGE (taguez couleur ensuite)"}</span>
          </label>
          <p className="text-[11px] text-zinc-500 mt-2">Tag `Brown` sur 3 images → galerie Brown affiche les 3 (switch fluide). Sans tag = visible pour toutes.</p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} disabled={saving} className="flex-1 rounded-none tracking-widest text-xs h-11">{saving ? "ENREGISTREMENT..." : "ENREGISTRER"}</Button>
          <Button variant="outline" onClick={()=> router.push("/admin/products")} className="rounded-none tracking-widest text-xs">ANNULER</Button>
        </div>
      </div>
    </div>
  )
}
