export const CATEGORIES = [
  { slug: "sacs", name: "SACS", label: "Sacs" },
  { slug: "accessories", name: "ACCESSOIRES", label: "Accessoires" },
  { slug: "new", name: "NEW", label: "Nouveautés" },
  { slug: "sale", name: "SALE", label: "Promos" },
] as const

export const NAV_LINKS = [
  { href: "/shop?filter=new", label: "NEW" },
  { href: "/shop/sacs", label: "SACS" },
  { href: "/shop/accessories", label: "ACCESSOIRES" },
  { href: "/shop?filter=bestseller", label: "BEST" },
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
  instagram: "https://instagram.com/nayro.shop",
  delivery_fee: 30,
  free_delivery_threshold: 600,
  cod_enabled: true,
  currency: "MAD",
}
