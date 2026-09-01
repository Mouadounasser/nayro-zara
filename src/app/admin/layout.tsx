import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { AdminLogout } from "@/components/admin/AdminLogout"

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Allow login page without auth
  // Check if current path is login via headers? Instead, we check auth here and allow login to render without layout
  // For simplicity, if no supabase, allow
  const supabase = await createClient()
  if (!supabase) {
    return (
      <div className="min-h-screen bg-[#f3f3f0] flex">
        <aside className="w-[240px] bg-black text-white p-6 hidden md:flex flex-col">
          <Link href="/admin" className="text-xl tracking-[0.3em] mb-8">NAYRO ADMIN</Link>
          <nav className="space-y-1 text-sm">
            <Link href="/admin" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">DASHBOARD</Link>
            <Link href="/admin/products" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">PRODUITS</Link>
            <Link href="/admin/orders" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">COMMANDES</Link>
            <Link href="/admin/banners" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">BANNIÈRES</Link>
            <Link href="/admin/categories" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">CATÉGORIES</Link>
            <Link href="/admin/customers" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">CLIENTS</Link>
            <Link href="/admin/settings" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">PARAMÈTRES</Link>
          </nav>
        </aside>
        <div className="flex-1 p-4 md:p-8">{children}</div>
      </div>
    )
  }

  const { data: { user } } = await supabase.auth.getUser()

  // If no user, we still render but client will redirect via middleware? For server, we allow rendering but show login prompt
  // To enforce, we check current route via headers would be complex, so we handle auth in a client component
  // Instead, we render layout with logout if user exists, and let pages handle auth

  return (
    <div className="min-h-screen bg-[#f3f3f0] flex">
      <aside className="w-[240px] bg-black text-white p-6 hidden md:flex flex-col">
        <Link href="/admin" className="text-xl tracking-[0.3em] mb-8">NAYRO ADMIN</Link>
        <nav className="space-y-1 text-sm">
          <Link href="/admin" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">DASHBOARD</Link>
          <Link href="/admin/products" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">PRODUITS</Link>
          <Link href="/admin/orders" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">COMMANDES</Link>
          <Link href="/admin/banners" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">BANNIÈRES</Link>
          <Link href="/admin/categories" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">CATÉGORIES</Link>
          <Link href="/admin/customers" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">CLIENTS</Link>
          <Link href="/admin/settings" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">PARAMÈTRES</Link>
          <Link href="/" className="block py-2 px-3 mt-8 border border-white/20 text-center text-xs tracking-widest">VOIR LE SITE</Link>
          <div className="mt-auto pt-8 border-t border-white/10">
            {user ? (
              <div className="space-y-2">
                <p className="text-xs text-white/60 truncate">{user.email}</p>
                <AdminLogout />
              </div>
            ) : (
              <Link href="/admin/login" className="block text-xs bg-white text-black text-center py-2 tracking-widest">SE CONNECTER</Link>
            )}
          </div>
        </nav>
      </aside>
      <div className="flex-1 p-4 md:p-8">
        {children}
      </div>
    </div>
  )
}
