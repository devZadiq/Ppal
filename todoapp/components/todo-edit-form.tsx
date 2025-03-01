/* eslint-disable */

"use client"

import type React from "react"
import { useState } from "react"
import { format } from "date-fns"
import { useTodo } from "@/context/todo-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { DialogClose } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Plus, Tag, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Todo, TodoPriority, TodoStatus } from "@/context/todo-context"

interface TodoEditFormProps {
  todo: Todo
  onClose: () => void
}

export function TodoEditForm({ todo, onClose }: TodoEditFormProps) {
  const { updateTodo, allTags } = useTodo()
  const [title, setTitle] = useState(todo.title)
  const [description, setDescription] = useState(todo.description)
  const [priority, setPriority] = useState<TodoPriority>(todo.priority)
  const [status, setStatus] = useState<TodoStatus>(todo.status)
  const [dueDate, setDueDate] = useState<Date | null>(todo.dueDate ? new Date(todo.dueDate) : null)
  const [tags, setTags] = useState<string[]>(todo.tags)
  const [newTag, setNewTag] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    updateTodo({
      ...todo,
      title,
      description,
      priority,
      status,
      dueDate: dueDate ? dueDate.toISOString() : null,
      tags,
      completedAt:
        status === "completed" && todo.status !== "completed"
          ? new Date().toISOString()
          : status !== "completed" && todo.status === "completed"
            ? null
            : todo.completedAt,
    })

    onClose()
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const selectExistingTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... your other form elements */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ... your priority and status selects */}

        <div className="space-y-2">
          <label className="text-sm font-medium">Due Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate ? dueDate : undefined} // Handle null here
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* ... your tags section and submit button */}
    </form>
  )
}
