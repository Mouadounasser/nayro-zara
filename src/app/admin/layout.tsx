import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f3f0] flex">
      <aside className="w-[240px] bg-black text-white p-6 hidden md:flex flex-col">
        <Link href="/admin" className="text-xl tracking-[0.3em] mb-8">NAYRO ADMIN</Link>
        <nav className="space-y-1 text-sm">
          <Link href="/admin" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">DASHBOARD</Link>
          <Link href="/admin/products" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">PRODUITS</Link>
          <Link href="/admin/orders" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">COMMANDES</Link>
          <Link href="/admin/categories" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">CATÉGORIES</Link>
          <Link href="/admin/customers" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">CLIENTS</Link>
          <Link href="/admin/settings" className="block py-2 px-3 hover:bg-white/10 tracking-widest text-xs">PARAMÈTRES</Link>
          <Link href="/" className="block py-2 px-3 mt-8 border border-white/20 text-center text-xs tracking-widest">VOIR LE SITE</Link>
        </nav>
      </aside>
      <div className="flex-1 p-4 md:p-8">
        {children}
      </div>
    </div>
  )
}
