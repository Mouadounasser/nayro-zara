export const metadata = { title: "Retours | NAYRO" }
export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 lg:px-8 py-16">
      <h1 className="text-3xl font-light tracking-[0.2em] mb-8 text-center">RETOURS</h1>
      <div className="bg-white border border-zinc-200 p-8 space-y-4 text-sm text-zinc-600 leading-relaxed">
        <p>Retours gratuits sous 14 jours à compter de la réception.</p>
        <p>Conditions: produit non porté, non lavé, avec étiquettes et emballage d&apos;origine.</p>
        <p>Pour initier un retour, contactez-nous sur WhatsApp avec votre numéro de commande.</p>
        <p>Remboursement ou échange sous 48h après réception.</p>
      </div>
    </div>
  )
}
