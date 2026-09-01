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
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header className={cn(
        "sticky top-0 z-40 w-full border-b bg-[#fdfcf8]/95 backdrop-blur supports-[backdrop-filter]:bg-[#fdfcf8]/80 transition-all",
        scrolled ? "border-zinc-200 shadow-sm" : "border-transparent"
      )}>
        {/* Top bar */}
        <div className="hidden md:flex h-7 items-center justify-center bg-black text-white text-[10px] tracking-[0.2em]">
          LIVRAISON GRATUITE DÈS 50 MAD • RETOURS SOUS 14 JOURS • PAIEMENT À LA LIVRAISON
        </div>

        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <div className="flex h-[64px] items-center justify-between gap-4">
            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 -ml-2" aria-label="Menu">
              <Menu size={20} />
            </button>

            {/* Logo — half white / half black + background half half (ZARA editorial) */}
            <Link
              href="/"
              aria-label="NAYRO home"
              className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden border border-black/10 select-none group"
            >
              {/* background split 50/50 */}
              <span
                aria-hidden
                className="absolute inset-0"
                style={{ background: "linear-gradient(90deg, #0a0a0a 0% 50%, #fdfcf8 50% 100%)" }}
              />
              {/* subtle diagonal sheen on hover */}
              <span
                aria-hidden
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: "linear-gradient(105deg, transparent 0% 48%, rgba(255,255,255,0.06) 50%, transparent 52% 100%)" }}
              />
              <span
                className="relative text-[26px] sm:text-[28px] font-light tracking-[0.32em] leading-none"
                style={{
                  background: "linear-gradient(90deg, #ffffff 0% 50%, #0a0a0a 50% 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.04))",
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

            {/* Icons */}
            <div className="flex items-center gap-1 md:gap-2">
              <Link href="/search" className="p-2 hover:bg-zinc-100 transition-colors" aria-label="Search">
                <Search size={18} strokeWidth={1.5} />
              </Link>
              <Link href="/account" className="hidden md:flex p-2 hover:bg-zinc-100 transition-colors" aria-label="Account">
                <User size={18} strokeWidth={1.5} />
              </Link>
              <Link href="/wishlist" className="relative p-2 hover:bg-zinc-100 transition-colors hidden md:flex" aria-label="Wishlist">
                <Heart size={18} strokeWidth={1.5} />
                {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{wishlistCount}</span>}
              </Link>
              <button onClick={() => setIsOpen(true)} className="relative p-2 hover:bg-zinc-100 transition-colors" aria-label="Cart">
                <ShoppingBag size={18} strokeWidth={1.5} />
                {count > 0 && <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{count}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#fdfcf8] flex flex-col">
          <div className="flex h-[64px] items-center justify-between px-4 border-b">
            <span className="text-xl tracking-[0.3em]">NAYRO</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2">
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
