import { NextRequest, NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = createServiceClient() || await createClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and keys." }, { status: 400 })
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
    audience: body.audience || "unisex",
    primary_color: body.primary_color || null,
    primary_color_name: body.primary_color_name || null,
    is_active: body.is_active ?? true,
    is_featured: body.is_featured ?? false,
    is_new: body.is_new ?? false,
    is_bestseller: body.is_bestseller ?? false,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Variants
  if (body.variants && Array.isArray(body.variants) && body.variants.length > 0) {
    const variants = body.variants.map((v: any) => ({
      product_id: product.id,
      size: v.size,
      color: v.color,
      color_hex: v.color_hex || null,
      sku: v.sku || `${body.sku}-${v.size}`,
      stock: Number(v.stock) || 0,
      is_active: v.is_active ?? true,
    }))
    const { error: varErr } = await supabase.from("product_variants").insert(variants)
    if (varErr) console.error("Variant insert error", varErr)
  } else {
    // Default variant
    await supabase.from("product_variants").insert({
      product_id: product.id,
      size: "M",
      color: body.primary_color_name || "Noir",
      color_hex: body.primary_color || "#0a0a0a",
      sku: `${body.sku}-M`,
      stock: 10,
      is_active: true,
    })
  }

  // Images: use provided URLs or placeholder
  if (body.image_urls && Array.isArray(body.image_urls) && body.image_urls.length > 0) {
    const images = body.image_urls.map((url: string, idx: number) => ({
      product_id: product.id,
      url,
      alt: product.name,
      position: idx,
    }))
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
