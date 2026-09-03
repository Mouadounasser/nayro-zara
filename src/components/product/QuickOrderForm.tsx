"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MOROCCAN_CITIES } from "@/lib/constants"
import { formatMAD } from "@/lib/utils"
import { useToast } from "@/components/ui/toast"
import type { Product } from "@/lib/types"

export function QuickOrderForm({ product, selectedVariant, quantity, whatsappNumber }: { product: Product; selectedVariant: any; quantity: number; whatsappNumber: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", city: "Casablanca", address: "" })
  const [settings, setSettings] = useState({ delivery_fee: 35, free_delivery_threshold: 299 })

  useEffect(() => {
    fetch("/api/settings").then(r=>r.json()).then(d=>{
      if(d && d.delivery_fee !== undefined) setSettings({ delivery_fee: Number(d.delivery_fee), free_delivery_threshold: Number(d.free_delivery_threshold) })
    }).catch(()=>{})
  }, [])

  const variantPrice = selectedVariant?.price_override ?? product.price
  const subtotal = variantPrice * quantity
  const deliveryFee = subtotal >= settings.free_delivery_threshold ? 0 : settings.delivery_fee
  const total = subtotal + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!form.name || !form.phone || !form.address) { toast("Veuillez remplir Nom, Téléphone, Adresse", "error"); return }
    const cleaned = form.phone.replace(/[\s-]/g, "")
    if (!/^(\+212[567]\d{8}|0[567]\d{8}|[567]\d{8})$/.test(cleaned)) { toast("Téléphone invalide: 06 12 34 56 78", "error"); return }
    if(!selectedVariant) { toast("Veuillez choisir une variante", "error"); return }
    setLoading(true)
    try {
      const orderNumber = `NAYRO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
      const payload = {
        order_number: orderNumber,
        customer_name: form.name,
        phone: form.phone,
        city: form.city,
        address: form.address,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        items: [{
          productId: product.id,
          variantId: selectedVariant.id,
          slug: product.slug,
          name: product.name,
          price: variantPrice,
          image: selectedVariant.image_urls?.[0] || selectedVariant.image_url || product.images[0]?.url || "",
          size: selectedVariant.size || null,
          color: selectedVariant.color || null,
          quantity,
          sku: selectedVariant.sku || product.sku,
        }],
        notes: `Commande rapide: ${product.name} ${selectedVariant.color || ""} ${selectedVariant.size || ""} x${quantity}`,
      }
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if(res.ok) {
        const data = await res.json()
        toast("Commande confirmée — Paiement à la livraison", "success")
        router.push(`/order-confirmation/${data.order_number || orderNumber}`)
        return
      }
      // fallback local
      localStorage.setItem(`order-${orderNumber}`, JSON.stringify({ ...payload, id: orderNumber, created_at: new Date().toISOString(), status: "pending" }))
      toast("Commande enregistrée", "success")
      router.push(`/order-confirmation/${orderNumber}`)
    } catch (err:any) {
      toast(err.message || "Erreur", "error")
    } finally { setLoading(false) }
  }

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Salam NAYRO 👋%0AJe veux commander:%0A- ${product.name} ${selectedVariant?.color || ""} ${selectedVariant?.size || ""} x${quantity} = ${formatMAD(total)} (COD)%0A`)}`

  return (
    <div id="quick-order" className="bg-white border border-zinc-200 p-6 scroll-mt-24">
      <h3 className="text-sm tracking-[0.2em] mb-1">COMMANDE RAPIDE — PAIEMENT À LA LIVRAISON</h3>
      <p className="text-xs text-zinc-500 mb-4">Remplissez 4 champs, on vous confirme sur WhatsApp en &lt;2h. Pas de compte requis.</p>
      <div className="bg-[#fdfcf8] border border-zinc-200 p-3 mb-4 text-xs space-y-1">
        <div className="flex justify-between"><span>{product.name} {selectedVariant?.color ? `• ${selectedVariant.color}` : ""} {selectedVariant?.size ? `• ${selectedVariant.size}` : ""} ×{quantity}</span><span className="font-medium">{formatMAD(subtotal)}</span></div>
        <div className="flex justify-between text-zinc-500"><span>Livraison</span><span>{deliveryFee===0 ? "Gratuite" : formatMAD(deliveryFee)}</span></div>
        <div className="flex justify-between font-medium border-t border-zinc-200 pt-2"><span>TOTAL COD</span><span>{formatMAD(total)}</span></div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs tracking-widest">NOM COMPLET *</label>
          <Input required value={form.name} onChange={e=> setForm({...form, name: e.target.value})} placeholder="Votre nom" className="mt-1 rounded-none text-[16px] md:text-sm" autoComplete="name" />
        </div>
        <div>
          <label className="text-xs tracking-widest">TÉLÉPHONE *</label>
          <Input required inputMode="tel" autoComplete="tel" value={form.phone} onChange={e=> setForm({...form, phone: e.target.value})} placeholder="06 12 34 56 78" className="mt-1 rounded-none text-[16px] md:text-sm" />
        </div>
        <div>
          <label className="text-xs tracking-widest">VILLE *</label>
          <select value={form.city} onChange={e=> setForm({...form, city: e.target.value})} className="mt-1 w-full h-11 border border-zinc-200 bg-white px-4 text-sm focus:border-black outline-none">
            {MOROCCAN_CITIES.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs tracking-widest">ADRESSE *</label>
          <Input required value={form.address} onChange={e=> setForm({...form, address: e.target.value})} placeholder="Rue, quartier, immeuble, repère..." className="mt-1 rounded-none text-[16px] md:text-sm" autoComplete="street-address" />
        </div>
        <div className="bg-[#fdfcf8] border border-zinc-200 p-3 text-xs leading-relaxed">
          <p className="font-medium">✓ Paiement à la livraison • ✓ Livraison partout Maroc 2-4j • ✓ Retours 14j</p>
          <p className="text-zinc-500 mt-1">Vous payez en espèces à la réception. Appel WhatsApp de confirmation.</p>
        </div>
        <Button type="submit" disabled={loading} className="w-full h-12 tracking-[0.2em] text-xs rounded-none">
          {loading ? "TRAITEMENT..." : "COMMANDER MAINTENANT — COD"}
        </Button>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full h-11 border border-[#25D366] text-[#25D366] text-xs tracking-[0.2em] hover:bg-[#25D366] hover:text-white transition-colors">
          WHATSAPP 06 89 36 35 96
        </a>
        <p className="text-[11px] text-center text-zinc-500">Commande sans compte • Confirmation claire après envoi</p>
      </form>
    </div>
  )
}
