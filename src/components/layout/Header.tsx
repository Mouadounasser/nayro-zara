"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { cn } from "@/lib/utils"
import { NAV_LINKS } from "@/lib/constants"
import { CartDrawer } from "./CartDrawer"

export function Header() {
  const { count, isOpen, setIsOpen } = useCart()
  const { count: wishlistCount } = useWishlist()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false) }
    window.addEventListener("keydown", onEsc)
    document.body.style.overflow = "hidden"
    return () => { window.removeEventListener("keydown", onEsc); document.body.style.overflow = "" }
  }, [mobileOpen])

  return (
    <>
      <header className={cn(
        "sticky top-0 z-40 w-full border-b bg-[#fdfcf8]/95 backdrop-blur supports-[backdrop-filter]:bg-[#fdfcf8]/80 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[background-color,border-color]",
        scrolled ? "border-zinc-200 shadow-[0_2px_20px_rgba(0,0,0,0.06)]" : "border-transparent"
      )}>
        {/* Top bar — visible on mobile for COD reassurance */}
        <div className="flex h-7 items-center justify-center bg-black text-white text-[9px] md:text-[10px] tracking-[0.15em] md:tracking-[0.2em] px-2 text-center">
          <span className="hidden sm:inline">LIVRAISON GRATUITE DÈS 299 MAD • RETOURS SOUS 14 JOURS • PAIEMENT À LA LIVRAISON</span>
          <span className="sm:hidden">LIVRAISON GRATUITE DÈS 299 MAD • PAIEMENT À LA LIVRAISON</span>
        </div>

        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <div className="relative flex h-[64px] items-center justify-between gap-4">
            {/* Mobile menu button — left, 44px */}
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-3 -ml-2 z-10 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Menu">
              <Menu size={20} />
            </button>

            {/* Logo — centered on phone, left on desktop */}
            <Link
              href="/"
              aria-label="NAYRO home"
              className="absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0 inline-flex items-center justify-center px-[20px] py-[9px] overflow-hidden border border-black/[0.08] select-none group isolate will-change-transform z-10"
              style={{ backfaceVisibility: "hidden" as const, borderRadius: 2 }}
            >
              {/* background — smooth 50/50 blend, not harsh line */}
              <span
                aria-hidden
                className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(90deg, #0a0a0a 0% 42%, #2a2a2a 48%, #fdfcf8 52% 100%)",
                  willChange: "transform",
                }}
              />
              {/* soft inner highlight for depth */}
              <span aria-hidden className="absolute inset-0 ring-1 ring-white/[0.06] pointer-events-none" />
              <span
                aria-hidden
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{ background: "linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.07) 50%, transparent 70%)" }}
              />
              <span
                className="relative text-[26px] sm:text-[27px] font-extralight tracking-[0.34em] leading-none antialiased"
                style={{
                  background: "linear-gradient(90deg, #ffffff 0% 38%, #f5f5f5 46%, #0a0a0a 54% 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 1px 6px rgba(0,0,0,0.18))",
                }}
              >
                NAYRO
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} className="text-xs tracking-[0.18em] text-zinc-700 hover:text-black transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Icons — right, 44px min */}
            <div className="flex items-center gap-1 md:gap-2 z-10">
              <Link href="/search" className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-zinc-100 transition-colors" aria-label="Search">
                <Search size={18} strokeWidth={1.5} />
              </Link>
              <Link href="/account" className="hidden md:flex p-3 min-h-[44px] min-w-[44px] items-center justify-center hover:bg-zinc-100 transition-colors" aria-label="Account">
                <User size={18} strokeWidth={1.5} />
              </Link>
              <Link href="/wishlist" className="relative p-3 min-h-[44px] min-w-[44px] items-center justify-center hover:bg-zinc-100 transition-colors hidden md:flex" aria-label="Wishlist">
                <Heart size={18} strokeWidth={1.5} />
                {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{wishlistCount}</span>}
              </Link>
              <button onClick={() => setIsOpen(true)} className="relative p-3 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-zinc-100 transition-colors" aria-label="Cart">
                <ShoppingBag size={18} strokeWidth={1.5} />
                {count > 0 && <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{count}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu — a11y dialog */}
      {mobileOpen && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 bg-[#fdfcf8] flex flex-col animate-in fade-in">
          <div className="flex h-[64px] items-center justify-between px-4 border-b">
            <span className="text-xl tracking-[0.3em]">NAYRO</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center">
              <X size={20} />
            </button>
          </div>
          <nav className="flex flex-col p-8 gap-6">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="text-2xl font-light tracking-widest border-b border-zinc-100 pb-4">
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-4 mt-4 text-sm tracking-widest">
              <Link href="/account" onClick={() => setMobileOpen(false)}>MON COMPTE</Link>
              <Link href="/wishlist" onClick={() => setMobileOpen(false)}>WISHLIST ({wishlistCount})</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)}>CONTACT</Link>
            </div>
          </nav>
        </div>
      )}

      <CartDrawer open={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}
