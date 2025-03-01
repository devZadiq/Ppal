"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTodo } from "@/context/todo-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp, Filter, SortAsc, SortDesc } from "lucide-react"
import type { TodoPriority, TodoStatus } from "@/context/todo-context"

export function TodoFilters() {
  const { state, setFilter, setSort, allTags } = useTodo()
  const [expanded, setExpanded] = useState(false)

  const handleStatusChange = (value: TodoStatus | "all") => {
    setFilter({ status: value })
  }

  const handlePriorityChange = (value: TodoPriority | "all") => {
    setFilter({ priority: value })
  }

  const handleSortChange = (by: "dueDate" | "priority" | "createdAt" | "title") => {
    if (state.sort.by === by) {
      setSort({
        by,
        direction: state.sort.direction === "asc" ? "desc" : "asc",
      })
    } else {
      setSort({
        by,
        direction: "asc",
      })
    }
  }

  const toggleTag = (tag: string) => {
    const newTags = state.filter.tags.includes(tag)
      ? state.filter.tags.filter((t) => t !== tag)
      : [...state.filter.tags, tag]

    setFilter({ tags: newTags })
  }

  const clearFilters = () => {
    setFilter({
      status: "all",
      priority: "all",
      tags: [],
    })
  }

  const hasActiveFilters =
    state.filter.status !== "all" || state.filter.priority !== "all" || state.filter.tags.length > 0

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Filters & Sort</h3>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                Clear Filters
              </Button>
            )}

            <Button variant="ghost" size="icon" onClick={() => setExpanded(!expanded)} className="h-8 w-8">
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={state.filter.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={state.filter.priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {allTags.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={state.filter.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={state.sort.by === "dueDate" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSortChange("dueDate")}
                    className="h-8"
                  >
                    Due Date
                    {state.sort.by === "dueDate" &&
                      (state.sort.direction === "asc" ? (
                        <SortAsc className="ml-2 h-3 w-3" />
                      ) : (
                        <SortDesc className="ml-2 h-3 w-3" />
                      ))}
                  </Button>

                  <Button
                    variant={state.sort.by === "priority" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSortChange("priority")}
                    className="h-8"
                  >
                    Priority
                    {state.sort.by === "priority" &&
                      (state.sort.direction === "asc" ? (
                        <SortAsc className="ml-2 h-3 w-3" />
                      ) : (
                        <SortDesc className="ml-2 h-3 w-3" />
                      ))}
                  </Button>

                  <Button
                    variant={state.sort.by === "createdAt" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSortChange("createdAt")}
                    className="h-8"
                  >
                    Date Created
                    {state.sort.by === "createdAt" &&
                      (state.sort.direction === "asc" ? (
                        <SortAsc className="ml-2 h-3 w-3" />
                      ) : (
                        <SortDesc className="ml-2 h-3 w-3" />
                      ))}
                  </Button>

                  <Button
                    variant={state.sort.by === "title" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSortChange("title")}
                    className="h-8"
                  >
                    Title
                    {state.sort.by === "title" &&
                      (state.sort.direction === "asc" ? (
                        <SortAsc className="ml-2 h-3 w-3" />
                      ) : (
                        <SortDesc className="ml-2 h-3 w-3" />
                      ))}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

