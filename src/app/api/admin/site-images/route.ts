import { NextRequest, NextResponse } from "next/server"
import { createServiceClient, createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ images: [] })
  const { data } = await supabase.from("site_images").select("*").order("position")
  return NextResponse.json({ images: data || [] })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = createServiceClient() || await createClient()
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 400 })
  const { data, error } = await supabase.from("site_images").insert({
    key: body.key,
    label: body.label,
    description: body.description,
    recommended_size: body.recommended_size,
    url: body.url,
    alt: body.alt,
    category: body.category,
    position: body.position || 0,
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
