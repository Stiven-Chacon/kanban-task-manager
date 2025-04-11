"use client"

import { useState } from "react"
import type { DropResult } from "@hello-pangea/dnd"
import type { ColumnMap, TaskMap } from "@/features/kanban/types"

export function useKanbanActions(initialColumns: ColumnMap, initialTasks: TaskMap) {
  const [columns, setColumns] = useState<ColumnMap>(initialColumns)
  const [tasks, setTasks] = useState<TaskMap>(initialTasks)

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    // Si no hay destino o si el elemento se soltó en la misma posición
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]

    // Si se mueve dentro de la misma columna
    if (sourceColumn.id === destColumn.id) {
      const newTaskIds = Array.from(sourceColumn.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      }

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      })
      return
    }

    // Moviendo de una columna a otra
    const sourceTaskIds = Array.from(sourceColumn.taskIds)
    sourceTaskIds.splice(source.index, 1)

    const destinationTaskIds = Array.from(destColumn.taskIds)
    destinationTaskIds.splice(destination.index, 0, draggableId)

    setColumns({
      ...columns,
      [sourceColumn.id]: {
        ...sourceColumn,
        taskIds: sourceTaskIds,
      },
      [destColumn.id]: {
        ...destColumn,
        taskIds: destinationTaskIds,
      },
    })
  }

  const handleDeleteTask = (taskId: string, columnId: string) => {
    // Crear una copia de los taskIds de la columna sin la tarea eliminada
    const column = columns[columnId]
    const newTaskIds = column.taskIds.filter((id) => id !== taskId)

    // Actualizar el estado de las columnas
    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        taskIds: newTaskIds,
      },
    })

    // Eliminar la tarea del estado de tareas
    const newTasks = { ...tasks }
    delete newTasks[taskId]
    setTasks(newTasks)
  }

  return {
    columns,
    tasks,
    handleDragEnd,
    handleDeleteTask,
  }
}
