import { NextRequest, NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient() || await createClient()
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 400 })
  const { data, error } = await supabase.from("products").select("*, product_images(*), product_variants(*)").eq("id", id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const supabase = createServiceClient() || await createClient()
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 400 })

  if (body.audience && !["men","women"].includes(body.audience)) {
    return NextResponse.json({ error: "Audience doit être Men ou Women" }, { status: 400 })
  }
  const { data, error } = await supabase.from("products").update({
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
    is_active: body.is_active,
    is_featured: body.is_featured,
    is_new: body.is_new,
    is_bestseller: body.is_bestseller,
    updated_at: new Date().toISOString(),
  }).eq("id", id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Handle variants if provided
  if (body.variants && Array.isArray(body.variants)) {
    // Delete existing and insert new for simplicity
    await supabase.from("product_variants").delete().eq("product_id", id)
    if (body.variants.length > 0) {
      const variants = body.variants.map((v: any) => ({
        product_id: id,
        size: v.size,
        color: v.color,
        color_hex: v.color_hex || null,
        image_url: v.image_url || null,
        sku: v.sku || `${body.sku}-${v.size}`,
        stock: Number(v.stock) || 0,
        price_override: v.price_override || null,
        is_active: v.is_active ?? true,
      }))
      await supabase.from("product_variants").insert(variants)
    }
  }

  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient() || await createClient()
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 400 })
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Duplicate
  const { id } = await params
  const body = await req.json()
  if (body.action === "duplicate") {
    const supabase = createServiceClient() || await createClient()
    if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 400 })
    const { data: orig } = await supabase.from("products").select("*, product_images(*), product_variants(*)").eq("id", id).single()
    if (!orig) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const newSlug = `${orig.slug}-copy-${Math.random().toString(36).slice(2,5)}`
    const newSku = `${orig.sku}-COPY`
    const { data: dup, error } = await supabase.from("products").insert({
      slug: newSlug,
      name: `${orig.name} (Copy)`,
      description: orig.description,
      short_description: orig.short_description,
      price: orig.price,
      compare_at_price: orig.compare_at_price,
      sku: newSku,
      category_slug: orig.category_slug,
      audience: orig.audience || "unisex",
      primary_color: orig.primary_color,
      primary_color_name: orig.primary_color_name,
      is_active: false,
      is_featured: orig.is_featured,
      is_new: orig.is_new,
      is_bestseller: false,
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    // Copy variants
    if (orig.product_variants?.length) {
      const variants = orig.product_variants.map((v: any) => ({
        product_id: dup.id,
        size: v.size,
        color: v.color,
        color_hex: v.color_hex,
        image_url: v.image_url,
        sku: `${newSku}-${v.size}`,
        stock: v.stock,
        is_active: v.is_active ?? true,
      }))
      await supabase.from("product_variants").insert(variants)
    }
    if (orig.product_images?.length) {
      const images = orig.product_images.map((img: any) => ({
        product_id: dup.id,
        url: img.url,
        alt: img.alt,
        position: img.position,
      }))
      await supabase.from("product_images").insert(images)
    }
    return NextResponse.json(dup)
  }
  // Toggle
  if (body.action === "toggle") {
    const supabase = createServiceClient() || await createClient()
    if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 400 })
    const { data, error } = await supabase.from("products").update({ [body.field]: body.value }).eq("id", id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }
  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
