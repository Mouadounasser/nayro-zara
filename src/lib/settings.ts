import { isSupabaseConfigured, createClient } from "./supabase/server"
import { DEFAULT_SETTINGS } from "./constants"
import type { StoreSettings } from "./types"

export async function getSettings(): Promise<StoreSettings> {
  if (!isSupabaseConfigured()) return DEFAULT_SETTINGS
  try {
    const supabase = await createClient()
    if (!supabase) return DEFAULT_SETTINGS
    const { data } = await supabase.from("settings").select("*").limit(1).single()
    if (!data) return DEFAULT_SETTINGS
    return {
      store_name: data.store_name ?? DEFAULT_SETTINGS.store_name,
      whatsapp_number: data.whatsapp_number ?? DEFAULT_SETTINGS.whatsapp_number,
      instagram: data.instagram ?? DEFAULT_SETTINGS.instagram,
      delivery_fee: Number(data.delivery_fee ?? DEFAULT_SETTINGS.delivery_fee),
      free_delivery_threshold: Number(data.free_delivery_threshold ?? DEFAULT_SETTINGS.free_delivery_threshold),
      cod_enabled: data.cod_enabled ?? DEFAULT_SETTINGS.cod_enabled,
      currency: data.currency ?? DEFAULT_SETTINGS.currency,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}
