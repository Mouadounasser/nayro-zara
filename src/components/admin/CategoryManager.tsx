"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

type Cat = { id: string; slug: string; name: string; description?: string; position: number }

export function CategoryManager() {
  const [cats, setCats] = useState<Cat[]>([])
  const [form, setForm] = useState({ slug: "", name: "", description: "" })
  const { toast } = useToast()

  const load = () => fetch("/api/admin/categories").then(r=>r.json()).then(d=> setCats(d.categories || [])).catch(()=>{})
  useEffect(()=> { load() }, [])

  const create = async () => {
    if(!form.slug || !form.name) return toast("Slug et nom requis", "error")
    const res = await fetch("/api/admin/categories", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(form)})
    if(res.ok) { toast("Catégorie créée", "success"); setForm({ slug:"", name:"", description:""}); load() }
    else toast("Erreur", "error")
  }

  const remove = async (id: string) => {
    if(!confirm("Supprimer ?")) return
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
    if(res.ok) { toast("Supprimée", "success"); load() }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-zinc-200 p-6">
        <h3 className="text-xs tracking-[0.2em] mb-4">NOUVELLE CATÉGORIE</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Input placeholder="slug (ex: women)" value={form.slug} onChange={e=> setForm({...form, slug: e.target.value.toLowerCase()})} className="rounded-none" />
          <Input placeholder="Nom (ex: Women)" value={form.name} onChange={e=> setForm({...form, name: e.target.value})} className="rounded-none" />
          <Input placeholder="Description" value={form.description} onChange={e=> setForm({...form, description: e.target.value})} className="rounded-none" />
        </div>
        <Button onClick={create} className="mt-4 rounded-none tracking-widest text-xs">CRÉER</Button>
      </div>

      <div className="bg-white border border-zinc-200">
        {cats.map(c=> (
          <div key={c.id} className="flex justify-between items-center p-4 border-b last:border-0">
            <div>
              <p className="text-sm font-medium tracking-widest">{c.name}</p>
              <p className="text-xs text-zinc-500">{c.slug} {c.description ? `• ${c.description}` : ""}</p>
            </div>
            <button onClick={()=> remove(c.id)} className="text-xs text-red-600 border border-red-200 px-3 py-1 hover:bg-red-50">SUPPRIMER</button>
          </div>
        ))}
        {cats.length===0 && <p className="p-8 text-center text-sm text-zinc-500">Aucune catégorie</p>}
      </div>
    </div>
  )
}
