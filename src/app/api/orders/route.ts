import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, city, address, notes, items, subtotal, delivery_fee, total } = body

    if (!name || !phone || !city || !address) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // If Supabase not configured, return mock success
    if (!supabase) {
      const order_number = `NAYRO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
      return NextResponse.json({ order_number, total, success: true })
    }

    const order_number = `NAYRO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

    // Create customer entry
    const { data: customer } = await supabase.from("customers").insert({
      full_name: name,
      phone,
    }).select("id").single()

    const { data: order, error } = await supabase.from("orders").insert({
      order_number,
      customer_id: customer?.id || null,
      status: "pending",
      payment_method: "cod",
      payment_status: "pending",
      subtotal: subtotal || 0,
      delivery_fee: delivery_fee || 0,
      total: total || 0,
      customer_name: name,
      phone,
      city,
      address,
      notes,
    }).select("id, order_number").single()

    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (items && order) {
      const orderItems = items.map((it: any) => ({
        order_id: order.id,
        product_id: it.productId,
        product_name: it.name,
        product_slug: it.slug,
        image: it.image,
        size: it.size,
        color: it.color,
        quantity: it.quantity,
        price: it.price,
      }))
      await supabase.from("order_items").insert(orderItems)
    }

    return NextResponse.json({ order_number: order.order_number, success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET() {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ orders: [] })
  const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(50)
  return NextResponse.json({ orders: data || [] })
}
