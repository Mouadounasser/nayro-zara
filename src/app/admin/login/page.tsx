"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const supabase = createClient()
    if (!supabase) {
      setError("Configuration Supabase manquante")
      setLoading(false)
      return
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) {
      setError(error.message === "Invalid login credentials" ? "Email ou mot de passe incorrect" : error.message)
      setLoading(false)
      return
    }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()
    if (profile?.role !== "admin") {
      setError("Accès refusé — votre compte n'a pas le rôle admin")
      await supabase.auth.signOut()
      setLoading(false)
      return
    }
    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left - Brand */}
      <div className="hidden md:flex bg-black text-white flex-col justify-between p-12">
        <div>
          <Link href="/" className="text-2xl tracking-[0.4em] font-light">NAYRO</Link>
          <p className="text-xs tracking-[0.3em] opacity-50 mt-2">ADMINISTRATION</p>
        </div>
        <div>
          <h2 className="text-4xl font-light leading-tight tracking-wide">
            GÉREZ<br/>VOTRE<br/>BOUTIQUE
          </h2>
          <p className="text-sm opacity-60 mt-4 max-w-sm leading-relaxed">
            Produits, commandes, stocks, images et bannières — tout votre univers NAYRO en un seul endroit.
          </p>
        </div>
        <p className="text-xs opacity-30 tracking-widest">© {new Date().getFullYear()} NAYRO — MAROC</p>
      </div>

      {/* Right - Form */}
      <div className="bg-[#fdfcf8] flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-8">
            <Link href="/" className="text-2xl tracking-[0.4em]">NAYRO</Link>
            <p className="text-xs tracking-[0.2em] text-zinc-500 mt-1">ADMIN</p>
          </div>

          <div className="bg-white border border-zinc-200 p-8 md:p-10">
            <h1 className="text-xl font-light tracking-[0.2em]">CONNEXION</h1>
            <p className="text-xs text-zinc-500 mt-2 tracking-wide">Accès réservé à l’administration NAYRO</p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label className="text-xs tracking-[0.2em]">EMAIL</label>
                <div className="relative mt-2">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={e=> setEmail(e.target.value)}
                    placeholder="admin@nayro.ma"
                    className="pl-9 rounded-none h-11 text-sm"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-xs tracking-[0.2em]">MOT DE PASSE</label>
                  <a href="mailto:alanmald21@gmail.com?subject=NAYRO%20Admin%20Password%20Reset" className="text-xs underline underline-offset-4 text-zinc-500 hover:text-black">Mot de passe oublié ?</a>
                </div>
                <div className="relative mt-2">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={e=> setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="pl-9 pr-10 rounded-none h-11 text-sm"
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={()=> setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-black">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 flex gap-2">
                  <span>⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full rounded-none h-11 tracking-[0.2em] text-xs gap-2">
                {loading ? "CONNEXION..." : <>SE CONNECTER <ArrowRight size={14} /></>}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-100 text-xs text-zinc-500 leading-relaxed">
              <p>Accès sécurisé par Supabase Auth. Seuls les comptes avec <code className="bg-zinc-100 px-1">profiles.role = admin</code> peuvent accéder au tableau de bord.</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs tracking-[0.2em] underline underline-offset-4 hover:text-black">← RETOUR AU SITE</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
