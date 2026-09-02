import { createClient, isSupabaseConfigured } from "./supabase/server"
import { mockProducts } from "./mock-data"
import type { Product } from "./types"

// Fallback to mock data when Supabase not configured
// When Supabase is configured, fetch from DB

export async function getProducts(opts?: {
  category?: string
  audience?: string
  featured?: boolean
  isNew?: boolean
  bestseller?: boolean
  search?: string
  limit?: number
}): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    let filtered = [...mockProducts]
    if (opts?.audience) {
      const a = opts.audience.toLowerCase()
      filtered = filtered.filter(p => {
        const pa = (p as any).audience?.toLowerCase()
        // strict: only requested audience, but keep unisex visible in both for backward compat
        if (a === "men") return pa === "men" || pa === "unisex" || !pa
        if (a === "women") return pa === "women" || pa === "unisex" || !pa
        return pa === a
      })
    }
    if (opts?.category) {
      // category_slug is sub-category (sacs/accessories), not audience
      filtered = filtered.filter(p => p.category_slug === opts.category)
    }
    if (opts?.featured) filtered = filtered.filter(p => p.is_featured)
    if (opts?.isNew) filtered = filtered.filter(p => p.is_new)
    if (opts?.bestseller) filtered = filtered.filter(p => p.is_bestseller)
    if (opts?.search) {
      const q = opts.search.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category_slug.toLowerCase().includes(q)
      )
    }
    if (opts?.limit) filtered = filtered.slice(0, opts.limit)
    return filtered
  }

  try {
    const supabase = await createClient()
    if (!supabase) return mockProducts

    let query = supabase
      .from("products")
      .select(`
        *,
        product_images (id, product_id, url, alt, position),
        product_variants (id, product_id, size, color, color_hex, image_url, sku, stock, price_override, is_active)
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (opts?.audience) {
      const a = opts.audience.toLowerCase()
      // keep unisex visible in both for backward compat with existing data
      if (a === "men" || a === "women") query = query.in("audience", [a, "unisex"])
      else query = query.eq("audience", a)
    }
    if (opts?.category) query = query.eq("category_slug", opts.category)
    if (opts?.featured) query = query.eq("is_featured", true)
    if (opts?.isNew) query = query.eq("is_new", true)
    if (opts?.bestseller) query = query.eq("is_bestseller", true)
    if (opts?.limit) query = query.limit(opts.limit)
    if (opts?.search) {
      query = query.or(`name.ilike.%${opts.search}%,description.ilike.%${opts.search}%,sku.ilike.%${opts.search}%`)
    }

    const { data, error } = await query
    if (error || !data) {
      console.error("Supabase products fetch error", error)
      return mockProducts
    }

    return data.map((p: any) => ({
      ...p,
      images: (p.product_images || []).sort((a: any, b: any) => a.position - b.position),
      variants: p.product_variants || [],
    }))
  } catch (e) {
    console.error(e)
    return mockProducts
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return mockProducts.find(p => p.slug === slug) || null
  }
  try {
    const supabase = await createClient()
    if (!supabase) return mockProducts.find(p => p.slug === slug) || null
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_images (id, product_id, url, alt, position),
        product_variants (id, product_id, size, color, color_hex, image_url, sku, stock, price_override, is_active)
      `)
      .eq("slug", slug)
      .single()
    if (error || !data) return mockProducts.find(p => p.slug === slug) || null
    return {
      ...data,
      images: (data.product_images || []).sort((a: any, b: any) => a.position - b.position),
      variants: data.product_variants || [],
    }
  } catch {
    return mockProducts.find(p => p.slug === slug) || null
  }
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await getProducts({ category: product.category_slug, limit: 10 })
  return products.filter(p => p.id !== product.id).slice(0, limit)
}
