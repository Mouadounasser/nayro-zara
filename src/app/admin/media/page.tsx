import { MediaLibrary } from "@/components/admin/MediaLibrary"

export const metadata = {
  robots: { index: false, follow: false },
  title: "Médiathèque | NAYRO Admin",
}

export default function MediaPage() {
  return (
    <div>
      <h1 className="text-xl tracking-[0.2em] mb-2">MÉDIATHÈQUE</h1>
      <p className="text-xs text-zinc-500 mb-6">Contrôlez toutes les images du site comme sur WordPress — chaque image a sa taille recommandée affichée. Changez une image et elle s’actualise instantanément sur la boutique.</p>
      <MediaLibrary />
    </div>
  )
}
