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
                 
                  style={{ transform: "translateZ(0)" }}
                />
              </div>
              {/* ZARA editorial scrim — stronger left forText visibility on ANY image (bright concert / white) */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 via-[38%] to-transparent md:from-black/70 md:via-black/45 md:via-[42%] md:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-black/[0.04]" />
            </div>
          )
        })}
      </div>

      {/* vertical editorial - ultra subtle, like ZARA */}
      <div className="hidden xl:flex absolute left-[22px] top-1/2 -translate-y-1/2 [writing-mode:vertical-lr] rotate-180 select-none pointer-events-none">
        <span className="text-[10px] tracking-[0.45em] text-white/35 font-light">NAYRO — PARIS • CASABLANCA — 2026</span>
      </div>

      {/* Content - ZARA editorial, left anchored — pro visible + shop-easy */}
      <div className="absolute inset-0">
        <div className="mx-auto max-w-[1720px] w-full h-full px-5 sm:px-8 lg:px-12 xl:px-16 flex items-center">
          {banners.map((b, i) => {
            const active = i === index
            const stagger = (d: number) => active ? `${d}ms` : "0ms"
            return (
              <div
                key={`t-${b.id}`}
                aria-hidden={!active}
                className="w-full max-w-[620px] will-change-transform"
                style={{
                  opacity: active ? 1 : 0,
                  transform: active ? "translate3d(0,0,0)" : "translate3d(0,22px,0)",
                  transition: active
                    ? "opacity 700ms cubic-bezier(0.25,1,0.5,1), transform 700ms cubic-bezier(0.25,1,0.5,1)"
                    : "opacity 450ms ease, transform 450ms ease",
                  pointerEvents: active ? "auto" : "none",
                  willChange: "opacity, transform",
                }}
              >
                {/* soft plate behind text for ANY image — Zara readability without white card */}
                <div className="absolute -inset-6 -inset-y-8 bg-gradient-to-r from-black/35 via-black/15 to-transparent blur-[0px] -z-10 rounded-[2px] hidden md:block" aria-hidden />
                
                {/* counter - ZARA tiny, smooth */}
                <div
                  className="flex items-center gap-3 mb-4 will-change-transform"
                  style={{
                    opacity: active ? 1 : 0,
                    transform: active ? "translateY(0)" : "translateY(8px)",
                    transition: `opacity 600ms ease ${stagger(80)}, transform 600ms cubic-bezier(0.25,1,0.5,1) ${stagger(80)}`,
                  }}
                >
                  <span className="h-px w-7 bg-white" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.4)" }} />
                  <p className="text-[11px] tracking-[0.38em] text-white font-light" style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}>0{index + 1} — 0{banners.length}</p>
                  <span className="text-[10px] tracking-[0.22em] text-white/80 hidden sm:inline" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.5)" }}>NOUVELLE COLLECTION</span>
                </div>

                <h1 className="font-extralight leading-[0.88] tracking-[-0.04em]">
                  <span
                    className="block text-white text-[40px] sm:text-[54px] lg:text-[70px] xl:text-[76px] will-change-transform"
                    style={{
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(14px)",
                      transition: `opacity 700ms ease ${stagger(140)}, transform 700ms cubic-bezier(0.25,1,0.5,1) ${stagger(140)}`,
                      textShadow: "0 2px 18px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.4)",
                    }}
                  >
                    {b.title}
                  </span>
                  {(b.subtitle || "").trim() && (
                    <span
                      className="block text-white tracking-[0.20em] font-light leading-relaxed mt-3 will-change-transform text-[13px] sm:text-[14px] lg:text-[15px] xl:text-[16px]"
                      style={{
                        opacity: active ? 0.95 : 0,
                        transform: active ? "translateY(0)" : "translateY(10px)",
                        transition: `opacity 700ms ease ${stagger(220)}, transform 700ms cubic-bezier(0.25,1,0.5,1) ${stagger(220)}`,
                        textShadow: "0 1px 14px rgba(0,0,0,0.55)",
                      }}
                    >
                      {(b.subtitle || "").split("—")[0].trim() || b.subtitle}
                    </span>
                  )}
                </h1>

                {/* divider */}
                <div
                  className="h-px w-12 bg-white/90 mt-5 will-change-transform"
                  style={{
                    opacity: active ? 1 : 0,
                    transform: active ? "scaleX(1)" : "scaleX(0.6)",
                    transformOrigin: "left",
                    transition: `opacity 600ms ease ${stagger(300)}, transform 600ms cubic-bezier(0.25,1,0.5,1) ${stagger(300)}`,
                    boxShadow: "0 1px 8px rgba(0,0,0,0.3)",
                  }}
                />

                {b.subtitle && b.subtitle.includes("—") && b.subtitle.split("—")[1] && (
                  <p
                    className="text-[14px] sm:text-[15px] leading-[1.7] text-white mt-4 max-w-[46ch] font-light will-change-transform"
                    style={{
                      opacity: active ? 0.88 : 0,
                      transform: active ? "translateY(0)" : "translateY(8px)",
                      transition: `opacity 700ms ease ${stagger(360)}, transform 700ms cubic-bezier(0.25,1,0.5,1) ${stagger(360)}`,
                      textShadow: "0 1px 12px rgba(0,0,0,0.6)",
                    }}
                  >
                    {b.subtitle.split("—").slice(1).join("—").trim()}
                  </p>
                )}
                {!b.subtitle?.includes("—") && b.subtitle && (
                  <p
                    className="text-[14px] sm:text-[15px] leading-[1.7] text-white mt-4 max-w-[46ch] font-light will-change-transform"
                    style={{
                      opacity: active ? 0.88 : 0,
                      transform: active ? "translateY(0)" : "translateY(8px)",
                      transition: `opacity 700ms ease ${stagger(360)}, transform 700ms cubic-bezier(0.25,1,0.5,1) ${stagger(360)}`,
                      textShadow: "0 1px 12px rgba(0,0,0,0.6)",
                    }}
                  >
                    Minimal. Moderne. Conçu au Maroc — Livraison partout.
                  </p>
                )}

                {/* SHOP — big, high-contrast, easy to tap */}
                <div
                  className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4 will-change-transform"
                  style={{
                    opacity: active ? 1 : 0,
                    transform: active ? "translateY(0)" : "translateY(10px)",
                    transition: `opacity 700ms ease ${stagger(460)}, transform 700ms cubic-bezier(0.25,1,0.5,1) ${stagger(460)}`,
                  }}
                >
                  <Link
                    href={b.link || "/shop"}
                    aria-label={`Shop ${b.title}`}
                    className="group relative inline-flex items-center justify-center gap-3 bg-white text-black text-[12px] sm:text-[12.5px] tracking-[0.22em] font-medium px-8 sm:px-9 py-[15px] sm:py-[16px] min-h-[48px] min-w-[200px] sm:min-w-[220px] will-change-transform select-none"
                    style={{
                      transform: "translateZ(0)",
                      boxShadow: "0 10px 28px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.22)",
                    }}
                  >
                    <span>SHOP COLLECTION</span>
                    <span aria-hidden className="text-[14px] leading-none transition-transform duration-300 group-hover:translate-x-1.5 group-active:translate-x-1">→</span>
                    <span className="absolute inset-0 ring-1 ring-black/5 pointer-events-none" />
                  </Link>
                  <Link
                    href={b.link || "/shop"}
                    className="inline-flex sm:hidden items-center justify-center text-[11px] tracking-[0.18em] text-white bg-white/10 backdrop-blur border border-white/20 px-5 py-[13px] min-h-[48px] hover:bg-white hover:text-black transition-colors"
                  >
                    VOIR
                  </Link>
                  <Link
                    href={b.link || "/shop"}
                    className="hidden sm:inline-flex items-center gap-2 text-[12px] tracking-[0.16em] text-white hover:text-white transition-colors group/discover px-2 py-2"
                    style={{ textShadow: "0 1px 8px rgba(0,0,0,0.55)" }}
                  >
                    <span className="underline underline-offset-[9px] decoration-white/40 group-hover/discover:decoration-white decoration-[1.2px]">DISCOVER</span>
                    <span className="opacity-70 group-hover/discover:opacity-100 transition-opacity">↗</span>
                  </Link>
                </div>
                <p className="mt-3 text-[10px] tracking-[0.14em] text-white/60 hidden sm:block" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>Livraison 35 MAD • Gratuite dès 299 MAD • Retour 14 jours</p>
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
