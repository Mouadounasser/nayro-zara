import { CATEGORIES } from "@/lib/constants"

export default function CategoriesPage() {
  return (
    <div>
      <h1 className="text-xl tracking-[0.2em] mb-6">CATÉGORIES</h1>
      <div className="bg-white border border-zinc-200">
        {CATEGORIES.map(c=> (
          <div key={c.slug} className="flex justify-between p-4 border-b last:border-0">
            <span className="text-sm tracking-widest">{c.name}</span>
            <span className="text-xs text-zinc-500">{c.slug}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
