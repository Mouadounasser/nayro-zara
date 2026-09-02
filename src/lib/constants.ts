export const CATEGORIES = [
  { slug: "sacs", name: "SACS", label: "Sacs" },
  { slug: "accessories", name: "ACCESSOIRES", label: "Accessoires" },
  { slug: "new", name: "NEW", label: "Nouveautés" },
  { slug: "sale", name: "SALE", label: "Promos" },
] as const

// Gender is REQUIRED for every product — used for Men/Women filtering
export const AUDIENCES = [
  { value: "women", label: "Women", slug: "women" },
  { value: "men", label: "Men", slug: "men" },
] as const

export const NAV_LINKS = [
  { href: "/shop/women", label: "WOMEN" },
  { href: "/shop/men", label: "MEN" },
  { href: "/shop/sacs", label: "SACS" },
  { href: "/shop/accessories", label: "ACCESSOIRES" },
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
  whatsapp_number: "212689363596",
  instagram: "https://instagram.com/nayro.shop",
  delivery_fee: 30,
  free_delivery_threshold: 50,
  cod_enabled: true,
  currency: "MAD",
}
