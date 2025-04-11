import type { LucideIcon } from "lucide-react"

export type Priority = "alta" | "media" | "baja"

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  columnId: string
}

export interface Column {
  id: string
  title: string
  taskIds: string[]
  icon: LucideIcon
  color: string
}

export interface TaskMap {
  [key: string]: Task
}

export interface ColumnMap {
  [key: string]: Column
}

export interface KanbanBoard {
  columns: ColumnMap
  tasks: TaskMap
  columnOrder: string[]
}
