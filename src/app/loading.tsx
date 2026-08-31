export default function Loading() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-zinc-200" />
            <div className="h-3 bg-zinc-200 mt-3 w-3/4" />
            <div className="h-3 bg-zinc-200 mt-2 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
