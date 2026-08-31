"use client"
import { useEffect, useState } from "react"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/orders").then(r=>r.json()).then(d=> setOrders(d.orders || [])).catch(()=>{})
    // Also load local orders
    const locals: any[] = []
    for (let i=0;i<localStorage.length;i++) {
      const k = localStorage.key(i)
      if (k?.startsWith("order-")) try{ locals.push(JSON.parse(localStorage.getItem(k)!)) } catch{}
    }
    if (locals.length && orders.length===0) setOrders(locals)
  }, [])

  return (
    <div>
      <h1 className="text-xl tracking-[0.2em] mb-6">COMMANDES</h1>
      <div className="bg-white border border-zinc-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50 text-xs tracking-widest">
            <tr><th className="text-left p-3">NUMÉRO</th><th>CLIENT</th><th>TÉL</th><th>VILLE</th><th>TOTAL</th><th>STATUT</th></tr>
          </thead>
          <tbody>
            {orders.length===0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-zinc-500">Aucune commande</td></tr>
            ) : orders.map((o: any)=> (
              <tr key={o.order_number || o.id} className="border-b">
                <td className="p-3 font-mono text-xs">{o.order_number || o.id}</td>
                <td className="p-3">{o.customer_name}</td>
                <td className="p-3">{o.phone}</td>
                <td className="p-3">{o.city}</td>
                <td className="p-3">{o.total} MAD</td>
                <td className="p-3"><span className="bg-amber-100 text-xs px-2 py-1">{o.status || "pending"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
