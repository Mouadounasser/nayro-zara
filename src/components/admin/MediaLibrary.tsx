"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

type SiteImage = {
  id: string
  key: string
  label: string
  description: string | null
  recommended_size: string
  url: string
  alt: string | null
  category: string
}

export function MediaLibrary() {
  const [images, setImages] = useState<SiteImage[]>([])
  const [filter, setFilter] = useState("all")
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const { toast } = useToast()

  const load = () => fetch("/api/admin/site-images").then(r=>r.json()).then(d=> setImages(d.images || []))
  useEffect(()=> { load() }, [])

  const handleUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(!file) return
    if(file.size > 5*1024*1024) return toast("Max 5MB", "error")
    setUploadingId(id)
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    const data = await res.json()
    if(!res.ok) { toast(data.error || "Erreur upload", "error"); setUploadingId(null); return }
    // Update site_images url
    const upd = await fetch(`/api/admin/site-images/${id}`, {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ url: data.url })
    })
    if(upd.ok) { toast("Image mise à jour", "success"); load() }
    else toast("Erreur mise à jour", "error")
    setUploadingId(null)
  }

  const categories = ["all", "hero", "category", "lookbook", "sale", "instagram", "story"] as const
  const filtered = filter==="all" ? images : images.filter(i=> i.category===filter)

  return (
    <div>
      <div className="bg-white border border-zinc-200 p-4 mb-6">
        <h3 className="text-xs tracking-[0.2em] mb-2">MÉDIATHÈQUE WORDPRESS-LIKE</h3>
        <p className="text-xs text-zinc-500">Chaque image du site est contrôlable ici. Cliquez sur <strong>CHANGER</strong> pour uploader une nouvelle image — elle remplacera instantanément l’image sur le site (homepage, catégories, lookbook, etc.). <strong>Taille recommandée</strong> affichée pour chaque emplacement pour un rendu parfait (comme WordPress).</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(c=> (
          <button key={c} onClick={()=> setFilter(c)} className={`px-4 py-2 text-xs tracking-widest border whitespace-nowrap ${filter===c ? "bg-black text-white border-black" : "bg-white border-zinc-200 hover:border-black"}`}>{c.toUpperCase()}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(img=> (
          <div key={img.id} className="bg-white border border-zinc-200 overflow-hidden group">
            <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
              <img src={img.url} alt={img.alt || img.label} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 bg-black text-white text-[10px] tracking-widest px-2 py-1">{img.category.toUpperCase()}</span>
              {uploadingId===img.id && <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs">UPLOAD...</span>}
            </div>
            <div className="p-4">
              <h4 className="text-sm font-medium">{img.label}</h4>
              <p className="text-xs text-zinc-500 mt-1">{img.description}</p>
              <div className="mt-3 bg-amber-50 border border-amber-200 p-2">
                <p className="text-xs font-medium tracking-widest">TAILLE RECOMMANDÉE</p>
                <p className="text-xs font-mono mt-1">{img.recommended_size}</p>
                <p className="text-xs text-zinc-500 mt-1">Clé: <code className="bg-white px-1 border">{img.key}</code></p>
              </div>
              <div className="mt-3">
                <label className="block w-full text-center bg-black text-white text-xs tracking-[0.2em] py-2 cursor-pointer hover:bg-zinc-800">
                  <input type="file" accept="image/*" onChange={e=> handleUpload(img.id, e)} className="hidden" disabled={!!uploadingId} />
                  {uploadingId===img.id ? "UPLOAD..." : "CHANGER L'IMAGE"}
                </label>
                <p className="text-xs text-zinc-400 mt-2 text-center">JPG, PNG, WebP • Max 5MB • Sera visible instantanément sur le site</p>
              </div>
              <div className="mt-2 flex gap-2">
                <Input value={img.url} readOnly className="text-xs font-mono h-8 rounded-none bg-zinc-50" />
                <a href={img.url} target="_blank" className="text-xs border border-zinc-200 px-3 flex items-center hover:bg-zinc-50">VOIR</a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white border border-zinc-200 p-6">
        <h3 className="text-xs tracking-[0.2em] mb-4">TOUTES LES IMAGES PRODUITS</h3>
        <p className="text-xs text-zinc-500 mb-4">Gérez les images produits via <a href="/admin/products" className="underline">Produits → Éditer</a> — chaque produit permet d’ajouter/supprimer/réordonner ses images. Toutes les images sont stockées dans Supabase Storage (bucket <code>products</code>).</p>
        <p className="text-xs text-zinc-500">Astuce WordPress: pour une qualité pro, respectez les tailles recommandées ci-dessus. Le site redimensionne automatiquement via <code>next/image</code> mais une source bien dimensionnée = plus net.</p>
      </div>
    </div>
  )
}
