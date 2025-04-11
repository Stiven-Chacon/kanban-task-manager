import type { Priority } from "@/features/kanban/types"

const priorityColors = {
  alta: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100",
  media: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100",
  baja: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100",
}

export function getPriorityColor(priority: Priority): string {
  return priorityColors[priority]
}
