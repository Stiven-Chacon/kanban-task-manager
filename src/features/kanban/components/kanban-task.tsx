"use client";

import { useState } from "react"
import { Draggable } from "@hello-pangea/dnd"
import type { Task } from "@/features/kanban/types"
import { getPriorityColor } from "@/features/kanban/utils/priority-utils"
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react"

interface KanbanTaskProps {
  task: Task
  index: number
  onDelete?: () => void
}

export default function KanbanTask({ task, index, onDelete }: KanbanTaskProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
     ref={provided.innerRef}
     {...provided.draggableProps}
     {...provided.dragHandleProps}
     className="mb-2 md:mb-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow"
   >
     <div className="p-2 md:p-3">
       <div className="flex justify-between items-start mb-1">
         <h3 className="text-xs md:text-sm font-medium text-slate-800 dark:text-slate-200 break-words">
           {task.title}
         </h3>
         <button className="h-6 w-6 p-0 ml-1" onClick={() => setIsExpanded(!isExpanded)}>
           {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
         </button>
       </div>
   
       {isExpanded && task.description && (
         <div className="text-xs text-slate-600 dark:text-slate-400 mb-2 mt-1 break-words whitespace-pre-wrap">
           {task.description}
         </div>
       )}
   
       <div className="flex justify-between items-center flex-wrap gap-1">
      
         <span className={`px-2 py-0.5 rounded text-white text-xs ${getPriorityColor(task.priority)}`}>
           {task.priority === "alta"
             ? "Prioridad alta"
             : task.priority === "media"
             ? "Prioridad media"
             : "Prioridad baja"}
         </span> 
   
         {onDelete && (
           <button
             className="h-6 w-6 md:h-7 md:w-7 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950 rounded"
             onClick={(e) => {
               e.stopPropagation()
               onDelete()
             }}
           >
             <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
           </button>
         )}
       </div>
     </div>
        </div>
      )}
    </Draggable>
  )
}
