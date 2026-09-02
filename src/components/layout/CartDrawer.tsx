"use client"
import Link from "next/link"
import Image from "next/image"
import { X, Minus, Plus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatMAD } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function CartDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { items, subtotal, updateQuantity, removeItem } = useCart()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative w-full max-w-[420px] bg-[#fdfcf8] h-full flex flex-col shadow-2xl animate-in slide-in-from-right">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <h2 className="text-sm tracking-[0.2em] font-medium">PANIER ({items.length})</h2>
          <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-zinc-100">
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <p className="text-sm tracking-widest text-zinc-500 mb-4">VOTRE PANIER EST VIDE</p>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="tracking-widest text-xs">
              CONTINUER VOS ACHATS
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.map(item => (
                <div key={`${item.productId}-${item.size}`} className="flex gap-4">
                  <div className="w-24 h-32 bg-zinc-100 relative overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <h3 className="text-xs tracking-wide font-medium leading-tight">{item.name.toUpperCase()}</h3>
                    {item.size && <p className="text-xs text-zinc-500">Taille: {item.size}</p>}
                    {item.color && <p className="text-xs text-zinc-500">{item.color}</p>}
                    <p className="text-sm font-medium mt-1">{formatMAD(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} className="w-7 h-7 border border-zinc-200 flex items-center justify-center hover:bg-zinc-100">
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} className="w-7 h-7 border border-zinc-200 flex items-center justify-center hover:bg-zinc-100">
                        <Plus size={12} />
                      </button>
                      <button onClick={() => removeItem(item.productId, item.size)} className="ml-auto text-xs tracking-widest underline underline-offset-4">
                        RETIRER
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200 p-6 space-y-4 bg-white">
              <div className="flex justify-between text-sm">
                <span className="tracking-widest text-zinc-500">SOUS-TOTAL</span>
                <span className="font-medium">{formatMAD(subtotal)}</span>
              </div>
              <p className="text-xs text-zinc-500">Livraison calculée à l'étape suivante.</p>
              <Link href="/checkout" onClick={() => onOpenChange(false)} className="block">
                <Button className="w-full tracking-[0.2em] text-xs h-12">COMMANDER</Button>
              </Link>
              <button onClick={() => onOpenChange(false)} className="w-full text-xs tracking-[0.2em] py-3 border border-zinc-200 hover:bg-zinc-50">
                CONTINUER VOS ACHATS
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
