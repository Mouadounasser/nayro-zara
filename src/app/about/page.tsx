export const metadata = { title: "À propos | NAYRO" }
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 lg:px-8 py-16">
      <h1 className="text-3xl font-light tracking-[0.2em] mb-8 text-center">À PROPOS</h1>
      <div className="prose prose-sm max-w-none text-zinc-600 leading-relaxed space-y-6">
        <p>NAYRO est une maison marocaine née à Casablanca, dédiée à un vestiaire minimal et durable. Nous croyons qu&apos;un vêtement bien coupé, dans une matière noble, traverse les saisons.</p>
        <p>Chaque collection est pensée comme un dialogue entre l&apos;élégance européenne et l&apos;artisanat marocain: des coupes nettes, des volumes maîtrisés, des détails discrets qui font la différence.</p>
        <h2 className="text-black tracking-[0.2em] text-sm mt-8">NOTRE PROMESSE</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Matières durables et traçables</li>
          <li>Production raisonnée en petites séries</li>
          <li>Prix justes, sans intermédiaires inutiles</li>
          <li>Livraison partout au Maroc, paiement à la livraison</li>
        </ul>
      </div>
    </div>
  )
}
