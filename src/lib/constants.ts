export const CATEGORIES = [
  { slug: "women", name: "WOMEN", label: "Women" },
  { slug: "men", name: "MEN", label: "Men" },
  { slug: "shoes", name: "SHOES", label: "Shoes" },
  { slug: "accessories", name: "ACCESSORIES", label: "Accessories" },
  { slug: "new", name: "NEW", label: "New Arrivals" },
  { slug: "sale", name: "SALE", label: "Sale" },
] as const

export const NAV_LINKS = [
  { href: "/shop?filter=new", label: "NEW" },
  { href: "/shop/women", label: "WOMEN" },
  { href: "/shop/men", label: "MEN" },
  { href: "/shop/shoes", label: "SHOES" },
  { href: "/shop/accessories", label: "ACCESSORIES" },
  { href: "/shop?filter=sale", label: "SALE" },
]

export const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kenitra",
  "Tétouan",
  "Safi",
  "El Jadida",
  "Beni Mellal",
  "Nador",
  "Khouribga",
] as const

export const SIZES = ["XS", "S", "M", "L", "XL"] as const
export const SHOE_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43", "44"] as const

export const DEFAULT_SETTINGS = {
  store_name: "NAYRO",
  whatsapp_number: "212600000000",
  instagram: "https://instagram.com/nayro",
  delivery_fee: 30,
  free_delivery_threshold: 600,
  cod_enabled: true,
  currency: "MAD",
}
