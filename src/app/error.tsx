"use client"
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-[600px] px-4 py-20 text-center">
      <h1 className="text-2xl tracking-[0.2em] mb-4">ERREUR</h1>
      <p className="text-sm text-zinc-500 mb-6">{error.message}</p>
      <button onClick={reset} className="bg-black text-white px-6 py-3 text-xs tracking-widest">RÉESSAYER</button>
    </div>
  )
}
