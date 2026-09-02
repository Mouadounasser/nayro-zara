import { NextRequest, NextResponse } from "next/server"
import { createServiceClient, createClient } from "@/lib/supabase/server"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const supabase = createServiceClient() || await createClient()
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 400 })
  const { data, error } = await supabase.from("product_images").update({
    color: body.color || null,
    color_hex: body.color_hex || null,
  }).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient() || await createClient()
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 400 })
  // try to delete storage file too (best effort)
  const { data: img } = await supabase.from("product_images").select("url").eq("id", id).single()
  if (img?.url) {
    try {
      const path = new URL(img.url).pathname.split("/products/")[1]
      if (path) await supabase.storage.from("products").remove([decodeURIComponent(path)])
    } catch {}
  }
  const { error } = await supabase.from("product_images").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
