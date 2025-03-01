"use client";

import { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { format, isBefore, isToday, addDays } from "date-fns";
import { useTodo } from "@/context/todo-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Clock,
  Edit,
  GripVertical,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Todo } from "@/context/todo-context";
import { TodoEditForm } from "@/components/todo-edit-form";

interface TodoItemProps {
  todo: Todo;
  enableDrag: boolean;
}

export function TodoItem({ todo, enableDrag }: TodoItemProps) {
  const { completeTodo, deleteTodo } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const dragControls = useDragControls();

  const isCompleted = todo.status === "completed";
  const isOverdue =
    todo.dueDate &&
    isBefore(new Date(todo.dueDate), new Date()) &&
    !isCompleted;
  const isDueSoon =
    todo.dueDate &&
    !isOverdue &&
    isBefore(new Date(todo.dueDate), addDays(new Date(), 2)) &&
    !isCompleted;

  const priorityColors = {
    low: "bg-blue-500/20 text-blue-500 dark:bg-blue-500/30 dark:text-blue-300",
    medium:
      "bg-yellow-500/20 text-yellow-600 dark:bg-yellow-500/30 dark:text-yellow-300",
    high: "bg-red-500/20 text-red-600 dark:bg-red-500/30 dark:text-red-300",
  };

  const statusColors = {
    pending:
      "bg-slate-500/20 text-slate-600 dark:bg-slate-500/30 dark:text-slate-300",
    "in-progress":
      "bg-purple-500/20 text-purple-600 dark:bg-purple-500/30 dark:text-purple-300",
    completed:
      "bg-green-500/20 text-green-600 dark:bg-green-500/30 dark:text-green-300",
  };

  return (
    <Reorder.Item
      value={todo}
      dragListener={enableDrag}
      dragControls={dragControls}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "group rounded-lg border bg-gradient-to-br from-background to-background/80 backdrop-blur-sm p-4 shadow-md transition-all hover:shadow-lg",
        isCompleted && "opacity-70"
      )}
    >
      <div className="flex items-start gap-3">
        {enableDrag && (
          <div
            className="mt-1 cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
        )}

        <Checkbox
          checked={isCompleted}
          onCheckedChange={() => completeTodo(todo.id)}
          className="mt-1 border-accent text-accent"
        />

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <h3
              className={cn(
                "font-medium",
                isCompleted && "line-through text-muted-foreground"
              )}
            >
              {todo.title}
            </h3>

            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DialogTrigger asChild onClick={() => setIsEditing(true)}>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {todo.description && (
            <p
              className={cn(
                "text-sm text-muted-foreground",
                isCompleted && "line-through"
              )}
            >
              {todo.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="outline" className={priorityColors[todo.priority]}>
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
            </Badge>

            <Badge variant="outline" className={statusColors[todo.status]}>
              {todo.status === "in-progress"
                ? "In Progress"
                : todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
            </Badge>

            {todo.dueDate && (
              <Badge
                variant="outline"
                className={cn(
                  "flex items-center gap-1",
                  isOverdue &&
                    "bg-red-500/20 text-red-600 dark:bg-red-500/30 dark:text-red-300",
                  isDueSoon &&
                    !isOverdue &&
                    "bg-yellow-500/20 text-yellow-600 dark:bg-yellow-500/30 dark:text-yellow-300"
                )}
              >
                <Calendar className="h-3 w-3" />
                {isToday(new Date(todo.dueDate))
                  ? "Today"
                  : format(new Date(todo.dueDate), "MMM d")}
              </Badge>
            )}

            {todo.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-accent/10 hover:bg-accent/20 transition-colors"
              >
                {tag}
              </Badge>
            ))}

            {todo.completedAt && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                Completed {format(new Date(todo.completedAt), "MMM d")}
              </span>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TodoEditForm todo={todo} onClose={() => setIsEditing(false)} />
        </DialogContent>
      </Dialog>
    </Reorder.Item>
  );
}
