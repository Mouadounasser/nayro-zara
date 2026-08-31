import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[600px] px-4 py-20 text-center">
      <h1 className="text-6xl font-light tracking-[0.2em] mb-4">404</h1>
      <p className="text-sm tracking-widest text-zinc-500 mb-8">PAGE INTROUVABLE</p>
      <Link href="/"><Button className="rounded-none tracking-widest text-xs">RETOUR À L&apos;ACCUEIL</Button></Link>
    </div>
  )
}
