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
  const [showOptions, setShowOptions] = useState(false)
  const { has, toggle } = useWishlist()
  const { addItem } = useCart()
  const isWishlisted = has(product.id)

  const primaryImage = product.images[0]?.url
  const secondImage = product.images[1]?.url
  const hasMultipleColors = new Set(product.variants.map(v=>v.color).filter(Boolean)).size > 1
  const hasSizes = product.variants.some(v=> v.size && v.size !== "One Size")

  const handleQuickAdd = (e: React.MouseEvent, variantId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const v = product.variants.find(x=>x.id===variantId) || product.variants[0]
    if (!v || (v as any).is_active===false || v.stock===0) return
    const price = (v as any).price_override ?? product.price
    addItem({
      productId: product.id,
      variantId: v.id,
      slug: product.slug,
      name: product.name,
      price,
      compare_at_price: product.compare_at_price,
      image: (v as any).image_urls?.[0] || (v as any).image_url || primaryImage || "",
      size: v.size || undefined,
      color: v.color || undefined,
      quantity: 1,
      sku: v.sku || product.sku,
    })
    setShowOptions(false)
  }

  return (
    <div className="group relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setShowOptions(false)}}>
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f3f3f0]">
        <Link href={`/product/${product.slug}`} className="absolute inset-0">
          {primaryImage && (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className={cn("object-cover transition-opacity duration-500", hover && secondImage ? "opacity-0" : "opacity-100")}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          )}
          {secondImage && (
            <Image
              src={secondImage}
              alt={product.name}
              fill
              className={cn("object-cover transition-opacity duration-500", hover ? "opacity-100" : "opacity-0")}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1 pointer-events-none">
          {product.is_new && <span className="bg-white text-black text-[10px] tracking-widest px-2 py-1">NEW</span>}
          {product.compare_at_price && <span className="bg-black text-white text-[10px] tracking-widest px-2 py-1">SALE</span>}
        </div>

        {/* Wishlist — 44px */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product.id)}}
          className="absolute top-2 right-2 w-11 h-11 min-h-[44px] min-w-[44px] bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Wishlist"
        >
          <Heart size={16} className={cn(isWishlisted ? "fill-black stroke-black" : "stroke-black")} />
        </button>

        {/* Quick add bar — always visible on mobile, hover on desktop */}
        <div className={cn("absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur p-2 transition-transform duration-300", showOptions ? "translate-y-0" : "translate-y-0 md:translate-y-full md:group-hover:translate-y-0")}>
          {!showOptions ? (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowOptions(true)}}
              className="w-full text-[11px] tracking-[0.2em] py-3 border border-black hover:bg-black hover:text-white transition-colors min-h-[44px]"
            >
              AJOUT RAPIDE
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-1 justify-center flex-wrap">
                {product.variants.slice(0, 6).map(v => {
                  const label = hasSizes ? (v.size || "One Size") : (v.color || v.size || "One Size")
                  const disabled = v.stock === 0 || (v as any).is_active===false
                  return (
                    <button
                      key={v.id}
                      onClick={(e) => handleQuickAdd(e, v.id)}
                      disabled={disabled}
                      className="min-w-[44px] min-h-[44px] px-2 text-xs border border-zinc-200 hover:border-black hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                      title={`${v.color || ""} ${v.size || ""}`}
                    >
                      {(v as any).color_hex && <span className="w-3 h-3 rounded-full border border-zinc-200" style={{background: (v as any).color_hex}} />}
                      {label}
                    </button>
                  )
                })}
              </div>
              <button onClick={(e)=> {e.preventDefault(); setShowOptions(false)}} className="w-full text-[10px] tracking-widest text-zinc-500">FERMER</button>
            </div>
          )}
        </div>
      </div>

      <Link href={`/product/${product.slug}`} className="block pt-3 space-y-1">
        <h3 className="text-xs tracking-wide leading-tight line-clamp-1">{product.name.toUpperCase()}</h3>
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium">{formatMAD(product.price)}</span>
          {product.compare_at_price && <span className="text-xs text-zinc-400 line-through">{formatMAD(product.compare_at_price)}</span>}
        </div>
        <div className="flex items-center gap-1">
          {hasMultipleColors ? (
            <div className="flex gap-1">
              {Array.from(new Set(product.variants.map(v=> v.color).filter(Boolean))).slice(0,5).map(c=> {
                const hex = product.variants.find(v=>v.color===c)?.color_hex || "#0a0a0a"
                return <span key={c} className="w-3 h-3 rounded-full border border-zinc-200" style={{background: hex as string}} title={c as string} />
              })}
              {product.variants.filter(v=>v.color).length>5 && <span className="text-[10px] text-zinc-500">+{product.variants.length-5}</span>}
            </div>
          ) : product.variants[0]?.color ? <p className="text-xs text-zinc-500">{product.variants[0].color}</p> : null}
          <span className="text-[11px] text-zinc-400 ml-auto">{(product as any).audience === "men" ? "Men" : (product as any).audience === "women" ? "Women" : ""}</span>
        </div>
      </Link>
    </div>
  )
}
