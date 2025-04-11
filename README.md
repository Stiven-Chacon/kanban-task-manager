# 🧩 Kanban Task Manager

Este proyecto es un **gestor de tareas tipo Kanban** desarrollado con **React**, **TailwindCSS** y un **backend simulado con json-server**. Permite la creación y gestión de tareas, visualización en columnas por estado, y persistencia temporal de datos.

---

## 📌 Características

### 🎯 Funcionales

- Crear tareas con título, descripción, estado y prioridad.
- Cambiar el estado de las tareas: `pendiente → en progreso → completada`.
- Mostrar tareas en un tablero visual dividido por estado.
- Interfaz 100% responsiva (móvil y escritorio).
- Sin uso de librerías externas de UI (solo TailwindCSS).
- Persistencia temporal con Context API o Redux + IndexedDB.
- Backend simulado con `json-server`.

### 🧱 Técnicas

- Arquitectura modular siguiendo principios de **Clean Architecture**.
- Separación por capas: `components`, `pages`, `services`, `hooks`, etc.
- Uso de patrones de composición en componentes.
- Código limpio, legible y seguro.

---

## ⚙️ Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- json-server (se instala automáticamente)

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/kanban-task-manager.git
cd kanban-task-manager 
```
### 2. Instala las dependencias
 - npm install


### 3. Levanta el backend simulado con json-server
 - npx json-server --watch db.json --port 3001
 - 
Esto expondrá las siguientes rutas:
  - http://localhost:3001/tasks
  - http://localhost:3001/columns


### 4. Levanta el frontend de React
 - npm run dev


👨‍💻 Autor
Desarrollado con ❤️ por Stiven Chacon
