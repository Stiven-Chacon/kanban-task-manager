"use client";

import { useState } from "react"
import type { Priority } from "@/features/kanban/types"

interface TaskFormProps {
  onSubmit: (title: string, description: string, priority: Priority) => void
  onCancel: () => void
}

export default function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("media")

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit(title, description, priority)
    }
  }

  return (
    <div className="p-2 md:p-3 border-t border-slate-200 dark:border-slate-700">
    <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Título de la tarea"
      className="mb-2 w-full text-xs md:text-sm px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
    />
  
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Descripción (opcional)"
      className="mb-2 w-full text-xs md:text-sm px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 min-h-[60px] max-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
    />
  
    <div className="flex flex-wrap gap-1 md:gap-2 mb-2">
      <button
        type="button"
        onClick={() => setPriority("alta")}
        className={`text-xs h-7 px-3 rounded-md border ${
          priority === "alta"
            ? "bg-rose-600 text-white hover:bg-rose-700"
            : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        Alta
      </button>
      <button
        type="button"
        onClick={() => setPriority("media")}
        className={`text-xs h-7 px-3 rounded-md border ${
          priority === "media"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        Media
      </button>
      <button
        type="button"
        onClick={() => setPriority("baja")}
        className={`text-xs h-7 px-3 rounded-md border ${
          priority === "baja"
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        Baja
      </button>
    </div>
  
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleSubmit}
        className="text-xs h-7 px-4 rounded-md bg-primary-600 text-white hover:bg-primary-700"
      >
        Añadir
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="text-xs h-7 px-4 rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        Cancelar
      </button>
    </div>
  </div>  
  )
}
