"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { useTodo } from "@/context/todo-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertTriangle, BarChart, Tag } from "lucide-react"

export function TodoStats() {
  const { stats, state, allTags } = useTodo()

  const tagStats = useMemo(() => {
    const result: Record<string, number> = {}

    allTags.forEach((tag) => {
      result[tag] = state.todos.filter((todo) => todo.tags.includes(tag) && todo.status !== "completed").length
    })

    return Object.entries(result)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }, [state.todos, allTags])

  const completionRate = useMemo(() => {
    if (stats.total === 0) return 0
    return Math.round((stats.completed / stats.total) * 100)
  }, [stats])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tasks</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">{stats.completed} completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completion Rate</CardDescription>
            <CardTitle className="text-3xl">{completionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overdue</CardDescription>
            <CardTitle className="text-3xl text-destructive">{stats.overdue}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-destructive mr-2" />
            <div className="text-sm text-muted-foreground">Require attention</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Due Soon</CardDescription>
            <CardTitle className="text-3xl">{stats.dueSoon}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Clock className="h-4 w-4 text-yellow-500 mr-2" />
            <div className="text-sm text-muted-foreground">Due in the next 24 hours</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Task Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-slate-500" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <span className="text-sm font-medium">{stats.pending}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-slate-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.pending / stats.total) * 100 || 0}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                    <span className="text-sm">In Progress</span>
                  </div>
                  <span className="text-sm font-medium">{stats.inProgress}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.inProgress / stats.total) * 100 || 0}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <span className="text-sm font-medium">{stats.completed}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.completed / stats.total) * 100 || 0}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Top Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tagStats.length > 0 ? (
              <div className="space-y-4">
                {tagStats.map(([tag, count]) => (
                  <div key={tag} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{tag}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / stats.total) * 100 || 0}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No tags found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Task Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-blue-500">
                  {state.todos.filter((todo) => todo.priority === "low" && todo.status !== "completed").length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Low Priority</div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-yellow-500">
                  {state.todos.filter((todo) => todo.priority === "medium" && todo.status !== "completed").length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Medium Priority</div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-red-500">
                  {state.todos.filter((todo) => todo.priority === "high" && todo.status !== "completed").length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">High Priority</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

