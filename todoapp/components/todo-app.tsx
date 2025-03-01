"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useHotkeys } from "react-hotkeys-hook"
import { useTheme } from "next-themes"
import { TodoProvider } from "@/context/todo-context"
import { TodoList } from "@/components/todo-list"
import { TodoForm } from "@/components/todo-form"
import { TodoHeader } from "@/components/todo-header"
import { TodoStats } from "@/components/todo-stats"
import { TodoFilters } from "@/components/todo-filters"
import { TodoSettings } from "@/components/todo-settings"
import { InstallPWA } from "@/components/install-pwa"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, BarChart2, ListTodo } from "lucide-react"

export default function TodoApp() {
  const [mounted, setMounted] = useState(false)
  // Removed `theme` because it's not being used:
  useTheme() 

  const [showInstallBanner, setShowInstallBanner] = useState(false)

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)

    // Check if the app can be installed
    if ("serviceWorker" in navigator && window.matchMedia("(display-mode: browser)").matches) {
      setShowInstallBanner(true)
    }
  }, [])

  // Keyboard shortcuts
  useHotkeys("ctrl+n, cmd+n", () => document.getElementById("new-todo-input")?.focus())
  useHotkeys("ctrl+/, cmd+/", () => document.getElementById("search-input")?.focus())
  useHotkeys("ctrl+d, cmd+d", () => document.getElementById("toggle-theme-btn")?.click())

  if (!mounted) return null

  return (
    <TodoProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 dark:from-background dark:to-background/90">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container max-w-4xl mx-auto px-4 py-8"
        >
          <TodoHeader />

          {showInstallBanner && <InstallPWA onDismiss={() => setShowInstallBanner(false)} />}

          <Tabs defaultValue="todos" className="mt-6">
            <TabsList className="grid grid-cols-3 mb-8 bg-background/50 backdrop-blur-sm border shadow-lg">
              <TabsTrigger value="todos" className="flex items-center gap-2 data-[state=active]:bg-accent/10">
                <ListTodo className="h-4 w-4" />
                <span>Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2 data-[state=active]:bg-accent/10">
                <BarChart2 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-accent/10">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="todos" className="space-y-6">
              <TodoForm />
              <TodoFilters />
              <AnimatePresence mode="popLayout">
                <TodoList />
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="stats">
              <TodoStats />
            </TabsContent>

            <TabsContent value="settings">
              <TodoSettings />
            </TabsContent>
          </Tabs>

          <footer className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+N</kbd> to add a new task •{" "}
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+/</kbd> to search
            </p>
          </footer>
        </motion.div>
      </div>
    </TodoProvider>
  )
}
