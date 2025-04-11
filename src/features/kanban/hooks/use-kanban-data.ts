import { useState } from "react"
import { Circle, Clock, CheckCircle2 } from "lucide-react"
import type { ColumnMap, TaskMap } from "@/features/kanban/types"
import { getIconComponent } from "@/features/kanban/utils/icon-map"

// Esta función se usa para transformar los datos del API
export function transformApiData(
  apiColumns: any[],
  apiTasks: any[],
): {
  columns: ColumnMap
  tasks: TaskMap
  columnOrder: string[]
} {
  const columns: ColumnMap = {}
  const tasks: TaskMap = {}

  // Transformar columnas
  apiColumns.forEach((column) => {
    columns[column.id] = {
      ...column,
      // Convertir el nombre del icono en un componente real
      icon: getIconComponent(column.icon),
    }
  })

  // Transformar tareas
  apiTasks.forEach((task) => {
    tasks[task.id] = task
  })

  return {
    columns,
    tasks,
    columnOrder: apiColumns.map((column) => column.id),
  }
}

// Hook para obtener datos iniciales (fallback si el API falla)
export function useKanbanData() {
  const [columns, setColumns] = useState<ColumnMap>({
    todo: {
      id: "todo",
      title: "Por hacer",
      taskIds: ["task-1", "task-2", "task-3"],
      icon: Circle,
      color: "text-slate-600",
    },
    inProgress: {
      id: "inProgress",
      title: "En progreso",
      taskIds: ["task-4", "task-5"],
      icon: Clock,
      color: "text-amber-500",
    },
    done: {
      id: "done",
      title: "Completado",
      taskIds: ["task-6"],
      icon: CheckCircle2,
      color: "text-emerald-500",
    },
  })

  const [tasks, setTasks] = useState<TaskMap>({
    "task-1": {
      id: "task-1",
      title: "Crear diseño de la página",
      description: "Diseñar la interfaz de usuario para la página principal del sitio web.",
      priority: "alta",
      columnId: "todo",
    },
    "task-2": {
      id: "task-2",
      title: "Implementar autenticación",
      description: "Configurar el sistema de autenticación de usuarios.",
      priority: "media",
      columnId: "todo",
    },
    "task-3": {
      id: "task-3",
      title: "Configurar base de datos",
      description: "Crear el esquema de la base de datos.",
      priority: "baja",
      columnId: "todo",
    },
    "task-4": {
      id: "task-4",
      title: "Desarrollar API",
      description: "Crear los endpoints de la API RESTful.",
      priority: "alta",
      columnId: "inProgress",
    },
    "task-5": {
      id: "task-5",
      title: "Crear componentes UI",
      description: "Desarrollar componentes reutilizables para la interfaz de usuario.",
      priority: "media",
      columnId: "inProgress",
    },
    "task-6": {
      id: "task-6",
      title: "Configurar CI/CD",
      description: "Implementar un pipeline de integración y despliegue continuo.",
      priority: "media",
      columnId: "done",
    },
  })

  const columnOrder = ["todo", "inProgress", "done"]

  return {
    columns,
    setColumns,
    tasks,
    setTasks,
    columnOrder,
  }
}
