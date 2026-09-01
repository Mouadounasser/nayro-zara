import { createClient, isSupabaseConfigured } from "./supabase/server"

export type Banner = {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  link: string | null
  position: number
  is_active: boolean
}

export async function getBanners(): Promise<Banner[]> {
  if (!isSupabaseConfigured()) {
    return [
      {
        id: "1",
        title: "NAYRO",
        subtitle: "NOUVELLE COLLECTION 2026 — Discover the latest collection. Minimal. Modern. Crafted for Morocco.",
        image_url: "https://picsum.photos/seed/nayro-hero/1920/1080",
        link: "/shop",
        position: 0,
        is_active: true,
      },
      {
        id: "2",
        title: "L'ESSENCE DE L'HIVER",
        subtitle: "EDITORIAL",
        image_url: "https://picsum.photos/seed/nayro-editorial1/800/1000",
        link: "/shop?filter=new",
        position: 1,
        is_active: true,
      },
    ]
  }
  try {
    const supabase = await createClient()
    if (!supabase) throw new Error("no supabase")
    const { data } = await supabase.from("banners").select("*").eq("is_active", true).order("position")
    return (data as Banner[]) || []
  } catch {
    return []
  }
}
