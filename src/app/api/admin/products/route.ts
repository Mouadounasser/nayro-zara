import { NextRequest, NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = createServiceClient() || await createClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and keys." }, { status: 400 })
  }
  if (!body.audience || !["men","women"].includes(body.audience)) {
    return NextResponse.json({ error: "Audience requis: Men ou Women" }, { status: 400 })
  }
  const { data: product, error } = await supabase.from("products").insert({
    slug: body.slug,
    name: body.name,
    description: body.description,
    short_description: body.short_description,
    price: body.price,
    compare_at_price: body.compare_at_price || null,
    sku: body.sku,
    category_slug: body.category_slug,
    audience: body.audience,
    primary_color: body.primary_color || null,
    primary_color_name: body.primary_color_name || null,
    is_active: body.is_active ?? true,
    is_featured: body.is_featured ?? false,
    is_new: body.is_new ?? false,
    is_bestseller: body.is_bestseller ?? false,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Variants — support multi images per color
  if (body.variants && Array.isArray(body.variants) && body.variants.length > 0) {
    const variants = body.variants.map((v: any) => ({
      product_id: product.id,
      size: v.size,
      color: v.color,
      color_hex: v.color_hex || null,
      image_url: v.image_url || (Array.isArray(v.image_urls) && v.image_urls[0]) || null,
      image_urls: Array.isArray(v.image_urls) ? v.image_urls : (v.image_url ? [v.image_url] : []),
      sku: v.sku || `${body.sku}-${v.size || v.color || "var"}`,
      stock: Number(v.stock) || 0,
      is_active: v.is_active ?? true,
    }))
    const { error: varErr } = await supabase.from("product_variants").insert(variants)
    if (varErr) console.error("Variant insert error", varErr)
  } else {
    // Product without variants (no size/color) — single base variant
    const firstImg = Array.isArray(body.images) ? body.images[0]?.url : body.image_urls?.[0]
    await supabase.from("product_variants").insert({
      product_id: product.id,
      size: null,
      color: null,
      color_hex: null,
      image_url: firstImg || null,
      image_urls: firstImg ? [firstImg] : [],
      sku: body.sku,
      stock: 10,
      is_active: true,
    })
  }

  // Images: support both legacy string[] and new {url,color,color_hex}[] 
  const rawImages: any[] = body.images || body.image_urls || []
  if (rawImages.length > 0) {
    const images = rawImages.map((it: any, idx: number) => {
      const url = typeof it === "string" ? it : it.url
      const color = typeof it === "string" ? null : (it.color || null)
      const color_hex = typeof it === "string" ? null : (it.color_hex || null)
      return { product_id: product.id, url, alt: product.name, position: idx, color, color_hex }
    })
    await supabase.from("product_images").insert(images)
  } else {
    await supabase.from("product_images").insert({
      product_id: product.id,
      url: `https://picsum.photos/seed/${product.slug}/800/1000`,
      alt: product.name,
      position: 0,
    })
  }

  return NextResponse.json(product)
}

export async function GET() {
  const supabase = (createServiceClient() || await createClient())
  if (!supabase) return NextResponse.json({ products: [] })
  const { data } = await supabase.from("products").select("*, product_images(*), product_variants(*)").order("created_at", { ascending: false })
  return NextResponse.json({ products: data || [] })
}
