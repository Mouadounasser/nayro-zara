"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Heart } from "lucide-react"
import type { Product } from "@/lib/types"
import { formatMAD } from "@/lib/utils"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"

export function ProductCard({ product }: { product: Product }) {
  const [hover, setHover] = useState(false)
  const [showSizes, setShowSizes] = useState(false)
  const { has, toggle } = useWishlist()
  const { addItem } = useCart()
  const isWishlisted = has(product.id)

  const primaryImage = product.images[0]?.url
  const secondImage = product.images[1]?.url

  const handleQuickAdd = (e: React.MouseEvent, size: string, variantId?: string) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      variantId,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compare_at_price: product.compare_at_price,
      image: primaryImage,
      size,
      color: product.variants.find(v => v.size === size)?.color || undefined,
      quantity: 1,
      sku: product.sku,
    })
    setShowSizes(false)
  }

  return (
    <div className="group relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setShowSizes(false)}}>
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f3f3f0]">
          {primaryImage && (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className={cn("object-cover transition-opacity duration-500", hover && secondImage ? "opacity-0" : "opacity-100")}
              sizes="(max-width: 768px) 50vw, 25vw"
              unoptimized
            />
          )}
          {secondImage && (
            <Image
              src={secondImage}
              alt={product.name}
              fill
              className={cn("object-cover transition-opacity duration-500", hover ? "opacity-100" : "opacity-0")}
              sizes="(max-width: 768px) 50vw, 25vw"
              unoptimized
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {product.is_new && <span className="bg-white text-black text-[10px] tracking-widest px-2 py-1">NEW</span>}
            {product.compare_at_price && <span className="bg-black text-white text-[10px] tracking-widest px-2 py-1">SALE</span>}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); toggle(product.id)}}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Wishlist"
          >
            <Heart size={14} className={cn(isWishlisted ? "fill-black stroke-black" : "stroke-black")} />
          </button>

          {/* Quick add bar */}
          <div className={cn("absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur p-2 transition-transform duration-300", showSizes ? "translate-y-0" : "translate-y-full group-hover:translate-y-0")}>
            {!showSizes ? (
              <button
                onClick={(e) => { e.preventDefault(); setShowSizes(true)}}
                className="w-full text-[11px] tracking-[0.2em] py-2 border border-black hover:bg-black hover:text-white transition-colors"
              >
                AJOUT RAPIDE
              </button>
            ) : (
              <div className="flex gap-1 justify-center flex-wrap">
                {product.variants.slice(0, 6).map(v => (
                  <button
                    key={v.id}
                    onClick={(e) => handleQuickAdd(e, v.size || "One Size", v.id)}
                    disabled={v.stock === 0}
                    className="w-8 h-8 text-xs border border-zinc-200 hover:border-black hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 space-y-1">
          <h3 className="text-xs tracking-wide leading-tight line-clamp-1">{product.name.toUpperCase()}</h3>
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium">{formatMAD(product.price)}</span>
            {product.compare_at_price && <span className="text-xs text-zinc-400 line-through">{formatMAD(product.compare_at_price)}</span>}
          </div>
          {product.variants[0]?.color && <p className="text-xs text-zinc-500">{product.variants[0].color}</p>}
        </div>
      </Link>
    </div>
  )
}
