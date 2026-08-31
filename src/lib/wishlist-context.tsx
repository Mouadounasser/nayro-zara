"use client"
import * as React from "react"

type WishlistContextType = {
  ids: string[]
  toggle: (id: string) => void
  has: (id: string) => boolean
  count: number
}

const WishlistContext = React.createContext<WishlistContextType | null>(null)
const STORAGE_KEY = "nayro-wishlist"

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = React.useState<string[]>([])

  React.useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      if (s) setIds(JSON.parse(s))
    } catch {}
  }, [])

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }, [ids])

  const toggle = React.useCallback((id: string) => {
    setIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }, [])

  const has = React.useCallback((id: string) => ids.includes(id), [ids])

  return (
    <WishlistContext.Provider value={{ ids, toggle, has, count: ids.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = React.useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}
