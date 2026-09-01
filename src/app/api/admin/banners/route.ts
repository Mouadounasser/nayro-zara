import { NextRequest, NextResponse } from "next/server"
import { createServiceClient, createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ banners: [] })
  const { data } = await supabase.from("banners").select("*").order("position")
  return NextResponse.json({ banners: data || [] })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = createServiceClient() || await createClient()
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 400 })
  const { data, error } = await supabase.from("banners").insert({
    title: body.title,
    subtitle: body.subtitle,
    image_url: body.image_url,
    link: body.link,
    position: body.position || 0,
    is_active: body.is_active ?? true,
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
