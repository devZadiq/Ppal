"use client"

import type React from "react"

import { createContext, useContext, useEffect, useCallback, useReducer } from "react"
import { v4 as uuidv4 } from "uuid"

export type TodoPriority = "low" | "medium" | "high"
export type TodoStatus = "pending" | "in-progress" | "completed"

export interface Todo {
  id: string
  title: string
  description: string
  status: TodoStatus
  priority: TodoPriority
  dueDate: string | null
  tags: string[]
  createdAt: string
  completedAt: string | null
}

interface TodoState {
  todos: Todo[]
  filter: {
    status: TodoStatus | "all"
    priority: TodoPriority | "all"
    search: string
    tags: string[]
  }
  sort: {
    by: "dueDate" | "priority" | "createdAt" | "title"
    direction: "asc" | "desc"
  }
  history: {
    past: Todo[][]
    future: Todo[][]
  }
}

type TodoAction =
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "UPDATE_TODO"; payload: Todo }
  | { type: "DELETE_TODO"; payload: string }
  | { type: "COMPLETE_TODO"; payload: string }
  | { type: "SET_FILTER"; payload: Partial<TodoState["filter"]> }
  | { type: "SET_SORT"; payload: TodoState["sort"] }
  | { type: "CLEAR_COMPLETED" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "REORDER_TODOS"; payload: Todo[] }

interface TodoContextType {
  state: TodoState
  dispatch: React.Dispatch<TodoAction>
  addTodo: (todo: Omit<Todo, "id" | "createdAt" | "completedAt">) => void
  updateTodo: (todo: Todo) => void
  deleteTodo: (id: string) => void
  completeTodo: (id: string) => void
  setFilter: (filter: Partial<TodoState["filter"]>) => void
  setSort: (sort: TodoState["sort"]) => void
  clearCompleted: () => void
  undo: () => void
  redo: () => void
  reorderTodos: (todos: Todo[]) => void
  filteredTodos: Todo[]
  stats: {
    total: number
    completed: number
    pending: number
    inProgress: number
    overdue: number
    highPriority: number
    dueSoon: number
  }
  allTags: string[]
}

