"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { formatMAD } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MOROCCAN_CITIES, DEFAULT_SETTINGS } from "@/lib/constants"
import { useToast } from "@/components/ui/toast"

function validatePhone(phone: string) {
  const cleaned = phone.replace(/\s/g, "")
  return /^(\+212[67]\d{8}|0[67]\d{8}|[67]\d{8})$/.test(cleaned)
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", city: "Casablanca", address: "", notes: "" })

  const deliveryFee = subtotal >= DEFAULT_SETTINGS.free_delivery_threshold ? 0 : DEFAULT_SETTINGS.delivery_fee
  const total = subtotal + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) { toast("Votre panier est vide", "error"); return }
    if (!form.name || !form.phone || !form.address) { toast("Veuillez remplir tous les champs obligatoires", "error"); return }
    if (!validatePhone(form.phone)) { toast("Numéro marocain invalide. Ex: 06 12 34 56 78", "error"); return }

    setLoading(true)
    try {
      // Try Supabase insert, fallback to local storage
      const orderNumber = `NAYRO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
      const order = {
        id: orderNumber,
        order_number: orderNumber,
        customer_name: form.name,
        phone: form.phone,
        city: form.city,
        address: form.address,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        items,
        created_at: new Date().toISOString(),
        status: "pending",
      }

      // Store locally for demo (supabase branch will be handled if configured)
      // Attempt to call API route if exists
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...order, ...form, subtotal, delivery_fee: deliveryFee, total, items }),
        })
        if (res.ok) {
          const data = await res.json()
          clearCart()
          router.push(`/order-confirmation/${data.order_number || orderNumber}`)
          return
        }
      } catch {}

      // Fallback local
      localStorage.setItem(`order-${orderNumber}`, JSON.stringify(order))
      clearCart()
      router.push(`/order-confirmation/${orderNumber}`)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-20 text-center">
        <p>Panier vide — impossible de commander</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8">
      <h1 className="text-2xl font-light tracking-[0.2em] mb-8">COMMANDE</h1>
      <div className="grid lg:grid-cols-[1fr_420px] gap-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-zinc-200 p-6">
            <h2 className="text-xs tracking-[0.2em] mb-6">INFORMATIONS DE LIVRAISON</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs tracking-widest">NOM COMPLET *</label>
                <Input required value={form.name} onChange={e=> setForm({...form, name: e.target.value})} placeholder="Votre nom complet" className="mt-1 rounded-none" />
              </div>
              <div>
                <label className="text-xs tracking-widest">TÉLÉPHONE *</label>
                <Input required value={form.phone} onChange={e=> setForm({...form, phone: e.target.value})} placeholder="06 12 34 56 78" className="mt-1 rounded-none" />
                <p className="text-xs text-zinc-500 mt-1">Format: 06 XX XX XX XX ou +212 6 XX XX XX XX</p>
              </div>
              <div>
                <label className="text-xs tracking-widest">VILLE *</label>
                <select value={form.city} onChange={e=> setForm({...form, city: e.target.value})} className="mt-1 w-full h-11 border border-zinc-200 bg-white px-4 text-sm focus:outline-none focus:border-black">
                  {MOROCCAN_CITIES.map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs tracking-widest">ADRESSE *</label>
                <Input required value={form.address} onChange={e=> setForm({...form, address: e.target.value})} placeholder="Rue, quartier, immeuble..." className="mt-1 rounded-none" />
              </div>
              <div>
                <label className="text-xs tracking-widest">NOTES (OPTIONNEL)</label>
                <textarea value={form.notes} onChange={e=> setForm({...form, notes: e.target.value})} placeholder="Infos supplémentaires pour la livraison" className="mt-1 w-full border border-zinc-200 p-3 text-sm focus:outline-none focus:border-black" rows={3} />
              </div>
              <div className="bg-[#fdfcf8] border border-zinc-200 p-4 text-sm">
                <p className="font-medium tracking-wide mb-1">PAIEMENT À LA LIVRAISON</p>
                <p className="text-zinc-500 text-xs">Payez en espèces à la réception de votre commande. Aucun paiement en ligne requis.</p>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 tracking-[0.2em] text-xs rounded-none">
            {loading ? "TRAITEMENT..." : "CONFIRMER LA COMMANDE"}
          </Button>
        </form>

        <div className="bg-white border border-zinc-200 p-6 h-fit sticky top-24">
          <h3 className="text-xs tracking-[0.2em] mb-4">RÉSUMÉ</h3>
          <div className="space-y-3 mb-6">
            {items.map(i=> (
              <div key={`${i.productId}-${i.size}`} className="flex justify-between text-sm">
                <span>{i.name} ×{i.quantity} {i.size? `(${i.size})`: ""}</span>
                <span>{formatMAD(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-zinc-200 pt-4">
            <div className="flex justify-between"><span className="text-zinc-500">Sous-total</span><span>{formatMAD(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Livraison</span><span>{deliveryFee===0? "Gratuite": formatMAD(deliveryFee)}</span></div>
            {subtotal < DEFAULT_SETTINGS.free_delivery_threshold && <p className="text-xs text-amber-600">Plus que {formatMAD(DEFAULT_SETTINGS.free_delivery_threshold - subtotal)} pour la livraison gratuite</p>}
            <div className="flex justify-between font-medium text-base pt-2 border-t border-zinc-200"><span>TOTAL</span><span>{formatMAD(total)}</span></div>
          </div>
          <p className="text-xs text-zinc-500 mt-4">Livraison estimée: 2-4 jours ouvrables</p>
        </div>
      </div>
    </div>
  )
}
