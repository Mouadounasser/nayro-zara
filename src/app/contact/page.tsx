export const metadata = { title: "Contact | NAYRO" }
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 lg:px-8 py-16">
      <h1 className="text-3xl font-light tracking-[0.2em] mb-8 text-center">CONTACT</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6 text-sm">
          <div>
            <h3 className="tracking-[0.2em] text-xs mb-2">WHATSAPP</h3>
            <p className="text-zinc-600">+212 6 XX XX XX XX</p>
            <p className="text-xs text-zinc-400 mt-1">Réponse sous 2h, lun–sam 9h–19h</p>
          </div>
          <div>
            <h3 className="tracking-[0.2em] text-xs mb-2">EMAIL</h3>
            <p className="text-zinc-600">hello@nayro.ma</p>
          </div>
          <div>
            <h3 className="tracking-[0.2em] text-xs mb-2">SHOWROOM</h3>
            <p className="text-zinc-600">Casablanca — Sur rendez-vous</p>
          </div>
        </div>
        <form className="space-y-4">
          <input placeholder="Nom" className="w-full h-11 border border-zinc-200 px-4 text-sm focus:border-black outline-none" />
          <input placeholder="Email" className="w-full h-11 border border-zinc-200 px-4 text-sm focus:border-black outline-none" />
          <textarea placeholder="Message" rows={4} className="w-full border border-zinc-200 p-3 text-sm focus:border-black outline-none" />
          <button type="submit" className="w-full bg-black text-white h-11 tracking-[0.2em] text-xs">ENVOYER</button>
        </form>
      </div>
    </div>
  )
}
