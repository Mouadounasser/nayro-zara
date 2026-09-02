"use client"
import * as React from "react"
import type { CartItem } from "./types"

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size?: string) => void
  updateQuantity: (productId: string, size: string | undefined, quantity: number) => void
  clearCart: () => void
  count: number
  subtotal: number
  isOpen: boolean
  setIsOpen: (v: boolean) => void
}

const CartContext = React.createContext<CartContextType | null>(null)

const STORAGE_KEY = "nayro-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {}
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem = React.useCallback((item: CartItem) => {
    setItems(prev => {
      const idx = prev.findIndex(p =>
        p.productId === item.productId &&
        (p.variantId ? p.variantId === item.variantId : p.size === item.size && p.color === item.color)
      )
      if (idx > -1) {
        const next = [...prev]
        // respect stock if available, but don't exceed
        next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity }
        return next
      }
      return [...prev, item]
    })
    setIsOpen(true)
  }, [])

  const removeItem = React.useCallback((productId: string, size?: string, variantId?: string, color?: string) => {
    setItems(prev => prev.filter(p => {
      if (variantId) return !(p.productId === productId && p.variantId === variantId)
      if (color !== undefined) return !(p.productId === productId && p.color === color && p.size === size)
      return !(p.productId === productId && p.size === size)
    }))
  }, [])

  const updateQuantity = React.useCallback((productId: string, size: string | undefined, quantity: number, variantId?: string, color?: string) => {
    if (quantity <= 0) {
      removeItem(productId, size, variantId, color)
      return
    }
    setItems(prev => prev.map(p => {
      const match = variantId ? p.variantId === variantId : (p.productId === productId && p.size === size && p.color === color)
      return match ? { ...p, quantity } : p
    }))
  }, [removeItem])

  const clearCart = React.useCallback(() => setItems([]), [])

  const count = items.reduce((a, b) => a + b.quantity, 0)
  const subtotal = items.reduce((a, b) => a + b.price * b.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, count, subtotal, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = React.useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
