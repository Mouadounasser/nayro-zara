export const metadata = { title: "FAQ | NAYRO" }
const faqs = [
  { q: "Quels sont les délais de livraison ?", a: "2-4 jours ouvrables partout au Maroc via notre partenaire logistique." },
  { q: "Le paiement est-il sécurisé ?", a: "Paiement à la livraison en espèces. Aucune donnée bancaire n'est collectée en ligne." },
  { q: "Puis-je retourner un article ?", a: "Oui, sous 14 jours, produit non porté avec étiquettes. Retour gratuit." },
  { q: "Comment choisir ma taille ?", a: "Consultez le guide des tailles sur chaque fiche produit. Notre service client vous aide sur WhatsApp." },
]
export default function FAQPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 lg:px-8 py-16">
      <h1 className="text-3xl font-light tracking-[0.2em] mb-8 text-center">FAQ</h1>
      <div className="space-y-4">
        {faqs.map(f=> (
          <details key={f.q} className="border border-zinc-200 p-4 bg-white">
            <summary className="text-sm font-medium cursor-pointer">{f.q}</summary>
            <p className="text-sm text-zinc-600 mt-2">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
