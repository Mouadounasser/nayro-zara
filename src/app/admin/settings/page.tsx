"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

export default function SettingsPage() {
  const [form, setForm] = useState({ store_name: "NAYRO", whatsapp_number: "212600000000", instagram: "https://instagram.com/nayro", delivery_fee: 30, free_delivery_threshold: 50 })
  const { toast } = useToast()

  useEffect(() => {
    fetch("/api/settings").then(r=>r.json()).then(d=> { if(d.store_name) setForm(d)}).catch(()=>{})
  }, [])

  const save = async () => {
    const res = await fetch("/api/settings", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(form)})
    if (res.ok) toast("Paramètres enregistrés","success")
    else toast("Erreur — Supabase non configuré","error")
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl tracking-[0.2em] mb-6">PARAMÈTRES</h1>
      <div className="bg-white border border-zinc-200 p-6 space-y-4">
        <div>
          <label className="text-xs tracking-widest">NOM DU STORE</label>
          <Input value={form.store_name} onChange={e=> setForm({...form, store_name: e.target.value})} className="mt-1 rounded-none" />
        </div>
        <div>
          <label className="text-xs tracking-widest">WHATSAPP (sans +)</label>
          <Input value={form.whatsapp_number} onChange={e=> setForm({...form, whatsapp_number: e.target.value})} className="mt-1 rounded-none" />
        </div>
        <div>
          <label className="text-xs tracking-widest">INSTAGRAM</label>
          <Input value={form.instagram} onChange={e=> setForm({...form, instagram: e.target.value})} className="mt-1 rounded-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs tracking-widest">FRAIS LIVRAISON (MAD)</label>
            <Input type="number" value={form.delivery_fee} onChange={e=> setForm({...form, delivery_fee: Number(e.target.value)})} className="mt-1 rounded-none" />
          </div>
          <div>
            <label className="text-xs tracking-widest">SEUIL LIVRAISON GRATUITE</label>
            <Input type="number" value={form.free_delivery_threshold} onChange={e=> setForm({...form, free_delivery_threshold: Number(e.target.value)})} className="mt-1 rounded-none" />
          </div>
        </div>
        <Button onClick={save} className="w-full rounded-none tracking-widest text-xs">ENREGISTRER</Button>
      </div>
    </div>
  )
}
