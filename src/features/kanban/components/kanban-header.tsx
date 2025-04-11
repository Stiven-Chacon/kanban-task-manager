import { CalendarDays } from "lucide-react"

export default function KanbanHeader() {
  return (
    <div className="text-center mb-6 md:mb-10 lg:mb-12">
      <div className="inline-flex items-center justify-center p-1.5 md:p-2 bg-white dark:bg-slate-800 rounded-full shadow-md mb-4 md:mb-6">
        <CalendarDays className="h-6 w-6 md:h-8 md:w-8 text-emerald-500" />
      </div>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent mb-2 md:mb-3">
        Tablero Kanban
      </h1>
      <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto rounded-full mb-2 md:mb-4"></div>
      <p className="text-xs md:text-sm lg:text-base text-slate-600 dark:text-slate-400 max-w-xs md:max-w-lg lg:max-w-2xl mx-auto">
        Organiza tus tareas y visualiza tu flujo de trabajo de manera eficiente
      </p>
    </div>
  )
}
