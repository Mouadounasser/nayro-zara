"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast"

type Variant = { size: string; color: string; color_hex: string; image_url: string | null; stock: number; is_active: boolean }

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

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [categories, setCategories] = useState<{slug:string,name:string}[]>([{slug:"sacs",name:"SACS"},{slug:"accessories",name:"ACCESSOIRES"}])

  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    compare_at_price: "",
    sku: "",
    category_slug: "sacs",
    audience: "" as string,
    primary_color: "#0a0a0a",
    primary_color_name: "Noir",
    description: "",
    short_description: "",
    is_active: true,
    is_featured: false,
    is_new: true,
    is_bestseller: false,
  })
  const [variants, setVariants] = useState<Variant[]>([
    { size: "One Size", color: "Noir", color_hex: "#0a0a0a", image_url: null, stock: 10, is_active: true },
  ])

  useEffect(() => {
    fetch("/api/admin/categories").then(r=>r.json()).then(d=>{
      if(d.categories?.length) setCategories(d.categories.map((c:any)=>({slug:c.slug,name:c.name})))
    }).catch(()=>{})
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast("Image trop grande (max 5MB)", "error"); return }
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (res.ok) { setImageUrls([...imageUrls, data.url]); toast("Image uploadée", "success") }
      else toast(data.error || "Erreur upload", "error")
    } catch { toast("Erreur upload", "error") }
    setUploading(false)
    e.target.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!form.name || !form.sku || !form.price) { toast("Nom, SKU et prix requis", "error"); return }
    if(!form.audience) { toast("Veuillez choisir: Men ou Women (obligatoire)", "error"); return }
    setLoading(true)
    try {
      // Convert empty size/color to null for optional variants
      const cleanVariants = variants.map(v=> ({
        ...v,
        size: v.size?.trim() ? v.size.trim() : null,
        color: v.color?.trim() ? v.color.trim() : null,
        color_hex: v.color?.trim() ? v.color_hex : null,
        image_url: v.image_url || null,
      }))
      const payload = {
        ...form,
        audience: form.audience as "women" | "men",
        price: Number(form.price),
        compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
        variants: cleanVariants,
        image_urls: imageUrls,
      }
      const res = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error((await res.json()).error || "Erreur")
      const data = await res.json()
      toast(`Produit créé: ${data.slug}`, "success")
      router.push(`/admin/products/${data.id}/edit`)
    } catch (err: any) { toast(err.message, "error") }
    finally { setLoading(false) }
  }

  const addVariant = () => setVariants([...variants, { size: "M", color: form.primary_color_name, color_hex: form.primary_color, image_url: null, stock: 5, is_active: true }])
  const handleVariantImage = async (idx:number, file: File) => {
    if(file.size > 5*1024*1024) { toast("Image trop grande (max 5MB)", "error"); return }
    const fd = new FormData(); fd.append("file", file)
    const res = await fetch("/api/admin/upload", {method:"POST", body: fd})
    const data = await res.json()
    if(res.ok){ updateVariant(idx, "image_url", data.url); if(!imageUrls.includes(data.url)) setImageUrls(prev=>[...prev, data.url]); toast("Image variante uploadée", "success") }
    else toast(data.error || "Erreur", "error")
  }
  const updateVariant = (idx: number, field: keyof Variant, value: any) => {
    const copy = [...variants]; (copy[idx] as any)[field] = value
    // if color name changed, sync hex if picking from palette
    if(field === "color") {
      const found = COLORS.find(c=>c.name===value)
      if(found) copy[idx].color_hex = found.hex
    }
    setVariants(copy)
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl tracking-[0.2em]">NOUVEAU PRODUIT</h1>
          <p className="text-xs text-zinc-500 mt-1">Pro — choisissez audience (Homme/Femme), couleur, catégorie et activez/désactivez ce que vous voulez.</p>
        </div>
        <label className={`flex items-center gap-3 px-4 py-2 border cursor-pointer transition-colors ${form.is_active ? "bg-black text-white border-black" : "bg-white border-zinc-300 text-zinc-600"}`}>
          <input type="checkbox" checked={form.is_active} onChange={e=> setForm({...form, is_active: e.target.checked})} className="accent-black" />
          <span className="text-xs tracking-widest">{form.is_active ? "ACTIF — visible boutique" : "DÉSACTIVÉ — masqué"}</span>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main */}
        <div className="bg-white border border-zinc-200 p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs tracking-widest">NOM *</label>
              <Input required value={form.name} onChange={e=> setForm({...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")})} className="mt-1 rounded-none" placeholder="Sac à dos NAYRO" />
            </div>
            <div>
              <label className="text-xs tracking-widest">SLUG *</label>
              <Input required value={form.slug} onChange={e=> setForm({...form, slug: e.target.value})} className="mt-1 rounded-none font-mono text-xs" placeholder="sac-a-dos-nayro" />
            </div>
          </div>

          <div>
            <label className="text-xs tracking-widest">DESCRIPTION</label>
            <textarea value={form.description} onChange={e=> setForm({...form, description: e.target.value})} rows={3} className="mt-1 w-full border border-zinc-200 p-3 text-sm focus:border-black outline-none" placeholder="Description détaillée..." />
          </div>
          <div>
            <label className="text-xs tracking-widest">SHORT DESCRIPTION</label>
            <Input value={form.short_description} onChange={e=> setForm({...form, short_description: e.target.value})} className="mt-1 rounded-none" placeholder="Cabas • Noir • Cabas" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs tracking-widest">PRIX (MAD) *</label>
              <Input required type="number" value={form.price} onChange={e=> setForm({...form, price: e.target.value})} className="mt-1 rounded-none" placeholder="199" />
            </div>
            <div>
              <label className="text-xs tracking-widest">PRIX COMPARÉ (SALE)</label>
              <Input type="number" value={form.compare_at_price} onChange={e=> setForm({...form, compare_at_price: e.target.value})} className="mt-1 rounded-none" placeholder="249" />
            </div>
            <div>
              <label className="text-xs tracking-widest">SKU *</label>
              <Input required value={form.sku} onChange={e=> setForm({...form, sku: e.target.value})} className="mt-1 rounded-none font-mono text-xs" placeholder="NAY-SAC-001" />
            </div>
          </div>

          {/* Category + Audience */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs tracking-widest">CATÉGORIE * — par type</label>
              <select value={form.category_slug} onChange={e=> setForm({...form, category_slug: e.target.value})} className="mt-1 w-full h-11 border border-zinc-200 px-4 bg-white text-sm focus:border-black outline-none">
                {categories.map(c=> <option key={c.slug} value={c.slug}>{c.name.toUpperCase()}</option>)}
                <option value="sacs">SACS</option>
                <option value="accessories">ACCESSOIRES</option>
                <option value="new">NOUVEAUTÉS</option>
              </select>
              <p className="text-[11px] text-zinc-500 mt-1">Catégorie = famille produit (sacs, accessoires...)</p>
            </div>
            <div>
              <label className="text-xs tracking-widest">POUR QUI? * — requis: Men ou Women</label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {AUDIENCES.map(a=> (
                  <button key={a.value} type="button" onClick={()=> setForm({...form, audience: a.value})} className={`h-11 border text-xs tracking-widest flex flex-col items-center justify-center leading-none ${form.audience===a.value ? "bg-black text-white border-black" : "bg-white border-zinc-200 hover:border-black"}`}>
                    <span>{a.label}</span>
                    <span className="text-[10px] opacity-60">{a.sub}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Obligatoire: Men section = seulement Men, Women = seulement Women. Jamais mélangé.</p>
            </div>
          </div>

          {/* Primary Color */}
          <div>
            <label className="text-xs tracking-widest">COULEUR PRINCIPALE — select + preview</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {COLORS.map(c=> (
                <button key={c.hex} type="button" onClick={()=> setForm({...form, primary_color: c.hex, primary_color_name: c.name})} className={`w-9 h-9 rounded-full border-2 flex items-center justify-center ${form.primary_color===c.hex ? "border-black scale-110" : "border-white shadow"}`} style={{background: c.hex}} title={c.name}>
                  {form.primary_color===c.hex && <span className="w-2 h-2 bg-white rounded-full border border-black/20" />}
                </button>
              ))}
              <label className="w-9 h-9 rounded-full border border-dashed border-zinc-300 flex items-center justify-center cursor-pointer hover:bg-zinc-50" title="Custom">
                <input type="color" value={form.primary_color} onChange={e=> {
                  const hex = e.target.value
                  const found = COLORS.find(x=>x.hex===hex)
                  setForm({...form, primary_color: hex, primary_color_name: found?.name || hex})
                }} className="sr-only" />
                <span className="text-xs">+</span>
              </label>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full border border-zinc-200" style={{background: form.primary_color}} />
              <Input value={form.primary_color_name} onChange={e=> setForm({...form, primary_color_name: e.target.value})} className="rounded-none h-9 max-w-[160px]" placeholder="Noir" />
              <Input value={form.primary_color} onChange={e=> setForm({...form, primary_color: e.target.value})} className="rounded-none h-9 max-w-[120px] font-mono text-xs" placeholder="#0a0a0a" />
              <span className="text-xs text-zinc-500">Couleur affichée en boutique + filtre</span>
            </div>
          </div>

          {/* Toggles — désactiver/activer anything */}
          <div className="border-t border-zinc-100 pt-5">
            <p className="text-xs tracking-[0.2em] mb-3">VISIBILITÉ & MISE EN AVANT — activez/désactivez à volonté</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {k:"is_active", label:"ACTIF", desc:"Visible boutique"},
                {k:"is_featured", label:"FEATURED", desc:"Home featured"},
                {k:"is_new", label:"NEW", desc:"Badge nouveauté"},
                {k:"is_bestseller", label:"BESTSELLER", desc:"Badge best"},
              ].map(t=> (
                <label key={t.k} className={`flex items-center justify-between px-3 py-3 border cursor-pointer transition-colors ${ (form as any)[t.k] ? "bg-black text-white border-black" : "bg-white border-zinc-200"}`}>
                  <div>
                    <div className="text-xs tracking-widest">{t.label}</div>
                    <div className="text-[10px] opacity-60">{t.desc}</div>
                  </div>
                  <input type="checkbox" checked={(form as any)[t.k]} onChange={e=> setForm({...form, [t.k]: e.target.checked})} className="accent-black w-4 h-4" />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white border border-zinc-200 p-6">
          <h3 className="text-xs tracking-[0.2em] mb-3">IMAGES — upload direct (Supabase Storage `products`)</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {imageUrls.map((url, i)=> (
              <div key={i} className="relative aspect-[3/4] bg-zinc-100 border overflow-hidden group">
                <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                <button type="button" onClick={()=> setImageUrls(imageUrls.filter((_, idx)=> idx!==i))} className="absolute top-1 right-1 bg-black text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                {i===0 && <span className="absolute bottom-1 left-1 bg-black text-white text-[10px] px-2 py-0.5">PRINCIPALE</span>}
                <span className="absolute top-1 left-1 bg-white/90 text-[10px] px-1">{i+1}</span>
              </div>
            ))}
          </div>
          <label className="block border border-dashed border-zinc-300 p-5 text-center cursor-pointer hover:bg-zinc-50 transition-colors">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
            <span className="text-xs tracking-widest">{uploading ? "UPLOAD EN COURS..." : "+ AJOUTER UNE IMAGE (JPG/PNG, max 5MB)"}</span>
          </label>
          <p className="text-xs text-zinc-500 mt-2">Glissez plusieurs images. La 1ère = image principale boutique. Vous pourrez réordonner après création.</p>
        </div>

        {/* Variants — pro with color + active */}
        <div className="bg-white border border-zinc-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs tracking-[0.2em]">VARIANTES / STOCK — taille + couleur + dispo</h3>
              <p className="text-[11px] text-zinc-500">Chaque ligne = 1 déclinaison. Désactivez une couleur/taille sans la supprimer.</p>
            </div>
            <button type="button" onClick={addVariant} className="text-xs bg-black text-white px-4 py-2 tracking-widest hover:bg-zinc-800">+ AJOUTER</button>
          </div>
          <div className="space-y-3">
            {variants.map((v, idx)=> (
              <div key={idx} className={`border p-3 space-y-3 ${v.is_active ? "border-zinc-200 bg-white" : "border-zinc-200 bg-zinc-50 opacity-60"}`}>
                <div className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-3">
                    <label className="text-[10px] tracking-widest">TAILLE <span className="opacity-50">(optionnel)</span></label>
                    <Input placeholder="— Sans taille" value={v.size} onChange={e=> updateVariant(idx, "size", e.target.value)} className="rounded-none h-9 mt-1" />
                    <p className="text-[10px] text-zinc-500 mt-1">Laissez vide si pas de taille (ex: sac)</p>
                  </div>
                  <div className="col-span-4">
                    <label className="text-[10px] tracking-widest">COULEUR <span className="opacity-50">(optionnel)</span></label>
                    <div className="flex gap-2 mt-1">
                      <span className="w-9 h-9 rounded-full border border-zinc-200 shrink-0" style={{background: v.color_hex || "#fff"}} />
                      <Input placeholder="— Sans couleur" value={v.color} onChange={e=> updateVariant(idx, "color", e.target.value)} className="rounded-none h-9 flex-1" />
                    </div>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {COLORS.slice(0,8).map(c=> (
                        <button key={c.hex} type="button" onClick={()=> { updateVariant(idx, "color_hex", c.hex); if(!v.color) updateVariant(idx, "color", c.name) }} className={`w-6 h-6 rounded-full border ${v.color_hex===c.hex ? "border-black" : "border-white shadow"}`} style={{background:c.hex}} title={c.name} />
                      ))}
                      <button type="button" onClick={()=> updateVariant(idx, "color", "")} className="text-[10px] underline ml-1">Effacer</button>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] tracking-widest">STOCK</label>
                    <Input type="number" placeholder="0" value={v.stock} onChange={e=> updateVariant(idx, "stock", Number(e.target.value))} className="rounded-none h-9 mt-1" />
                  </div>
                  <div className="col-span-3 flex flex-col gap-2">
                    <label className={`flex items-center gap-2 text-xs px-2 py-1 border cursor-pointer ${v.is_active ? "bg-green-50 border-green-200 text-green-700" : "bg-zinc-100 border-zinc-200 text-zinc-500"}`}>
                      <input type="checkbox" checked={v.is_active} onChange={e=> updateVariant(idx, "is_active", e.target.checked)} />
                      {v.is_active ? "ACTIVE" : "DÉSACTIVÉ"}
                    </label>
                    <button type="button" onClick={()=> setVariants(variants.filter((_,i)=>i!==idx))} className="text-xs text-red-600 border border-red-200 py-1.5 hover:bg-red-50">RETIRER</button>
                  </div>
                </div>
                {/* Image par couleur — chaque couleur a ses propres images */}
                <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 p-2">
                  <div className="w-16 h-16 bg-white border border-zinc-200 overflow-hidden shrink-0">
                    {v.image_url ? <img src={v.image_url} alt={v.color} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">Aucune</div>}
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] tracking-widest">IMAGE POUR { (v.color || "CETTE VARIANTE").toUpperCase()} {v.color ? `— quand client sélectionne ${v.color}, galerie switch` : "— s’affiche si variante sélectionnée"}</label>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <label className="text-xs border border-zinc-300 bg-white px-3 py-1.5 cursor-pointer hover:bg-zinc-50">
                        <input type="file" accept="image/*" onChange={e=> e.target.files?.[0] && handleVariantImage(idx, e.target.files[0])} className="hidden" />
                        UPLOADER {v.color || "IMAGE"}
                      </label>
                      {imageUrls.length>0 && (
                        <select value={v.image_url || ""} onChange={e=> updateVariant(idx, "image_url", e.target.value || null)} className="text-xs border border-zinc-200 px-2 py-1 bg-white max-w-[200px]">
                          <option value="">— Choisir parmi images produit —</option>
                          {imageUrls.map((u,i)=> <option key={i} value={u}>Image {i+1}</option>)}
                        </select>
                      )}
                      {v.image_url && <button type="button" onClick={()=> updateVariant(idx, "image_url", null)} className="text-xs text-zinc-500 underline">Retirer</button>}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">Optionnel — si vide, galerie produit par défaut.</p>
                  </div>
                  <div className="hidden sm:block text-[11px] text-zinc-500 max-w-[160px]">Ex: 1 sac bleu (image bleue) + 1 noir (image noire) → switch fluide.</div>
                </div>
              </div>
            ))}
            {variants.length===0 && (
              <div className="border border-dashed p-6 text-center space-y-2">
                <p className="text-xs text-zinc-500">Aucune variante — produit simple sans taille/couleur</p>
                <p className="text-[11px] text-zinc-400">Le produit sera vendu tel quel, sans sélecteur. Stock géré au niveau produit.</p>
                <button type="button" onClick={()=> setVariants([{ size: "", color: "", color_hex: "#0a0a0a", image_url: null, stock: 10, is_active: true }])} className="text-xs border border-black px-3 py-1">Ajouter variante simple</button>
              </div>
            )}
          </div>
        </div>

        <Button type="submit" disabled={loading || uploading} className="w-full rounded-none tracking-widest text-xs h-12">
          {loading ? "CRÉATION..." : "CRÉER LE PRODUIT →"}
        </Button>
        <p className="text-center text-xs text-zinc-500">Après création vous pourrez éditer, ajouter images et dupliquer.</p>
      </form>
    </div>
  )
}
