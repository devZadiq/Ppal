"use client"

import { useState } from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { useTodo } from "@/context/todo-context"
import { TodoItem } from "@/components/todo-item"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function TodoList() {
  const { filteredTodos, reorderTodos, clearCompleted } = useTodo()
  const [enableDrag, setEnableDrag] = useState(false)

  if (filteredTodos.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
        <p className="text-muted-foreground">No tasks found</p>
      </motion.div>
    )
  }

  const completedTodos = filteredTodos.filter((todo) => todo.status === "completed")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setEnableDrag(!enableDrag)}>
          {enableDrag ? "Done Reordering" : "Reorder Tasks"}
        </Button>

        {completedTodos.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={clearCompleted}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Completed
          </Button>
        )}
      </div>

      <Reorder.Group axis="y" values={filteredTodos} onReorder={reorderTodos} className="space-y-3">
        <AnimatePresence initial={false}>
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} enableDrag={enableDrag} />
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  )
}

