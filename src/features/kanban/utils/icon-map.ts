import { Circle, Clock, CheckCircle2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"

// Mapa para convertir nombres de iconos en strings a componentes reales
export const iconMap: Record<string, LucideIcon> = {
  Circle,
  Clock,
  CheckCircle2,
}

// Función para obtener el componente de icono a partir de su nombre
export function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] || Circle
}
