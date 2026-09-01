"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

type Banner = { id: string; title: string; subtitle: string | null; image_url: string; link: string | null; position: number; is_active: boolean }

export function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [form, setForm] = useState({ title: "", subtitle: "", image_url: "", link: "/shop" })
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const load = () => fetch("/api/admin/banners").then(r=>r.json()).then(d=> setBanners(d.banners || [])).catch(()=>{})
  useEffect(()=> { load() }, [])

  const create = async () => {
    if(!form.title || !form.image_url) return toast("Titre et image requis", "error")
    const res = await fetch("/api/admin/banners", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(form)})
    if(res.ok) { toast("Bannière créée", "success"); setForm({ title:"", subtitle:"", image_url:"", link:"/shop"}); load() }
    else toast("Erreur", "error")
  }

  const toggle = async (b: Banner) => {
    const res = await fetch(`/api/admin/banners/${b.id}`, { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify({...b, is_active: !b.is_active})})
    if(res.ok) { toast(b.is_active ? "Désactivée" : "Activée", "success"); load() }
  }

  const remove = async (id: string) => {
    if(!confirm("Supprimer cette bannière ?")) return
    const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" })
    if(res.ok) { toast("Supprimée", "success"); load() }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    const data = await res.json()
    if(res.ok) {
      setForm({...form, image_url: data.url})
      toast("Image uploadée", "success")
    } else toast(data.error || "Erreur upload", "error")
    setUploading(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-zinc-200 p-6">
        <h3 className="text-xs tracking-[0.2em] mb-4">NOUVELLE BANNIÈRE / HERO</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input placeholder="Titre (ex: NAYRO)" value={form.title} onChange={e=> setForm({...form, title: e.target.value})} className="rounded-none" />
          <Input placeholder="Sous-titre" value={form.subtitle} onChange={e=> setForm({...form, subtitle: e.target.value})} className="rounded-none" />
          <Input placeholder="Lien (ex: /shop)" value={form.link} onChange={e=> setForm({...form, link: e.target.value})} className="rounded-none" />
          <Input placeholder="Image URL" value={form.image_url} onChange={e=> setForm({...form, image_url: e.target.value})} className="rounded-none" />
        </div>
        <div className="mt-4 flex gap-3 items-center">
          <label className="text-xs border border-dashed border-zinc-300 px-4 py-2 cursor-pointer hover:bg-zinc-50">
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
            {uploading ? "UPLOAD..." : "UPLOADER IMAGE"}
          </label>
          {form.image_url && <a href={form.image_url} target="_blank" className="text-xs underline">Aperçu</a>}
        </div>
        <Button onClick={create} className="mt-4 rounded-none tracking-widest text-xs">CRÉER BANNIÈRE</Button>
        <p className="text-xs text-zinc-500 mt-2">La première bannière active est utilisée comme HERO plein écran. Les suivantes pour sections éditoriales.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {banners.map(b=> (
          <div key={b.id} className="bg-white border border-zinc-200 overflow-hidden">
            <div className="relative aspect-[16/9] bg-zinc-100">
              <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
              <span className={`absolute top-2 left-2 text-xs px-2 py-1 ${b.is_active ? "bg-green-600 text-white" : "bg-zinc-800 text-white"}`}>{b.is_active ? "ACTIVE" : "INACTIVE"}</span>
            </div>
            <div className="p-4">
              <h4 className="text-sm font-medium tracking-wide">{b.title}</h4>
              <p className="text-xs text-zinc-500">{b.subtitle}</p>
              <p className="text-xs text-zinc-400 mt-1">{b.link} • pos {b.position}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={()=> toggle(b)} className={`text-xs px-3 py-1 border ${b.is_active ? "border-amber-200 bg-amber-50" : "border-green-200 bg-green-50"}`}>{b.is_active ? "DÉSACTIVER" : "ACTIVER"}</button>
                <button onClick={()=> remove(b.id)} className="text-xs px-3 py-1 border border-red-200 text-red-600">SUPPRIMER</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {banners.length===0 && <p className="text-center text-sm text-zinc-500 py-8">Aucune bannière</p>}
    </div>
  )
}
