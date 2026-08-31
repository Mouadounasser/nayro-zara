"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import type { Product } from "@/lib/types"
import { formatMAD } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useToast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ProductDetailClient({ product, whatsappNumber }: { product: Product; whatsappNumber: string }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const { toast } = useToast()

  const selectedVariant = product.variants.find(v => v.size === selectedSize)
  const isWishlisted = has(product.id)

  const handleAddToCart = () => {
    if (!selectedSize && product.variants.length > 1) {
      toast("Veuillez sélectionner une taille", "error")
      return
    }
    const size = selectedSize || product.variants[0]?.size || "One Size"
    const variant = product.variants.find(v => v.size === size)
    addItem({
      productId: product.id,
      variantId: variant?.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compare_at_price: product.compare_at_price,
      image: product.images[0]?.url || "",
      size,
      color: variant?.color || product.variants[0]?.color || undefined,
      quantity,
      sku: variant?.sku || product.sku,
    })
    toast("Ajouté au panier", "success")
  }

  const whatsappMessage = encodeURIComponent(`Bonjour NAYRO, je suis intéressé par ${product.name} (${product.sku})`)
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden">
          {product.images[activeImage] && (
            <Image src={product.images[activeImage].url} alt={product.images[activeImage].alt || product.name} fill className="object-cover" unoptimized priority />
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {product.images.map((img, idx) => (
            <button key={img.id} onClick={() => setActiveImage(idx)} className={cn("relative w-20 h-24 bg-zinc-100 shrink-0 overflow-hidden border", activeImage === idx ? "border-black" : "border-transparent")}>
              <Image src={img.url} alt={img.alt || ""} fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="md:sticky md:top-24 self-start">
        <p className="text-xs tracking-[0.2em] text-zinc-500 mb-2">{product.category_slug.toUpperCase()}</p>
        <h1 className="text-2xl font-light tracking-wide mb-2">{product.name.toUpperCase()}</h1>
        <p className="text-sm text-zinc-500 mb-4">{product.short_description}</p>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-xl font-medium">{formatMAD(product.price)}</span>
          {product.compare_at_price && <span className="text-sm text-zinc-400 line-through">{formatMAD(product.compare_at_price)}</span>}
        </div>

        {/* Color */}
        {product.variants[0]?.color && (
          <div className="mb-6">
            <p className="text-xs tracking-[0.2em] mb-2">COULEUR: <span className="font-medium">{product.variants[0].color}</span></p>
          </div>
        )}

        {/* Sizes */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs tracking-[0.2em]">TAILLE</p>
            <button className="text-xs underline underline-offset-4">GUIDE DES TAILLES</button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {product.variants.map(v => (
              <button
                key={v.id}
                onClick={() => setSelectedSize(v.size || "")}
                disabled={v.stock === 0}
                className={cn(
                  "h-11 border text-sm transition-colors",
                  selectedSize === v.size ? "bg-black text-white border-black" : "border-zinc-200 hover:border-black bg-white",
                  v.stock === 0 && "opacity-30 cursor-not-allowed line-through"
                )}
              >
                {v.size}
              </button>
            ))}
          </div>
          {selectedVariant && selectedVariant.stock < 5 && selectedVariant.stock > 0 && (
            <p className="text-xs text-amber-600 mt-2">Plus que {selectedVariant.stock} en stock</p>
          )}
        </div>

        {/* Quantity */}
        <div className="flex gap-4 mb-6">
          <div className="flex border border-zinc-200">
            <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-11 h-11 flex items-center justify-center hover:bg-zinc-50">−</button>
            <span className="w-11 h-11 flex items-center justify-center text-sm border-x border-zinc-200">{quantity}</span>
            <button onClick={() => setQuantity(q => q+1)} className="w-11 h-11 flex items-center justify-center hover:bg-zinc-50">+</button>
          </div>
          <button onClick={() => toggle(product.id)} className={cn("w-11 h-11 border flex items-center justify-center", isWishlisted ? "bg-black text-white border-black" : "border-zinc-200 hover:border-black")}>
            <Heart size={16} className={isWishlisted ? "fill-white" : ""} />
          </button>
        </div>

        <div className="space-y-3">
          <Button onClick={handleAddToCart} className="w-full h-12 tracking-[0.2em] text-xs rounded-none">
            AJOUTER AU PANIER
          </Button>
          <Link href="/checkout" onClick={handleAddToCart} className="block">
            <Button variant="outline" className="w-full h-12 tracking-[0.2em] text-xs rounded-none">
              ACHETER MAINTENANT
            </Button>
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full h-11 border border-[#25D366] text-[#25D366] text-xs tracking-[0.2em] hover:bg-[#25D366] hover:text-white transition-colors">
            CONTACTER VIA WHATSAPP
          </a>
        </div>

        <div className="mt-8 text-xs text-zinc-500 space-y-2 border-t border-zinc-200 pt-6">
          <p>• Livraison 2-4 jours • Paiement à la livraison</p>
          <p>• Retours gratuits sous 14 jours</p>
          <p>• SKU: {product.sku}</p>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 p-3 flex gap-3 md:hidden z-30">
        <Button onClick={handleAddToCart} className="flex-1 h-11 tracking-widest text-xs rounded-none">AJOUTER</Button>
        <a href={whatsappUrl} target="_blank" className="px-4 h-11 border border-zinc-200 flex items-center text-xs tracking-widest">WHATSAPP</a>
      </div>
    </div>
  )
}
