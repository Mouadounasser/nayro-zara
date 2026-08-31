import { OrderManager } from "@/components/admin/OrderManager"

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-xl tracking-[0.2em] mb-2">COMMANDES</h1>
      <p className="text-xs text-zinc-500 mb-6">Gérez les commandes COD — changez le statut, filtrez, exportez. Les changements sont instantanés dans Supabase.</p>
      <OrderManager />
    </div>
  )
}
