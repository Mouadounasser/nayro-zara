import { NextRequest, NextResponse } from "next/server"
import { createServiceClient, createClient } from "@/lib/supabase/server"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const supabase = createServiceClient() || await createClient()
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 400 })
  const { data, error } = await supabase.from("banners").update({
    title: body.title,
    subtitle: body.subtitle,
    image_url: body.image_url,
    link: body.link,
    position: body.position,
    is_active: body.is_active,
  }).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient() || await createClient()
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 400 })
  const { error } = await supabase.from("banners").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
