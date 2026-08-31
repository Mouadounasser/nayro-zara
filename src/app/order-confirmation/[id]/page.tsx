"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function OrderConfirmationPage() {
  const params = useParams()
  const id = params.id as string
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`order-${id}`)
      if (stored) setOrder(JSON.parse(stored))
    } catch {}
    // Try fetch from API
    fetch(`/api/orders/${id}`).then(r=> r.json()).then(d=> { if(d.order_number) setOrder(d)}).catch(()=>{})
  }, [id])

  return (
    <div className="mx-auto max-w-[600px] px-4 py-16 text-center">
      <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
        <Check size={28} />
      </div>
      <h1 className="text-2xl font-light tracking-[0.2em] mb-2">COMMANDE CONFIRMÉE</h1>
      <p className="text-sm text-zinc-500 mb-8">Merci pour votre commande. Nous vous contacterons pour confirmer la livraison.</p>

      <div className="bg-white border border-zinc-200 p-6 text-left mb-8">
        <p className="text-xs tracking-[0.2em] mb-4">DÉTAILS</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-zinc-500">Numéro</span><span className="font-mono font-medium">{id}</span></div>
          {order && (
            <>
              <div className="flex justify-between"><span className="text-zinc-500">Nom</span><span>{order.customer_name}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Téléphone</span><span>{order.phone}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Adresse</span><span>{order.city}, {order.address}</span></div>
              <div className="flex justify-between font-medium pt-2 border-t"><span>Total</span><span>{order.total} MAD</span></div>
            </>
          )}
        </div>
      </div>

      <p className="text-xs text-zinc-500 mb-8">Un SMS de confirmation vous sera envoyé. Paiement à la livraison.</p>

      <div className="flex gap-4 justify-center">
        <Link href="/shop"><Button variant="outline" className="rounded-none tracking-widest text-xs">CONTINUER VOS ACHATS</Button></Link>
        <Link href="/"><Button className="rounded-none tracking-widest text-xs">ACCUEIL</Button></Link>
      </div>
    </div>
  )
}
