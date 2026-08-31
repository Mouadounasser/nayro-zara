"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const localOrders: any[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("order-")) {
        try { localOrders.push(JSON.parse(localStorage.getItem(key)!)) } catch {}
      }
    }
    setOrders(localOrders)
    // Try Supabase
    fetch("/api/orders").then(r=>r.json()).then(d=> { if(d.orders?.length) setOrders(d.orders)}).catch(()=>{})
  }, [])

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-12">
      <h1 className="text-2xl font-light tracking-[0.2em] mb-8">MES COMMANDES</h1>
      {orders.length === 0 ? (
        <div className="border border-zinc-200 p-12 text-center bg-white">
          <p className="text-sm text-zinc-500 mb-4">Aucune commande</p>
          <Link href="/shop" className="text-xs tracking-widest border border-black px-6 py-3">COMMENCER VOS ACHATS</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.order_number || o.id} className="bg-white border border-zinc-200 p-6 flex justify-between items-center">
              <div>
                <p className="font-mono text-sm font-medium">{o.order_number || o.id}</p>
                <p className="text-xs text-zinc-500">{o.created_at ? new Date(o.created_at).toLocaleDateString("fr-FR") : ""} • {o.status || "pending"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{o.total} MAD</p>
                <Link href={`/order-confirmation/${o.order_number || o.id}`} className="text-xs underline">Détails</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
