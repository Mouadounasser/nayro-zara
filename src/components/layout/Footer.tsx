import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
          <div>
            <h3 className="tracking-[0.2em] text-xs mb-4 opacity-60">AIDE</h3>
            <ul className="space-y-3">
              <li><Link href="/faq" className="hover:underline underline-offset-4">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:underline underline-offset-4">Livraison</Link></li>
              <li><Link href="/returns" className="hover:underline underline-offset-4">Retours</Link></li>
              <li><Link href="/contact" className="hover:underline underline-offset-4">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="tracking-[0.2em] text-xs mb-4 opacity-60">NAYRO</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:underline underline-offset-4">À propos</Link></li>
              <li><Link href="/shop" className="hover:underline underline-offset-4">Boutique</Link></li>
              <li><Link href="/search" className="hover:underline underline-offset-4">Recherche</Link></li>
              <li><Link href="/wishlist" className="hover:underline underline-offset-4">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="tracking-[0.2em] text-xs mb-4 opacity-60">LÉGAL</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="hover:underline underline-offset-4">Confidentialité</Link></li>
              <li><Link href="/terms" className="hover:underline underline-offset-4">CGV</Link></li>
              <li><Link href="/shipping" className="hover:underline underline-offset-4">Mentions</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="tracking-[0.2em] text-xs mb-4 opacity-60">SUIVEZ-NOUS</h3>
            <p className="text-sm leading-relaxed opacity-70 mb-4">
              Be the first to discover what&apos;s next.<br />
              Inscrivez-vous à notre newsletter.
            </p>
            <form className="flex border-b border-white/20">
              <input placeholder="Votre email" className="bg-transparent flex-1 py-3 text-sm placeholder:text-white/40 focus:outline-none" />
              <button type="submit" className="text-xs tracking-[0.2em] px-4">OK</button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs tracking-widest opacity-50">
          <span>© {new Date().getFullYear()} NAYRO — MAROC</span>
          <span>PAIEMENT À LA LIVRAISON • LIVRAISON PARTOUT AU MAROC</span>
        </div>
      </div>
    </footer>
  )
}
