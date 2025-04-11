import type { Priority } from "@/features/kanban/types"
import { useKanbanData } from "@/features/kanban/hooks/use-kanban-data"

export function useTaskCreation(columnId: string, onComplete: () => void) {
  const { tasks, setTasks, columns, setColumns } = useKanbanData()

  const handleAddTask = (title: string, description: string, priority: Priority) => {
    if (!title.trim()) return

    const newTaskId = `task-${Date.now()}`
    const newTask = {
      id: newTaskId,
      title,
      description,
      priority,
      columnId,
    }

    // Añadir la tarea al objeto de tareas
    setTasks({
      ...tasks,
      [newTaskId]: newTask,
    })

    // Añadir el ID de la tarea a la columna
    const column = columns[columnId]
    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        taskIds: [...column.taskIds, newTaskId],
      },
    })

    // Llamar al callback de finalización
    onComplete()
  }

  return { handleAddTask }
}
