import { BannerManager } from "@/components/admin/BannerManager"

export default function BannersPage() {
  return (
    <div>
      <h1 className="text-xl tracking-[0.2em] mb-2">BANNIÈRES & HERO</h1>
      <p className="text-xs text-zinc-500 mb-6">Gérez le HERO plein écran et les visuels éditoriaux de la homepage. Upload vers Supabase Storage (bucket products) ou URL externe. La première bannière active = HERO.</p>
      <BannerManager />
    </div>
  )
}
