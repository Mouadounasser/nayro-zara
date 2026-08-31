import { MetadataRoute } from "next"
import { mockProducts } from "@/lib/mock-data"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://nayro.vercel.app"
  const staticPages = ["", "/shop", "/about", "/contact", "/faq", "/shipping", "/returns"].map(p => ({
    url: `${base}${p || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }))
  const products = mockProducts.map(p => ({
    url: `${base}/product/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))
  return [...staticPages, ...products]
}
