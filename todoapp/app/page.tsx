import type { Metadata } from "next"
import TodoApp from "@/components/todo-app"
import RegisterSW from "@/app/register-sw"

export const metadata: Metadata = {
  title: "TaskFlow | Advanced Todo Application",
  description: "A modern, feature-rich todo application with smooth animations",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <RegisterSW />
      <TodoApp />
    </main>
  )
}

