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

 
}
