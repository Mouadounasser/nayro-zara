"use client"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { formatMAD } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Minus, Plus, X } from "lucide-react"

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-light tracking-[0.2em] mb-4">PANIER</h1>
        <p className="text-zinc-500 mb-8">Votre panier est vide</p>
        <Link href="/shop"><Button className="tracking-widest text-xs rounded-none">CONTINUER VOS ACHATS</Button></Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8">
      <h1 className="text-2xl font-light tracking-[0.2em] mb-8">PANIER ({items.length})</h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-12">
        <div className="space-y-6">
          {items.map(item => (
            <div key={`${item.productId}-${item.size}`} className="flex gap-4 border-b border-zinc-100 pb-6">
              <Link href={`/product/${item.slug}`} className="w-28 h-36 bg-zinc-100 relative shrink-0">
                <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
              </Link>
              <div className="flex-1">
                <Link href={`/product/${item.slug}`} className="text-sm font-medium hover:underline">{item.name.toUpperCase()}</Link>
                <p className="text-xs text-zinc-500 mt-1">Taille: {item.size || "—"} {item.color ? `• ${item.color}` : ""}</p>
                <p className="text-sm font-medium mt-2">{formatMAD(item.price)}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} className="w-8 h-8 border border-zinc-200 flex items-center justify-center"><Minus size={14} /></button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} className="w-8 h-8 border border-zinc-200 flex items-center justify-center"><Plus size={14} /></button>
                  <button onClick={() => removeItem(item.productId, item.size)} className="ml-auto text-xs underline"><X size={14} className="inline mr-1" />RETIRER</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-zinc-200 p-6 h-fit lg:sticky lg:top-24">
          <h3 className="text-xs tracking-[0.2em] mb-4">RÉSUMÉ</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-zinc-500">Sous-total</span><span>{formatMAD(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Livraison</span><span className="text-xs">Calculée à l'étape suivante</span></div>
            <div className="border-t border-zinc-200 pt-3 flex justify-between font-medium"><span>TOTAL</span><span>{formatMAD(subtotal)}</span></div>
          </div>
          <Link href="/checkout" className="block mt-6">
            <Button className="w-full h-12 tracking-[0.2em] text-xs rounded-none">COMMANDER</Button>
          </Link>
          <Link href="/shop" className="block mt-3 text-center text-xs tracking-widest border border-zinc-200 py-3 hover:bg-zinc-50">CONTINUER VOS ACHATS</Link>
        </div>
      </div>
    </div>
  )
}
