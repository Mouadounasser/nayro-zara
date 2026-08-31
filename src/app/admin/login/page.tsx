"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("alanmald21@gmail.com")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const supabase = createClient()
    if (!supabase) {
      setError("Supabase not configured")
      setLoading(false)
      return
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    // Check profile role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()
    if (profile?.role !== "admin") {
      setError("Accès refusé: vous n'êtes pas admin. Contactez le propriétaire.")
      await supabase.auth.signOut()
      setLoading(false)
      return
    }
    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f3f3f0] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl tracking-[0.3em]">NAYRO</h1>
          <p className="text-xs tracking-[0.2em] text-zinc-500 mt-2">ADMIN LOGIN</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs tracking-widest">EMAIL</label>
            <Input value={email} onChange={e=> setEmail(e.target.value)} placeholder="admin@nayro.ma" className="mt-1 rounded-none" required />
          </div>
          <div>
            <label className="text-xs tracking-widest">MOT DE PASSE</label>
            <Input type="password" value={password} onChange={e=> setPassword(e.target.value)} placeholder="••••••••" className="mt-1 rounded-none" required />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 p-3">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full rounded-none tracking-widest text-xs h-11">
            {loading ? "CONNEXION..." : "SE CONNECTER"}
          </Button>
        </form>

        <div className="mt-6 text-xs text-zinc-500 space-y-2">
          <p><strong>Compte admin créé:</strong></p>
          <p className="font-mono bg-zinc-50 border p-2">alanmald21@gmail.com<br/>NayroAdmin2026!</p>
          <p>Ce compte a le rôle <code>admin</code> dans Supabase <code>profiles</code> et peut gérer tous les produits, commandes, images, catégories.</p>
          <p>Changez le mot de passe après première connexion dans Supabase Auth.</p>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-xs underline tracking-widest">← RETOUR AU SITE</a>
        </div>
      </div>
    </div>
  )
}
