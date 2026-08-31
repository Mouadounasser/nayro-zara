import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { DEFAULT_SETTINGS } from "@/lib/constants"

export async function GET() {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json(DEFAULT_SETTINGS)
  const { data } = await supabase.from("settings").select("*").limit(1).single()
  return NextResponse.json(data || DEFAULT_SETTINGS)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 400 })
  const { data, error } = await supabase.from("settings").update(body).eq("id", (await supabase.from("settings").select("id").limit(1).single()).data?.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
