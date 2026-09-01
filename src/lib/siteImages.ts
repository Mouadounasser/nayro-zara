import { createClient, isSupabaseConfigured } from "./supabase/server"

export type SiteImage = {
  id: string
  key: string
  label: string
  description: string | null
  recommended_size: string
  url: string
  alt: string | null
  category: string
  position: number
}

export async function getSiteImages(): Promise<Record<string, SiteImage>> {
  if (!isSupabaseConfigured()) return {}
  try {
    const supabase = await createClient()
    if (!supabase) return {}
    const { data } = await supabase.from("site_images").select("*").order("position")
    const map: Record<string, SiteImage> = {}
    for (const img of (data as SiteImage[]) || []) {
      map[img.key] = img
    }
    return map
  } catch {
    return {}
  }
}

export async function getSiteImage(key: string, fallback: string): Promise<string> {
  const map = await getSiteImages()
  return map[key]?.url || fallback
}
