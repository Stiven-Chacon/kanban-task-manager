"use client"

import { useState, useEffect } from "react"
import { KanbanService } from "@/features/kanban/services/kanban-service"
import type { ColumnMap, TaskMap, Priority } from "@/features/kanban/types"
import type { DropResult } from "@hello-pangea/dnd"

export function useKanbanBoard() {
  const [columns, setColumns] = useState<ColumnMap>({})
  const [tasks, setTasks] = useState<TaskMap>({})
  const [columnOrder, setColumnOrder] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await KanbanService.getBoard()
        setColumns(data.columns)
        setTasks(data.tasks)
        setColumnOrder(data.columnOrder)
        setError(null)
      } catch (err) {
        setError("Error al cargar el tablero. Por favor, intenta de nuevo.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Manejar el arrastrar y soltar
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    // Si no hay destino o si el elemento se soltó en la misma posición
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    try {
      // Actualizar UI inmediatamente para una experiencia fluida
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
      } else {
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

        // Actualizar el columnId de la tarea
        setTasks({
          ...tasks,
          [draggableId]: {
            ...tasks[draggableId],
            columnId: destination.droppableId,
          },
        })
      }

      // Actualizar en el servidor
      await KanbanService.updateTaskPosition(
        draggableId,
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index,
      )
    } catch (err) {
      // Revertir cambios en caso de error
      setError("Error al mover la tarea. Los cambios pueden no haberse guardado.")
      // Recargar datos para asegurar consistencia
      const data = await KanbanService.getBoard()
      setColumns(data.columns)
      setTasks(data.tasks)
    }
  }

  return {
    columns,
    tasks,
    columnOrder,
    isLoading,
    error,
    handleDragEnd,
  }
}
