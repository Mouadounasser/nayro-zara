"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { formatMAD } from "@/lib/utils"

const statuses = ["pending","confirmed","processing","shipped","delivered","cancelled"] as const

export function OrderManager() {
  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  const load = () => {
    fetch("/api/orders").then(r=>r.json()).then(d=> setOrders(d.orders || [])).catch(()=>{})
    // Also load locals for demo
    const locals: any[] = []
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i)
      if(k?.startsWith("order-")) try{ locals.push(JSON.parse(localStorage.getItem(k)!)) } catch{}
    }
    if(locals.length) setOrders(prev => prev.length ? prev : locals)
  }
  useEffect(()=> { load() }, [])

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ status })
    })
    if(res.ok) {
      toast(`Statut → ${status}`, "success")
      load()
    } else {
      toast("Erreur", "error")
    }
  }

  const filtered = orders.filter(o => {
    const matchesSearch = !filter || `${o.order_number} ${o.customer_name} ${o.phone} ${o.city}`.toLowerCase().includes(filter.toLowerCase())
    const matchesStatus = statusFilter==="all" || o.status===statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input placeholder="Rechercher N° commande, client, téléphone, ville..." value={filter} onChange={e=> setFilter(e.target.value)} className="flex-1 rounded-none" />
        <select value={statusFilter} onChange={e=> setStatusFilter(e.target.value)} className="h-11 border border-zinc-200 px-4 text-sm bg-white">
          <option value="all">Tous statuts</option>
          {statuses.map(s=> <option key={s} value={s}>{s.toUpperCase()}</option>)}
        </select>
        <Button onClick={load} variant="outline" className="rounded-none tracking-widest text-xs">RAFRAÎCHIR</Button>
      </div>

      <div className="bg-white border border-zinc-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50 text-xs tracking-widest">
            <tr><th className="text-left p-3">N°</th><th>CLIENT</th><th>VILLE</th><th>TOTAL</th><th>STATUT</th><th>ACTION</th></tr>
          </thead>
          <tbody>
            {filtered.map((o: any)=> (
              <tr key={o.order_number || o.id} className="border-b hover:bg-zinc-50">
                <td className="p-3 font-mono text-xs">{o.order_number || o.id.slice(0,8)}</td>
                <td className="p-3">
                  <div className="font-medium">{o.customer_name}</div>
                  <div className="text-xs text-zinc-500">{o.phone}</div>
                </td>
                <td className="p-3 text-xs">{o.city}<br/><span className="text-zinc-500">{o.address?.slice(0,30)}</span></td>
                <td className="p-3 text-xs font-medium">{formatMAD(o.total || 0)}</td>
                <td className="p-3">
                  <select value={o.status || "pending"} onChange={e=> updateStatus(o.id, e.target.value)} className="text-xs border border-zinc-200 px-2 py-1 bg-white">
                    {statuses.map(s=> <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3 text-xs">
                  <button onClick={async ()=> {
                    const res = await fetch(`/api/orders/${o.order_number || o.id}`)
                    const data = await res.json()
                    alert(JSON.stringify(data, null, 2))
                  }} className="underline">DÉTAILS</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && <div className="p-8 text-center text-sm text-zinc-500">Aucune commande {statusFilter!=="all" ? `avec statut ${statusFilter}` : ""}</div>}
      </div>

      <div className="mt-4 flex gap-2 text-xs">
        <a href="/api/orders" target="_blank" className="border border-zinc-200 px-3 py-2 hover:bg-zinc-50">EXPORTER JSON (/api/orders)</a>
        <span className="text-zinc-500 py-2">Total: {filtered.length} / {orders.length}</span>
      </div>
    </div>
  )
}
