export const metadata = { title: "Livraison | NAYRO" }
export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 lg:px-8 py-16">
      <h1 className="text-3xl font-light tracking-[0.2em] mb-8 text-center">LIVRAISON</h1>
      <div className="bg-white border border-zinc-200 p-8 space-y-4 text-sm leading-relaxed text-zinc-600">
        <p><strong className="text-black">Délais:</strong> 2-4 jours ouvrables. Casablanca 24-48h.</p>
        <p><strong className="text-black">Frais:</strong> 30 MAD. Gratuite dès 600 MAD.</p>
        <p><strong className="text-black">Paiement à la livraison:</strong> Vous réglez en espèces à la réception.</p>
        <p><strong className="text-black">Suivi:</strong> SMS de confirmation + appel du livreur.</p>
        <p>Villes desservies: Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir, Meknès, Oujda, Kenitra, Tétouan, Safi, El Jadida, Beni Mellal, Nador, Khouribga et plus.</p>
      </div>
    </div>
  )
}
