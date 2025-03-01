"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { useTodo } from "@/context/todo-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Plus, Tag, X, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TodoPriority, TodoStatus } from "@/context/todo-context"

export function TodoForm() {
  const { addTodo, allTags } = useTodo()
  const [expanded, setExpanded] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<TodoPriority>("medium")
  const [status, setStatus] = useState<TodoStatus>("pending")
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setPriority("medium")
    setStatus("pending")
    setDueDate(null)
    setTags([])
    setNewTag("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    addTodo({
      title,
      description,
      priority,
      status,
      dueDate: dueDate ? dueDate.toISOString() : null,
      tags,
    })

    resetForm()
    setExpanded(false)
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
    <motion.div
      layout
      className="rounded-lg border bg-gradient-to-br from-background to-background/80 backdrop-blur-sm text-card-foreground shadow-md"
    >
      <form onSubmit={handleSubmit} className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              id="new-todo-input"
              type="text"
              placeholder="Add a new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 bg-background/50 backdrop-blur-sm border shadow-sm transition-all focus:shadow-md"
              onFocus={() => setExpanded(true)}
            />
            <Button
              type="button"
              onClick={() => setExpanded(!expanded)}
              variant="ghost"
              size="icon"
              className="hover:bg-accent/10 transition-all"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-4 overflow-hidden"
              >
                <Textarea
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] bg-background/50 backdrop-blur-sm border shadow-sm transition-all focus:shadow-md"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={priority} onValueChange={(value: TodoPriority) => setPriority(value)}>
                      <SelectTrigger className="bg-background/50 backdrop-blur-sm border shadow-sm transition-all hover:shadow-md">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={status} onValueChange={(value: TodoStatus) => setStatus(value)}>
                      <SelectTrigger className="bg-background/50 backdrop-blur-sm border shadow-sm transition-all hover:shadow-md">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Due Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-background/50 backdrop-blur-sm border shadow-sm transition-all hover:shadow-md",
                            !dueDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1 bg-accent/10 hover:bg-accent/20 transition-colors"
                      >
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Add a tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="pl-10 bg-background/50 backdrop-blur-sm border shadow-sm transition-all focus:shadow-md"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTag()
                          }
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={addTag}
                      className="bg-accent hover:bg-accent/90 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {allTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {allTags
                        .filter((tag) => !tags.includes(tag))
                        .map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer hover:bg-accent/10 transition-colors"
                            onClick={() => selectExistingTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      setExpanded(false)
                    }}
                    className="bg-background/50 backdrop-blur-sm border shadow-sm transition-all hover:shadow-md"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!title.trim()}
                    className="bg-accent hover:bg-accent/90 transition-colors"
                  >
                    Add Task
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </motion.div>
  )
}

