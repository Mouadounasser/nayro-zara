import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and keys." }, { status: 400 })
  }
  const { data, error } = await supabase.from("products").insert({
    slug: body.slug,
    name: body.name,
    description: body.description,
    price: body.price,
    sku: body.sku,
    category_slug: body.category_slug,
    is_active: true,
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
