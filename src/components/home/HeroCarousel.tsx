"use client"
import { useEffect, useState, useRef, useCallback } from "react"
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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // bounds
  useEffect(() => {
    if (index >= banners.length) setIndex(0)
  }, [banners.length, index])

  const goPrev = useCallback(() => setIndex(i => (i - 1 + banners.length) % banners.length), [banners.length])
  const goNext = useCallback(() => setIndex(i => (i + 1) % banners.length), [banners.length])

  // Auto-rotate 3s — N images = N*3s loop
  useEffect(() => {
    if (banners.length <= 1 || paused) return
    timerRef.current = setInterval(() => setIndex(i => (i + 1) % banners.length), 3000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [banners.length, paused])

  // touch swipe
  const touchStartX = useRef<number | null>(null)
  const touchDelta = useRef(0)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDelta.current = 0
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) touchDelta.current = e.touches[0].clientX - touchStartX.current
  }
  const onTouchEnd = () => {
    if (touchStartX.current === null) return
    if (Math.abs(touchDelta.current) > 50) {
      if (touchDelta.current < 0) goNext()
      else goPrev()
    }
    touchStartX.current = null
    touchDelta.current = 0
  }

  // keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [goPrev, goNext])

  if (banners.length === 0) return null

  return (
    <section
      className="relative w-full overflow-hidden bg-black isolate"
      style={{ height: "clamp(520px, 88vh, 920px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label={`Featured collection, ${banners.length} slides`}
    >
      {/* Images - GPU accelerated */}
      <div className="absolute inset-0">
        {banners.map((b, i) => {
          const active = i === index
          return (
            <div
              key={b.id}
              aria-hidden={!active}
              className="absolute inset-0 will-change-transform"
              style={{
                opacity: active ? 1 : 0,
                transition: "opacity 900ms cubic-bezier(0.33,1,0.68,1)",
                willChange: "opacity",
                pointerEvents: active ? "auto" : "none",
              }}
            >
              {/* subtle zoom only on active — 7s, Zara-like Ken Burns */}
              <div
                className="absolute inset-0 will-change-transform"
                style={{
                  transform: active ? "scale(1.06)" : "scale(1)",
                  transition: active
                    ? "transform 7000ms cubic-bezier(0.25,0.46,0.45,0.94)"
                    : "transform 900ms ease-out",
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                }}
              >
                <Image
                  src={b.image_url}
                  alt={b.title}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                  unoptimized
                  style={{ transform: "translateZ(0)" }}
                />
              </div>
              {/* Zara scrim - editorial */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent md:from-black/35 md:via-black/10" />
              <div className="absolute inset-0 bg-black/[0.04]" />
            </div>
          )
        })}
      </div>

      {/* vertical editorial - ultra subtle, like ZARA */}
      <div className="hidden xl:flex absolute left-[22px] top-1/2 -translate-y-1/2 [writing-mode:vertical-lr] rotate-180 select-none pointer-events-none">
        <span className="text-[10px] tracking-[0.45em] text-white/35 font-light">NAYRO — PARIS • CASABLANCA — 2026</span>
      </div>

      {/* Content - Zara minimal, left anchored, no white box */}
      <div className="absolute inset-0">
        <div className="mx-auto max-w-[1720px] w-full h-full px-5 sm:px-8 lg:px-12 xl:px-16 flex items-center">
          {banners.map((b, i) => {
            const active = i === index
            return (
              <div
                key={`t-${b.id}`}
                aria-hidden={!active}
                className="w-full max-w-[560px] will-change-transform"
                style={{
                  opacity: active ? 1 : 0,
                  transform: active ? "translate3d(0,0,0)" : "translate3d(0,18px,0)",
                  transition: active
                    ? "opacity 800ms cubic-bezier(0.25,1,0.5,1) 120ms, transform 800ms cubic-bezier(0.25,1,0.5,1) 120ms"
                    : "opacity 500ms ease, transform 500ms ease",
                  pointerEvents: active ? "auto" : "none",
                  willChange: "opacity, transform",
                }}
              >
                {/* counter - ZARA tiny */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-px w-6 bg-white/70" />
                  <p className="text-[10px] tracking-[0.38em] text-white/80 font-light">0{index + 1} — 0{banners.length}</p>
                  <span className="text-[10px] tracking-[0.2em] text-white/50 hidden sm:inline">NOUVELLE COLLECTION</span>
                </div>

                <h1 className="font-extralight leading-[0.88] tracking-[-0.04em] text-white">
                  <span className="block text-[42px] sm:text-[56px] lg:text-[72px] xl:text-[78px]">{b.title}</span>
                  {(b.subtitle || "").trim() && (
                    <span className="block text-[15px] sm:text-[16px] lg:text-[18px] tracking-[0.22em] font-light text-white/90 mt-3 leading-relaxed">
                      {(b.subtitle || "").split("—")[0].trim() || b.subtitle}
                    </span>
                  )}
                </h1>

                {/* divider */}
                <div className="h-px w-12 bg-white/60 mt-6" />

                {b.subtitle && b.subtitle.includes("—") && b.subtitle.split("—")[1] && (
                  <p className="text-[13px] sm:text-[14px] leading-[1.7] text-white/75 mt-4 max-w-[44ch] font-light">
                    {b.subtitle.split("—").slice(1).join("—").trim()}
                  </p>
                )}
                {!b.subtitle?.includes("—") && b.subtitle && (
                  <p className="text-[13px] sm:text-[14px] leading-[1.7] text-white/75 mt-4 max-w-[44ch] font-light">
                    Carry your vibe — Minimal. Moderne. Conçu au Maroc.
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href={b.link || "/shop"}
                    className="group inline-flex items-center gap-3 bg-white text-black text-[11px] tracking-[0.22em] px-8 py-[14px] hover:bg-white/90 transition-colors duration-200 will-change-transform"
                    style={{ transform: "translateZ(0)" }}
                  >
                    <span>SHOP COLLECTION</span>
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                  <Link
                    href={b.link || "/shop"}
                    className="hidden sm:inline-flex text-[11px] tracking-[0.18em] text-white/85 underline underline-offset-8 decoration-white/30 hover:decoration-white hover:text-white transition-all"
                  >
                    DISCOVER
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Progress - Zara thin */}
      {banners.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/15">
          <div
            key={index}
            className="h-full bg-white"
            style={{
              width: "100%",
              animation: `zaraProgress 3000ms linear forwards`,
              animationPlayState: paused ? "paused" : "running",
              willChange: "width",
              transform: "translateZ(0)",
            }}
          />
        </div>
      )}

      {/* Dots - ZARA lines */}
      <div className="absolute bottom-[22px] left-1/2 -translate-x-1/2 flex items-center gap-[8px]">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1} of ${banners.length}`}
            aria-current={i === index}
            className="group py-3"
          >
            <span
              className="block h-px transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
              style={{
                width: i === index ? 44 : 18,
                background: i === index ? "white" : "rgba(255,255,255,0.45)",
                transform: "translateZ(0)",
              }}
            />
          </button>
        ))}
      </div>

      {/* Arrows - ZARA ghost, no box, just chevron */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-[72px] hidden md:flex items-center justify-center group focus:outline-none"
          >
            <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-[2px] bg-white/[0.04] group-hover:bg-white group-hover:border-white transition-all duration-300 will-change-transform">
              <ChevronLeft size={16} strokeWidth={1.5} className="text-white group-hover:text-black transition-colors" />
            </span>
          </button>
          <button
            onClick={goNext}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-[72px] hidden md:flex items-center justify-center group focus:outline-none"
          >
            <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-[2px] bg-white/[0.04] group-hover:bg-white group-hover:border-white transition-all duration-300">
              <ChevronRight size={16} strokeWidth={1.5} className="text-white group-hover:text-black transition-colors" />
            </span>
          </button>
          {/* mobile arrows - subtle bottom */}
          <button onClick={goPrev} aria-label="Previous" className="absolute left-3 bottom-[52px] w-8 h-8 flex items-center justify-center bg-black/25 backdrop-blur border border-white/10 text-white md:hidden">
            <ChevronLeft size={14} />
          </button>
          <button onClick={goNext} aria-label="Next" className="absolute right-3 bottom-[52px] w-8 h-8 flex items-center justify-center bg-black/25 backdrop-blur border border-white/10 text-white md:hidden">
            <ChevronRight size={14} />
          </button>
        </>
      )}

      <style>{`
        @keyframes zaraProgress { from { width: 0% } to { width: 100% } }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </section>
  )
}
