import type { ColumnMap, TaskMap, Task, Priority, KanbanBoard } from "@/features/kanban/types"

const API_URL = "http://localhost:3001"

export const KanbanService = {
  // Obtener todo el tablero
  getBoard: async (): Promise<KanbanBoard> => {
    try {
      const [columnsResponse, tasksResponse] = await Promise.all([
        fetch(`${API_URL}/columns`),
        fetch(`${API_URL}/tasks`),
      ])

      if (!columnsResponse.ok || !tasksResponse.ok) {
        throw new Error("Error fetching data")
      }

      const columns = await columnsResponse.json()
      const tasks = await tasksResponse.json()

      // Convertir arrays a objetos mapeados por ID
      const columnsMap: ColumnMap = {}
      const tasksMap: TaskMap = {}

      columns.forEach((column: any) => {
        columnsMap[column.id] = column
      })

      tasks.forEach((task: any) => {
        tasksMap[task.id] = task
      })

      return {
        columns: columnsMap,
        tasks: tasksMap,
        columnOrder: columns.map((column: any) => column.id),
      }
    } catch (error) {
      console.error("Error fetching board:", error)
      throw error
    }
  },

  // Crear una nueva tarea
  createTask: async (columnId: string, title: string, description: string, priority: Priority): Promise<Task> => {
    try {
      const newTask = {
        id: `task-${Date.now()}`,
        title,
        description,
        priority,
        columnId,
      }

      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      })

      if (!response.ok) {
        throw new Error("Error creating task")
      }

      const task = await response.json()

      // Actualizar la columna para incluir la nueva tarea
      const columnResponse = await fetch(`${API_URL}/columns/${columnId}`)
      if (!columnResponse.ok) {
        throw new Error("Error fetching column")
      }

      const column = await columnResponse.json()
      const updatedTaskIds = [...column.taskIds, task.id]

      await fetch(`${API_URL}/columns/${columnId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskIds: updatedTaskIds }),
      })

      return task
    } catch (error) {
      console.error("Error creating task:", error)
      throw error
    }
  },

  // Actualizar posición de tarea
  updateTaskPosition: async (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    sourceIndex: number,
    destinationIndex: number,
  ): Promise<void> => {
    try {
      // Obtener columnas de origen y destino
      const [sourceColumnResponse, destColumnResponse] = await Promise.all([
        fetch(`${API_URL}/columns/${sourceColumnId}`),
        fetch(`${API_URL}/columns/${destinationColumnId}`),
      ])

      if (!sourceColumnResponse.ok || !destColumnResponse.ok) {
        throw new Error("Error fetching columns")
      }

      const sourceColumn = await sourceColumnResponse.json()
      const destColumn = await destColumnResponse.json()

      // Crear nuevos arrays de tareas
      const sourceTaskIds = [...sourceColumn.taskIds]
      sourceTaskIds.splice(sourceIndex, 1)

      const destTaskIds = [...destColumn.taskIds]
      destTaskIds.splice(destinationIndex, 0, taskId)

      // Actualizar columnas
      await Promise.all([
        fetch(`${API_URL}/columns/${sourceColumnId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskIds: sourceTaskIds }),
        }),
        fetch(`${API_URL}/columns/${destinationColumnId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskIds: destTaskIds }),
        }),
      ])

      // Si la tarea se movió a una columna diferente, actualizar su columnId
      if (sourceColumnId !== destinationColumnId) {
        await fetch(`${API_URL}/tasks/${taskId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ columnId: destinationColumnId }),
        })
      }
    } catch (error) {
      console.error("Error updating task position:", error)
      throw error
    }
  },

  // Eliminar tarea
  deleteTask: async (taskId: string, columnId: string): Promise<void> => {
    try {
      // Eliminar la tarea
      await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
      })

      // Actualizar la columna para quitar la referencia a la tarea
      const columnResponse = await fetch(`${API_URL}/columns/${columnId}`)
      if (!columnResponse.ok) {
        throw new Error("Error fetching column")
      }

      const column = await columnResponse.json()
      const updatedTaskIds = column.taskIds.filter((id: string) => id !== taskId)

      await fetch(`${API_URL}/columns/${columnId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskIds: updatedTaskIds }),
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      throw error
    }
  },
}
