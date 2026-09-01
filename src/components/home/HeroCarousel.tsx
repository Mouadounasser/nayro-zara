"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Banner = {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  link: string | null
}

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  // Keep index in bounds if banners are added/removed
  useEffect(() => {
    if (index >= banners.length) setIndex(0)
  }, [banners.length, index])

  // Auto-rotate every 3s — dynamically based on how many images you add (length = N, cycle = N*3s)
  useEffect(() => {
    if (banners.length <= 1 || paused) return
    const id = setInterval(() => setIndex(i => (i + 1) % banners.length), 3000)
    return () => clearInterval(id)
  }, [banners.length, paused])

  // Touch swipe for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX)
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) setIndex(i => (i + 1) % banners.length)
      else setIndex(i => (i - 1 + banners.length) % banners.length)
    }
    setTouchStart(null)
  }

  if (banners.length === 0) return null
  const current = banners[Math.min(index, banners.length - 1)]

  const goPrev = () => setIndex(i => (i - 1 + banners.length) % banners.length)
  const goNext = () => setIndex(i => (i + 1) % banners.length)

  return (
    <section
      className="relative h-[72vh] md:h-[88vh] overflow-hidden bg-[#f9f1e8]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label={`Hero banner carousel, ${banners.length} slides, changes every 3 seconds`}
    >
      {/* Images with Ken Burns + fade */}
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={b.image_url}
            alt={b.title}
            fill
            priority={i === 0}
            className={`object-cover ${i === index ? "scale-105" : "scale-100"} transition-transform duration-[3000ms] ease-out`}
            unoptimized
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      ))}

      {/* Genius touch: vertical NAYRO */}
      <div className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 rotate-180 writing-mode-vertical text-white/30 text-xs tracking-[0.4em] [writing-mode:vertical-lr]">
        NAYRO • PARIS • CASABLANCA • 2026
      </div>

      {/* Text */}
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto max-w-[1400px] w-full px-4 lg:px-8">
          <div className="max-w-xl bg-white/95 backdrop-blur p-8 md:p-10 shadow-sm">
            <p className="text-xs tracking-[0.35em] text-zinc-500">NOUVELLE COLLECTION — 0{index + 1} / 0{banners.length}</p>
            <h1 className="text-3xl md:text-5xl font-light tracking-tight mt-3 leading-tight">
              {current.title.split(".")[0]}
              {current.title.includes(".") ? "." : ""}<br />
              <span className="italic font-light text-zinc-700">{current.title.split(".")[1] || current.subtitle?.split("—")[0] || "Modern Elegance."}</span>
            </h1>
            <p className="text-sm text-zinc-600 mt-4 leading-relaxed line-clamp-2">
              {current.subtitle || "Carry your vibe — Minimal. Moderne. Conçu au Maroc."}
            </p>
            <Link href={current.link || "/shop"} className="inline-block mt-6 bg-black text-white text-xs tracking-[0.2em] px-8 py-3 hover:bg-zinc-800 transition-colors">
              SHOP COLLECTION
            </Link>
          </div>
        </div>
      </div>

      {/* Progress bar — fills every 3s then resets for next slide */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        {banners.length > 1 && (
          <div
            key={index}
            className="h-full bg-white"
            style={{ animation: `progress 3s linear`, animationPlayState: paused ? "paused" : "running" }}
          />
        )}
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to ${i + 1}`}
            className={`h-1.5 transition-all ${i === index ? "w-8 bg-white" : "w-4 bg-white/50"}`}
          />
        ))}
      </div>

      {/* Arrows - subtle */}
      {banners.length > 1 && (
        <>
          <button onClick={goPrev} aria-label="Previous slide" className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white hidden md:flex">
            <ChevronLeft size={18} />
          </button>
          <button onClick={goNext} aria-label="Next slide" className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white hidden md:flex">
            <ChevronRight size={18} />
          </button>
        </>
      )}

      <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
    </section>
  )
}
