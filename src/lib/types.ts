export type Product = {
  id: string
  slug: string
  name: string
  description: string
  short_description: string | null
  price: number
  compare_at_price: number | null
  sku: string
  brand: string
  category_id: string | null
  category_slug: string
  collection_id: string | null
  is_active: boolean
  is_featured: boolean
  is_new: boolean
  is_bestseller: boolean
  created_at: string
  updated_at: string
  images: ProductImage[]
  variants: ProductVariant[]
}

export type ProductImage = {
  id: string
  product_id: string
  url: string
  alt: string | null
  position: number
}

export type ProductVariant = {
  id: string
  product_id: string
  size: string | null
  color: string | null
  sku: string | null
  stock: number
  price_override: number | null
}

export type Category = {
  id: string
  slug: string
  name: string
  description: string | null
  image_url: string | null
  position: number
}

export type CartItem = {
  productId: string
  variantId?: string
  slug: string
  name: string
  price: number
  compare_at_price?: number | null
  image: string
  size?: string
  color?: string
  quantity: number
  sku?: string
}

export type Order = {
  id: string
  order_number: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned"
  payment_method: string
  payment_status: string
  subtotal: number
  delivery_fee: number
  discount: number
  total: number
  customer_name: string
  phone: string
  city: string
  address: string
  created_at: string
  items: OrderItem[]
}

export type OrderItem = {
  id: string
  product_id: string
  product_name: string
  product_slug: string
  image: string
  size?: string
  color?: string
  quantity: number
  price: number
}

export type StoreSettings = {
  store_name: string
  whatsapp_number: string
  instagram: string
  delivery_fee: number
  free_delivery_threshold: number
  cod_enabled: boolean
  currency: string
}
