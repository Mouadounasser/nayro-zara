"use client"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function AdminLogout() {
  const router = useRouter()
  const handleLogout = async () => {
    const supabase = createClient()
    if (supabase) await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }
  return (
    <button onClick={handleLogout} className="w-full text-xs bg-white/10 hover:bg-white/20 text-white py-2 tracking-widest border border-white/20">
      DÉCONNEXION
    </button>
  )
}
