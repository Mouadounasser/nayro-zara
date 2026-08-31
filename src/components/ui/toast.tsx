"use client"
import * as React from "react"

type Toast = { id: string; message: string; type?: "success" | "error" | "info" }

const ToastContext = React.createContext<{
  toasts: Toast[]
  toast: (msg: string, type?: Toast["type"]) => void
}>({ toasts: [], toast: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`px-4 py-3 text-sm shadow-lg border animate-in fade-in slide-in-from-bottom-2 ${
              t.type === "success" ? "bg-black text-white border-black" :
              t.type === "error" ? "bg-red-600 text-white border-red-600" :
              "bg-white text-black border-zinc-200"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return React.useContext(ToastContext)
}
