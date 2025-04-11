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

}
