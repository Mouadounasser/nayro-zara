import { CategoryManager } from "@/components/admin/CategoryManager"

export default function CategoriesPage() {
  return (
    <div>
      <h1 className="text-xl tracking-[0.2em] mb-6">CATÉGORIES</h1>
      <CategoryManager />
      <div className="mt-6 bg-amber-50 border border-amber-200 p-4 text-xs">
        <p>Les catégories sont liées aux produits via <code>category_slug</code>. Modifier une catégorie n’affecte pas les produits existants — mettez à jour les produits manuellement.</p>
      </div>
    </div>
  )
}
