"use client";

import { DragDropContext } from "@hello-pangea/dnd"
import KanbanHeader from "@/features/kanban/components/kanban-header"
import KanbanColumn from "@/features/kanban/components/kanban-column"
import { useKanbanBoard } from "@/features/kanban/hooks/use-kanban-board"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function KanbanContainer() {
  const { columns, tasks, columnOrder, isLoading, error, handleDragEnd, handleCreateTask, handleDeleteTask } =
    useKanbanBoard()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [activeColumnIndex, setActiveColumnIndex] = useState(0)

  // Para vista móvil, mostraremos solo una columna a la vez
  const handlePrevColumn = () => {
    setActiveColumnIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNextColumn = () => {
    setActiveColumnIndex((prev) => (prev < columnOrder.length - 1 ? prev + 1 : prev))
  }

  if (isLoading) {
    return (
      <>
        <KanbanHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-full animate-pulse">
                <div className="p-3 md:p-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
                <div className="p-3 min-h-[200px]">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-20 w-full mb-3 bg-slate-200 dark:bg-slate-700 rounded" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }
  
  if (error) {
    return (
      <>
        <KanbanHeader />
        <div className="mb-6 flex items-start gap-2 rounded-md border border-red-300 bg-red-100 p-4 text-sm text-red-800 dark:border-red-700 dark:bg-red-950 dark:text-red-200">
          <svg
            className="h-4 w-4 mt-0.5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M12 6a9 9 0 100 18 9 9 0 000-18z"
            />
          </svg>
          <span>{error}</span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </>
    )
  }
  

  return (
    <>
      <KanbanHeader />
      <DragDropContext onDragEnd={handleDragEnd}>
        {isMobile ? (
          <div className="relative">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handlePrevColumn}
                disabled={activeColumnIndex === 0}
                className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 text-slate-700 dark:text-slate-200" />
              </button>
  
              <span className="text-sm font-medium">
                {columnOrder.length > 0 ? columns[columnOrder[activeColumnIndex]]?.title : ""}
              </span>
  
              <button
                onClick={handleNextColumn}
                disabled={activeColumnIndex === columnOrder.length - 1}
                className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4 text-slate-700 dark:text-slate-200" />
              </button>
            </div>
  
            <div className="w-full">
              {columnOrder.map((columnId, index) => {
                const column = columns[columnId]
                const columnTasks = column.taskIds.map((taskId) => tasks[taskId])
  
                return (
                  <div
                    key={column.id}
                    className={`w-full transition-opacity duration-300 ${
                      index === activeColumnIndex ? "block" : "hidden"
                    }`}
                  >
                    <KanbanColumn
                      column={column}
                      tasks={columnTasks}
                      onDeleteTask={column.id === "done" ? handleDeleteTask : undefined}
                      onCreateTask={handleCreateTask}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {columnOrder.map((columnId) => {
              const column = columns[columnId]
              const columnTasks = column.taskIds.map((taskId) => tasks[taskId])
  
              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  onDeleteTask={column.id === "done" ? handleDeleteTask : undefined}
                  onCreateTask={handleCreateTask}
                />
              )
            })}
          </div>
        )}
      </DragDropContext>
    </>
  )
  
}
