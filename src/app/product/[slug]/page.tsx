import { notFound } from "next/navigation"
import { getProductBySlug, getRelatedProducts } from "@/lib/products"
import { getSettings } from "@/lib/settings"
import { ProductDetailClient } from "@/components/product/ProductDetailClient"
import { ProductGrid } from "@/components/product/ProductGrid"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Produit introuvable" }
  return {
    title: `${product.name} | NAYRO`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.short_description || product.description,
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product)
  const settings = await getSettings()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: "NAYRO" },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "MAD",
      availability: "https://schema.org/InStock",
      url: `https://nayro.ma/product/${product.slug}`,
    },
    image: product.images.map(i => i.url),
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ProductDetailClient product={product} whatsappNumber={settings.whatsapp_number} />

      {/* Details accordion */}
      <div className="max-w-3xl mx-auto mt-16 border-t border-zinc-200">
        {[
          { title: "DESCRIPTION", content: product.description },
          { title: "DÉTAILS", content: "Matière premium • Fabrication soignée • Coupe NAYRO • Entretien: nettoyage à sec recommandé." },
          { title: "LIVRAISON", content: `Livraison partout au Maroc en 2-4 jours ouvrables. Livraison gratuite dès ${settings.free_delivery_threshold} MAD. Paiement à la livraison.` },
          { title: "RETOURS", content: "Retours gratuits sous 14 jours. Produit non porté, avec étiquettes." },
          { title: "ENTRETIEN", content: "Lavage délicat à 30°C • Ne pas blanchir • Séchage à plat • Repassage doux." },
        ].map(section => (
          <details key={section.title} className="border-b border-zinc-200 py-4 group">
            <summary className="flex justify-between items-center cursor-pointer list-none text-xs tracking-[0.2em]">
              {section.title}
              <span className="text-lg group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{section.content}</p>
          </details>
        ))}
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-sm tracking-[0.2em] mb-6">VOUS AIMEREZ AUSSI</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  )
}
