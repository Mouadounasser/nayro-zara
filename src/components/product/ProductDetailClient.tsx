"use client"
import { useState, useMemo, useEffect } from "react"
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
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const { toast } = useToast()

  // Unique colors from variants
  const colors = useMemo(() => {
    const map = new Map<string, { name: string; hex: string | null; image_url: string | null }>()
    for (const v of product.variants) {
      if (!v.color || map.has(v.color)) continue
      map.set(v.color, { name: v.color, hex: (v as any).color_hex || null, image_url: (v as any).image_url || null })
    }
    return Array.from(map.values())
  }, [product.variants])

  const sizes = useMemo(() => Array.from(new Set(product.variants.map(v => v.size).filter(Boolean))) as string[], [product.variants])

  // Auto-select first active variant
  useEffect(() => {
    const firstActive = product.variants.find(v => (v as any).is_active !== false && v.stock > 0) || product.variants[0]
    if (firstActive) {
      if (!selectedColor && firstActive.color) setSelectedColor(firstActive.color)
      if (!selectedSize && firstActive.size) setSelectedSize(firstActive.size)
    }
  }, [product.variants])

  // Find selected variant (by color + size)
  const selectedVariant = useMemo(() => {
    let v = product.variants
    if (selectedColor) v = v.filter(x => x.color === selectedColor)
    if (selectedSize) v = v.filter(x => x.size === selectedSize)
    return v[0] || product.variants.find(x => x.color === selectedColor) || product.variants.find(x => x.size === selectedSize) || product.variants[0]
  }, [product.variants, selectedColor, selectedSize])

  // When variant changes, switch image to variant's image if exists
  useEffect(() => {
    if (selectedVariant && (selectedVariant as any).image_url) {
      const url = (selectedVariant as any).image_url
      const idx = product.images.findIndex(i => i.url === url)
      if (idx !== -1) setActiveImage(idx)
    }
  }, [selectedVariant, product.images])

  const isWishlisted = has(product.id)

  const handleAddToCart = () => {
    if (sizes.length > 1 && !selectedSize) { toast("Veuillez sélectionner une taille", "error"); return }
    if (colors.length > 1 && !selectedColor) { toast("Veuillez sélectionner une couleur", "error"); return }
    const variant = selectedVariant
    if (!variant || (variant as any).is_active === false) { toast("Variante désactivée", "error"); return }
    if (variant.stock === 0) { toast("Rupture de stock", "error"); return }
    addItem({
      productId: product.id,
      variantId: variant?.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compare_at_price: product.compare_at_price,
      image: (variant as any).image_url || product.images[activeImage]?.url || product.images[0]?.url || "",
      size: variant.size || undefined,
      color: variant.color || undefined,
      quantity,
      sku: variant?.sku || product.sku,
    })
    toast(`Ajouté au panier — ${variant.color || ""} ${variant.size || ""}`, "success")
  }

  const whatsappMessage = encodeURIComponent(
    `Salam NAYRO 👋%0AJe veux commander:%0A- ${product.name} (${selectedVariant?.sku || product.sku})%0A- Couleur: ${selectedVariant?.color || "-"}%0A- Taille: ${selectedVariant?.size || "-"} x${quantity} = ${formatMAD((product.price) * quantity)}%0A%0AMerci de confirmer dispo + livraison 🙏`
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  // Main display image: variant image overrides gallery if exists and not in gallery
  const variantImageUrl = (selectedVariant as any)?.image_url
  const variantImageInGallery = variantImageUrl ? product.images.findIndex(i => i.url === variantImageUrl) !== -1 : false
  const mainImageUrl = variantImageUrl && !variantImageInGallery ? variantImageUrl : product.images[activeImage]?.url
  const mainImageAlt = variantImageUrl && !variantImageInGallery ? `${product.name} — ${selectedVariant?.color}` : product.images[activeImage]?.alt

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Gallery — smooth color switch */}
      <div className="space-y-4">
        <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden border border-zinc-100">
          {mainImageUrl && (
            <Image key={mainImageUrl} src={mainImageUrl} alt={mainImageAlt || product.name} fill className="object-cover transition-opacity duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]" unoptimized priority />
          )}
          {selectedVariant && (selectedVariant as any).image_url && (
            <span className="absolute bottom-3 left-3 bg-black text-white text-[11px] tracking-widest px-2 py-1"> {selectedVariant.color} </span>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {/* Variant image as first thumb if not in gallery */}
          {variantImageUrl && !variantImageInGallery && (
            <button onClick={() => {}} className="relative w-20 h-24 bg-zinc-100 shrink-0 overflow-hidden border border-black">
              <Image src={variantImageUrl} alt={selectedVariant?.color || ""} fill className="object-cover" unoptimized />
            </button>
          )}
          {product.images.map((img, idx) => (
            <button key={img.id} onClick={() => setActiveImage(idx)} className={cn("relative w-20 h-24 bg-zinc-100 shrink-0 overflow-hidden border", activeImage === idx && !variantImageUrl || (variantImageInGallery && variantImageUrl && product.images[idx].url === variantImageUrl) ? "border-black" : "border-transparent")}>
              <Image src={img.url} alt={img.alt || ""} fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
        {product.images.length > 1 && <p className="text-[11px] text-zinc-500">Sélectionnez une couleur pour voir son image — ex: Bleu → sac bleu, Noir → sac noir.</p>}
      </div>

      {/* Info */}
      <div className="md:sticky md:top-24 self-start">
        <p className="text-xs tracking-[0.2em] text-zinc-500 mb-2">{product.category_slug.toUpperCase()} {(product as any).audience ? `• ${(product as any).audience.toUpperCase()}` : ""}</p>
        <h1 className="text-2xl font-light tracking-wide mb-2">{product.name.toUpperCase()}</h1>
        <p className="text-sm text-zinc-500 mb-4">{product.short_description}</p>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-xl font-medium">{formatMAD(product.price)}</span>
          {product.compare_at_price && <span className="text-sm text-zinc-400 line-through">{formatMAD(product.compare_at_price)}</span>}
          {selectedVariant && (selectedVariant.stock < 5 && selectedVariant.stock > 0) && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1">Plus que {selectedVariant.stock} en stock</span>}
          {selectedVariant && selectedVariant.stock === 0 && <span className="text-xs bg-red-100 text-red-700 px-2 py-1">RUPTURE</span>}
        </div>

        {/* Color — image per color */}
        {colors.length > 0 && (
          <div className="mb-6">
            <p className="text-xs tracking-[0.2em] mb-3">COULEUR: <span className="font-medium">{selectedColor || selectedVariant?.color}</span> {selectedVariant && (selectedVariant as any).color_hex && <span className="inline-block w-3 h-3 rounded-full border align-middle ml-1" style={{background: (selectedVariant as any).color_hex}} />}</p>
            <div className="flex flex-wrap gap-3">
              {colors.map(c => {
                const active = selectedColor === c.name
                const variantForColor = product.variants.find(v => v.color === c.name)
                const disabled = variantForColor && ((variantForColor as any).is_active === false || variantForColor.stock === 0)
                return (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedColor(c.name)
                      // if variant has image, switch gallery
                      const v = product.variants.find(v => v.color === c.name)
                      if (v && (v as any).image_url) {
                        const idx = product.images.findIndex(i => i.url === (v as any).image_url)
                        if (idx !== -1) setActiveImage(idx)
                      }
                      // also set size to available size for that color
                      const vSize = product.variants.find(v => v.color === c.name)?.size
                      if (vSize) setSelectedSize(vSize)
                    }}
                    disabled={!!disabled}
                    className={cn(
                      "group relative w-16 h-16 border-2 overflow-hidden bg-zinc-100 flex flex-col items-center justify-center",
                      active ? "border-black" : "border-zinc-200 hover:border-zinc-400",
                      disabled && "opacity-40 cursor-not-allowed"
                    )}
                    title={c.name}
                  >
                    {c.image_url ? (
                      <Image src={c.image_url} alt={c.name} fill className="object-cover" unoptimized />
                    ) : (
                      <span className="w-8 h-8 rounded-full border border-zinc-200" style={{background: c.hex || "#0a0a0a"}} />
                    )}
                    {c.image_url && <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[9px] tracking-widest py-0.5 text-center">{c.name.toUpperCase()}</span>}
                    {!c.image_url && <span className="text-[10px] tracking-widest mt-1">{c.name}</span>}
                    {active && <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full border border-white" />}
                  </button>
                )
              })}
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">Cliquez sur une couleur — l’image principale change (ex: upload 1 image bleue + 1 noire, le client voit la bonne).</p>
          </div>
        )}

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs tracking-[0.2em]">TAILLE</p>
              <button className="text-xs underline underline-offset-4">GUIDE DES TAILLES</button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {sizes.map(s => {
                const variantForSize = product.variants.find(v => v.size === s && (!selectedColor || v.color === selectedColor)) || product.variants.find(v => v.size === s)
                const disabled = !variantForSize || variantForSize.stock === 0 || (variantForSize as any).is_active === false
                const active = selectedSize === s
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    disabled={disabled}
                    className={cn(
                      "h-11 border text-sm transition-colors",
                      active ? "bg-black text-white border-black" : "border-zinc-200 hover:border-black bg-white",
                      disabled && "opacity-30 cursor-not-allowed line-through"
                    )}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        )}

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
            AJOUTER AU PANIER — {selectedVariant?.color ? selectedVariant.color.toUpperCase() : ""}
          </Button>
          <Link href="/checkout" onClick={handleAddToCart} className="block">
            <Button variant="outline" className="w-full h-12 tracking-[0.2em] text-xs rounded-none">
              ACHETER MAINTENANT
            </Button>
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full h-11 border border-[#25D366] text-[#25D366] text-xs tracking-[0.2em] hover:bg-[#25D366] hover:text-white transition-colors">
            COMMANDER VIA WHATSAPP
          </a>
          <p className="text-[11px] text-center text-zinc-500">Message prérempli avec couleur/taille/qté — vous confirmez sur WhatsApp 06 89 36 35 96</p>
        </div>

        <div className="mt-8 text-xs text-zinc-500 space-y-2 border-t border-zinc-200 pt-6">
          <p>• Livraison 2-4 jours • Paiement à la livraison • 06 89 36 35 96</p>
          <p>• Retours gratuits sous 14 jours</p>
          <p>• SKU: {selectedVariant?.sku || product.sku} {selectedVariant?.color ? `• ${selectedVariant.color}` : ""} { (product as any).audience ? `• ${(product as any).audience}` : ""}</p>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 p-3 flex gap-3 md:hidden z-30">
        <Button onClick={handleAddToCart} className="flex-1 h-11 tracking-widest text-xs rounded-none">AJOUTER — {selectedVariant?.color || ""}</Button>
        <a href={whatsappUrl} target="_blank" className="px-4 h-11 bg-[#25D366] text-white flex items-center text-xs tracking-widest">WHATSAPP</a>
      </div>
    </div>
  )
}
