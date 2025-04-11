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

  // Crear una nueva tarea
  const handleCreateTask = async (columnId: string, title: string, description: string, priority: Priority) => {
    try {
      // Optimistic UI update
      const tempId = `temp-${Date.now()}`
      const tempTask = {
        id: tempId,
        title,
        description,
        priority,
        columnId,
      }

      setTasks({
        ...tasks,
        [tempId]: tempTask,
      })

      const column = columns[columnId]
      setColumns({
        ...columns,
        [columnId]: {
          ...column,
          taskIds: [...column.taskIds, tempId],
        },
      })

      // Actualizar en el servidor
      const newTask = await KanbanService.createTask(columnId, title, description, priority)

      // Actualizar con los datos reales del servidor
      setTasks((prevTasks) => {
        const { [tempId]: _, ...restTasks } = prevTasks
        return {
          ...restTasks,
          [newTask.id]: newTask,
        }
      })

      setColumns((prevColumns) => {
        const column = prevColumns[columnId]
        const updatedTaskIds = column.taskIds.filter((id) => id !== tempId).concat(newTask.id)
        return {
          ...prevColumns,
          [columnId]: {
            ...column,
            taskIds: updatedTaskIds,
          },
        }
      })

      return true
    } catch (err) {
      setError("Error al crear la tarea. Por favor, intenta de nuevo.")
      return false
    }
  }

  // Eliminar una tarea
  const handleDeleteTask = async (taskId: string, columnId: string) => {
    try {
      // Optimistic UI update
      const column = columns[columnId]
      const newTaskIds = column.taskIds.filter((id) => id !== taskId)

      setColumns({
        ...columns,
        [columnId]: {
          ...column,
          taskIds: newTaskIds,
        },
      })

      const newTasks = { ...tasks }
      delete newTasks[taskId]
      setTasks(newTasks)

      // Actualizar en el servidor
      await KanbanService.deleteTask(taskId, columnId)
    } catch (err) {
      setError("Error al eliminar la tarea. Por favor, intenta de nuevo.")
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
    handleCreateTask,
    handleDeleteTask,
  }
}
