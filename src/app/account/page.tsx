import Link from "next/link"

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-12">
      <h1 className="text-2xl font-light tracking-[0.2em] mb-8">MON COMPTE</h1>
      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <nav className="space-y-2 text-sm">
          <Link href="/account" className="block py-2 px-3 bg-black text-white tracking-widest">PROFIL</Link>
          <Link href="/account/orders" className="block py-2 px-3 border border-zinc-200 hover:bg-zinc-50">COMMANDES</Link>
          <Link href="/wishlist" className="block py-2 px-3 border border-zinc-200 hover:bg-zinc-50">WISHLIST</Link>
          <Link href="/account" className="block py-2 px-3 border border-zinc-200 hover:bg-zinc-50">ADRESSES</Link>
        </nav>
        <div className="bg-white border border-zinc-200 p-8">
          <h2 className="text-sm tracking-[0.2em] mb-6">PROFIL</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-xs tracking-widest">EMAIL</label>
              <input disabled placeholder="Connectez-vous via Supabase Auth" className="mt-1 w-full h-11 border border-zinc-200 px-4 bg-zinc-50 text-sm" />
            </div>
            <p className="text-xs text-zinc-500">Authentification via Supabase. Configurez NEXT_PUBLIC_SUPABASE_URL pour activer.</p>
            <div className="flex gap-3 pt-4">
              <Link href="/search" className="text-xs tracking-widest border border-black px-6 py-3 hover:bg-black hover:text-white">CONTINUER VOS ACHATS</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
