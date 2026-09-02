import { NextRequest, NextResponse } from "next/server"
import { createServiceClient, createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = createServiceClient() || await createClient()
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 400 })

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  const productId = formData.get("productId") as string | null
  const color = formData.get("color") as string | null
  const color_hex = formData.get("color_hex") as string | null

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`
  const path = productId ? `${productId}/${fileName}` : fileName

  const { error: uploadError } = await supabase.storage.from("products").upload(path, buffer, {
    contentType: file.type,
    upsert: true,
  })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(path)

  // If productId provided, also insert into product_images
  if (productId) {
    const { count } = await supabase.from("product_images").select("*", { count: "exact", head: true }).eq("product_id", productId)
    await supabase.from("product_images").insert({
      product_id: productId,
      url: publicUrl,
      alt: file.name,
      position: count || 0,
      color: color || null,
      color_hex: color_hex || null,
    })
  }

  return NextResponse.json({ url: publicUrl, path })
}
