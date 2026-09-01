import { BannerManager } from "@/components/admin/BannerManager"

export default function BannersPage() {
  return (
    <div>
      <h1 className="text-xl tracking-[0.2em] mb-2">BANNIÈRES & HERO CAROUSEL</h1>
      <p className="text-xs text-zinc-500 mb-6">Gérez le carousel HERO de la homepage. <b>Chaque bannière ACTIVE = 1 image/slide</b> qui tourne toutes les 3 secondes. Ajoutez 1 image = fixe, 2 images = 6s boucle, 5 images = 15s boucle. Upload vers Supabase Storage (bucket products) ou URL externe. Seules les bannières ACTIVES sont diffusées.</p>
      <BannerManager />
    </div>
  )
}
