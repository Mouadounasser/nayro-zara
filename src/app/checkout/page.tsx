"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { formatMAD } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MOROCCAN_CITIES, DEFAULT_SETTINGS } from "@/lib/constants"
import { useToast } from "@/components/ui/toast"

function validatePhone(phone: string) {
  const cleaned = phone.replace(/[\s-]/g, "")
  return /^(\+212[567]\d{8}|0[567]\d{8}|[567]\d{8})$/.test(cleaned)
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", city: "Casablanca", address: "", notes: "" })
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  useEffect(() => {
    fetch("/api/settings").then(r=>r.json()).then(d=>{
      if(d && d.delivery_fee !== undefined) setSettings(s=> ({ ...s, delivery_fee: Number(d.delivery_fee), free_delivery_threshold: Number(d.free_delivery_threshold), whatsapp_number: d.whatsapp_number || s.whatsapp_number }))
    }).catch(()=>{})
  }, [])

  const deliveryFee = subtotal >= settings.free_delivery_threshold ? 0 : settings.delivery_fee
  const total = subtotal + deliveryFee
  const remainingForFree = Math.max(0, settings.free_delivery_threshold - subtotal)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) { toast("Votre panier est vide", "error"); return }
    if (!form.name || !form.phone || !form.address) { toast("Veuillez remplir tous les champs obligatoires", "error"); return }
    if (!validatePhone(form.phone)) { toast("Numéro marocain invalide. Ex: 06 12 34 56 78", "error"); return }

    setLoading(true)
    try {
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

      localStorage.setItem(`order-${orderNumber}`, JSON.stringify(order))
      clearCart()
      router.push(`/order-confirmation/${orderNumber}`)
    } finally {
      setLoading(false)
    }
  }

  const whatsappCartMessage = encodeURIComponent(
    `Salam NAYRO 👋%0AJe veux commander:%0A${items.map(i=> `- ${i.name} ${i.color?`(${i.color})`:""} ${i.size?`[${i.size}]`:""} x${i.quantity} = ${formatMAD(i.price*i.quantity)}`).join("%0A")}%0A%0ASous-total: ${formatMAD(subtotal)}%0ALivraison: ${deliveryFee===0?"Gratuite":formatMAD(deliveryFee)}%0ATOTAL: ${formatMAD(total)} (COD)%0A`
  )
  const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${whatsappCartMessage}`

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-20 text-center">
        <p className="mb-4">Panier vide — impossible de commander</p>
        <a href="/shop" className="text-xs tracking-[0.2em] border border-black px-6 py-3">ALLER BOUTIQUE</a>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8">
      <h1 className="text-2xl font-light tracking-[0.2em] mb-2">COMMANDE</h1>
      <p className="text-xs text-zinc-500 mb-8">Paiement à la livraison • Appel confirmation &lt;2h sur WhatsApp • 06 89 36 35 96</p>
      <div className="grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-zinc-200 p-6">
            <h2 className="text-xs tracking-[0.2em] mb-6">INFORMATIONS DE LIVRAISON</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs tracking-widest">NOM COMPLET *</label>
                <Input required autoComplete="name" value={form.name} onChange={e=> setForm({...form, name: e.target.value})} placeholder="Votre nom complet" className="mt-1 rounded-none text-[16px] md:text-sm" />
              </div>
              <div>
                <label className="text-xs tracking-widest">TÉLÉPHONE *</label>
                <Input required inputMode="tel" autoComplete="tel" value={form.phone} onChange={e=> setForm({...form, phone: e.target.value})} placeholder="06 12 34 56 78" className="mt-1 rounded-none text-[16px] md:text-sm" />
                <p className="text-xs text-zinc-500 mt-1">Format: 06/07/05 XX XX XX XX ou +212 6XX</p>
              </div>
              <div>
                <label className="text-xs tracking-widest">VILLE *</label>
                <select value={form.city} onChange={e=> setForm({...form, city: e.target.value})} className="mt-1 w-full h-11 border border-zinc-200 bg-white px-4 text-sm focus:outline-none focus:border-black">
                  {MOROCCAN_CITIES.map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs tracking-widest">ADRESSE COMPLÈTE *</label>
                <Input required autoComplete="street-address" value={form.address} onChange={e=> setForm({...form, address: e.target.value})} placeholder="Rue, quartier, immeuble, étage, repère..." className="mt-1 rounded-none text-[16px] md:text-sm" />
                <p className="text-[11px] text-zinc-500 mt-1">Ex: Rue 12, Quartier Maarif, Imm. 5, 2ème étage, près pharmacie</p>
              </div>
              <div>
                <label className="text-xs tracking-widest">NOTES (OPTIONNEL)</label>
                <textarea value={form.notes} onChange={e=> setForm({...form, notes: e.target.value})} placeholder="Infos supplémentaires pour la livraison" className="mt-1 w-full border border-zinc-200 p-3 text-sm focus:outline-none focus:border-black text-[16px] md:text-sm" rows={2} />
              </div>
              <div className="bg-[#fdfcf8] border border-zinc-200 p-4 text-sm">
                <p className="font-medium tracking-wide mb-1">PAIEMENT À LA LIVRAISON • COD</p>
                <p className="text-zinc-500 text-xs leading-relaxed">Payez en espèces à la réception. Aucun paiement en ligne requis. Appel WhatsApp de confirmation sous 2h. <span className="text-black">✓ Retours 14j • ✓ Suivi WhatsApp</span></p>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 tracking-[0.2em] text-xs rounded-none">
            {loading ? "TRAITEMENT..." : `CONFIRMER LA COMMANDE — ${formatMAD(total)}`}
          </Button>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] tracking-widest text-zinc-500">
            <span className="flex flex-col items-center gap-1"><span className="w-8 h-8 border border-zinc-200 flex items-center justify-center">✓</span>RETROURS 14J</span>
            <span className="flex flex-col items-center gap-1"><span className="w-8 h-8 border border-zinc-200 flex items-center justify-center">✈</span>2-4 JOURS</span>
            <span className="flex flex-col items-center gap-1"><span className="w-8 h-8 border border-zinc-200 flex items-center justify-center">✆</span>WHATSAPP</span>
          </div>

          <div className="bg-[#25D366]/10 border border-[#25D366]/20 p-4 text-center">
            <p className="text-xs tracking-[0.2em] text-[#25D366] mb-2">PRÉFÉREZ WHATSAPP ?</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full bg-[#25D366] text-white text-xs tracking-[0.2em] py-3 hover:bg-[#128C7E] transition-colors">
              COMMANDER SUR WHATSAPP — 1 MESSAGE
            </a>
            <p className="text-[11px] text-zinc-500 mt-2">Panier prérempli, réponse &lt;5min sur 06 89 36 35 96</p>
          </div>
        </form>

        <div className="bg-white border border-zinc-200 p-6 h-fit lg:sticky lg:top-24">
          <h3 className="text-xs tracking-[0.2em] mb-4">RÉSUMÉ</h3>
          <div className="space-y-3 mb-6 max-h-[320px] overflow-auto pr-1">
            {items.map(i=> (
              <div key={`${i.productId}-${i.variantId || i.size}-${i.color || ""}`} className="flex justify-between text-sm gap-3">
                <span className="truncate">{i.name} ×{i.quantity} {i.color ? `• ${i.color}` : ""} {i.size? `(${i.size})`: ""}</span>
                <span className="shrink-0">{formatMAD(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-zinc-200 pt-4">
            <div className="flex justify-between"><span className="text-zinc-500">Sous-total</span><span>{formatMAD(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Livraison</span><span>{deliveryFee===0? "Gratuite": formatMAD(deliveryFee)}</span></div>
            {remainingForFree > 0 && <p className="text-xs text-amber-600">Plus que {formatMAD(remainingForFree)} pour la livraison gratuite dès {formatMAD(settings.free_delivery_threshold)}</p>}
            {remainingForFree === 0 && <p className="text-xs text-green-600">✓ Livraison gratuite débloquée !</p>}
            <div className="flex justify-between font-medium text-base pt-2 border-t border-zinc-200"><span>TOTAL</span><span>{formatMAD(total)}</span></div>
            <div className="text-[11px] text-zinc-500 text-center">à payer à la livraison</div>
          </div>
          <p className="text-xs text-zinc-500 mt-4 text-center">Livraison estimée: 2-4 jours ouvrables • Casablanca/Rabat 1-2j</p>
          <a href={whatsappUrl} target="_blank" className="mt-4 flex items-center justify-center gap-2 w-full border border-[#25D366] text-[#25D366] text-xs tracking-[0.2em] py-3 hover:bg-[#25D366] hover:text-white transition-colors">
            DEMANDER SUR WHATSAPP
          </a>
        </div>
      </div>
    </div>
  )
}
