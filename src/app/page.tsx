import KanbanContainer from "@/features/kanban/kanban-container"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
    <div className="container mx-auto py-4 px-3 md:py-8 md:px-6 lg:py-10">
      <KanbanContainer />
    </div>
  </main>
  );
}
