"use client";

import { useState } from "react"
import { Droppable } from "@hello-pangea/dnd"
import { PlusCircle } from "lucide-react"
import KanbanTask from "@/features/kanban/components/kanban-task"
import TaskForm from "@/features/kanban/components/task-form"
import type { Column, Task, Priority } from "@/features/kanban/types"

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
  onDeleteTask?: (taskId: string, columnId: string) => void
  onCreateTask: (columnId: string, title: string, description: string, priority: Priority) => Promise<boolean>
}

export default function KanbanColumn({ column, tasks, onDeleteTask, onCreateTask }: KanbanColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const Icon = column.icon

  const handleAddTask = async (title: string, description: string, priority: Priority) => {
    const success = await onCreateTask(column.id, title, description, priority)
    if (success) {
      setIsAddingTask(false)
    }
  }

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-full flex flex-col">
        <div className="p-3 md:p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Icon className={`h-4 w-4 md:h-5 md:w-5 mr-2 ${column.color}`} />
            <h2 className="font-semibold text-sm md:text-base text-slate-700 dark:text-slate-200">{column.title}</h2>
            <span className="ml-2 text-xs bg-slate-100 dark:bg-slate-700">
              {tasks.length}
            </span> 
          </div>
        </div>

        <Droppable droppableId={column.id}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="min-h-[150px] p-2 md:p-3 flex-grow overflow-y-auto max-h-[calc(100vh-300px)] md:max-h-[calc(100vh-250px)] scrollbar-thin"
            >
              {tasks.map((task, index) => (
                <KanbanTask
                  key={task.id}
                  task={task}
                  index={index}
                  onDelete={onDeleteTask ? () => onDeleteTask(task.id, column.id) : undefined}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {isAddingTask ? (
          <TaskForm onSubmit={handleAddTask} onCancel={() => setIsAddingTask(false)} />
        ) : (
          <button
            className="w-full justify-start p-2 md:p-3 rounded-none rounded-b-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-t border-slate-200 dark:border-slate-700 text-xs md:text-sm"
            onClick={() => setIsAddingTask(true)}
          >
            <PlusCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            Añadir tarea
          </button>
        )}
      </div>
    </div>
  )
}