const initialState: TodoState = {
  todos: [],
  filter: {
    status: "all",
    priority: "all",
    search: "",
    tags: [],
  },
  sort: {
    by: "createdAt",
    direction: "desc",
  },
  history: {
    past: [],
    future: [],
  },
}

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [action.payload, ...state.todos],
        history: {
          past: [...state.history.past, state.todos],
          future: [],
        },
      }
    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) => (todo.id === action.payload.id ? action.payload : todo)),
        history: {
          past: [...state.history.past, state.todos],
          future: [],
        },
      }
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
        history: {
          past: [...state.history.past, state.todos],
          future: [],
        },
      }
    case "COMPLETE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? {
                ...todo,
                status: "completed",
                completedAt: new Date().toISOString(),
              }
            : todo,
        ),
        history: {
          past: [...state.history.past, state.todos],
          future: [],
        },
      }
    case "SET_FILTER":
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.payload,
        },
      }
    case "SET_SORT":
      return {
        ...state,
        sort: action.payload,
      }
    case "CLEAR_COMPLETED":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.status !== "completed"),
        history: {
          past: [...state.history.past, state.todos],
          future: [],
        },
      }
    case "UNDO":
      if (state.history.past.length === 0) return state
      const previous = state.history.past[state.history.past.length - 1]
      return {
        ...state,
        todos: previous,
        history: {
          past: state.history.past.slice(0, -1),
          future: [state.todos, ...state.history.future],
        },
      }
    case "REDO":
      if (state.history.future.length === 0) return state
      const next = state.history.future[0]
      return {
        ...state,
        todos: next,
        history: {
          past: [...state.history.past, state.todos],
          future: state.history.future.slice(1),
        },
      }
    case "REORDER_TODOS":
      return {
        ...state,
        todos: action.payload,
        history: {
          past: [...state.history.past, state.todos],
          future: [],
        },
      }
    default:
      return state
  }
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState)

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      dispatch({
        type: "REORDER_TODOS",
        payload: JSON.parse(savedTodos),
      })
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(state.todos))
  }, [state.todos])

  // Add a new todo
  const addTodo = useCallback((todo: Omit<Todo, "id" | "createdAt" | "completedAt">) => {
    const newTodo: Todo = {
      ...todo,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      completedAt: null,
    }
    dispatch({ type: "ADD_TODO", payload: newTodo })
  }, [])

  // Update an existing todo
  const updateTodo = useCallback((todo: Todo) => {
    dispatch({ type: "UPDATE_TODO", payload: todo })
  }, [])

  // Delete a todo
  const deleteTodo = useCallback((id: string) => {
    dispatch({ type: "DELETE_TODO", payload: id })
  }, [])

  // Mark a todo as completed
  const completeTodo = useCallback((id: string) => {
    dispatch({ type: "COMPLETE_TODO", payload: id })
  }, [])

  // Set filter options
  const setFilter = useCallback((filter: Partial<TodoState["filter"]>) => {
    dispatch({ type: "SET_FILTER", payload: filter })
  }, [])

  // Set sort options
  const setSort = useCallback((sort: TodoState["sort"]) => {
    dispatch({ type: "SET_SORT", payload: sort })
  }, [])

  // Clear all completed todos
  const clearCompleted = useCallback(() => {
    dispatch({ type: "CLEAR_COMPLETED" })
  }, [])

  // Undo the last action
  const undo = useCallback(() => {
    dispatch({ type: "UNDO" })
  }, [])

  // Redo the last undone action
  const redo = useCallback(() => {
    dispatch({ type: "REDO" })
  }, [])

  // Reorder todos (for drag and drop)
  const reorderTodos = useCallback((todos: Todo[]) => {
    dispatch({ type: "REORDER_TODOS", payload: todos })
  }, [])

  // Get filtered and sorted todos
  const filteredTodos = useMemo(() => {
    return state.todos
      .filter((todo) => {
        // Filter by status
        if (state.filter.status !== "all" && todo.status !== state.filter.status) {
          return false
        }

        // Filter by priority
        if (state.filter.priority !== "all" && todo.priority !== state.filter.priority) {
          return false
        }

        // Filter by search term
        if (state.filter.search && !todo.title.toLowerCase().includes(state.filter.search.toLowerCase())) {
          return false
        }

        // Filter by tags
        if (state.filter.tags.length > 0 && !state.filter.tags.some((tag) => todo.tags.includes(tag))) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        const { by, direction } = state.sort

        if (by === "dueDate") {
          // Handle null due dates
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return direction === "asc" ? 1 : -1
          if (!b.dueDate) return direction === "asc" ? -1 : 1

          return direction === "asc"
            ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        }

        if (by === "priority") {
          const priorityValues = { high: 3, medium: 2, low: 1 }
          return direction === "asc"
            ? priorityValues[a.priority] - priorityValues[b.priority]
            : priorityValues[b.priority] - priorityValues[a.priority]
        }

        if (by === "title") {
          return direction === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
        }

        // Default sort by createdAt
        return direction === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  }, [state.todos, state.filter, state.sort])

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(23, 59, 59, 999)

    return {
      total: state.todos.length,
      completed: state.todos.filter((todo) => todo.status === "completed").length,
      pending: state.todos.filter((todo) => todo.status === "pending").length,
      inProgress: state.todos.filter((todo) => todo.status === "in-progress").length,
      overdue: state.todos.filter((todo) => todo.status !== "completed" && todo.dueDate && new Date(todo.dueDate) < now)
        .length,
      highPriority: state.todos.filter((todo) => todo.status !== "completed" && todo.priority === "high").length,
      dueSoon: state.todos.filter(
        (todo) =>
          todo.status !== "completed" &&
          todo.dueDate &&
          new Date(todo.dueDate) > now &&
          new Date(todo.dueDate) < tomorrow,
      ).length,
    }
  }, [state.todos])

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    state.todos.forEach((todo) => {
      todo.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  }, [state.todos])

  const value = {
    state,
    dispatch,
    addTodo,
    updateTodo,
    deleteTodo,
    completeTodo,
    setFilter,
    setSort,
    clearCompleted,
    undo,
    redo,
    reorderTodos,
    filteredTodos,
    stats,
    allTags,
  }

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}

export function useTodo() {
  const context = useContext(TodoContext)
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider")
  }
  return context
}

import { useMemo } from "react"

