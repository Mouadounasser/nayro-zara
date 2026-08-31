import { NextRequest, NextResponse } from "next/server"
import { createServiceClient, createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createServiceClient() || await createClient()
  if (!supabase) return NextResponse.json({ categories: [] })
  const { data } = await supabase.from("categories").select("*").order("position")
  return NextResponse.json({ categories: data || [] })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = createServiceClient() || await createClient()
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 400 })
  const { data, error } = await supabase.from("categories").insert({
    slug: body.slug,
    name: body.name,
    description: body.description,
    position: body.position || 0,
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
