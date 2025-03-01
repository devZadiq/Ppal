"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useAccent, type AccentColor } from "@/context/accent-context"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Moon, Sun, Laptop, Download, Upload, Trash2, Palette } from "lucide-react"

export function TodoSettings() {
  const { theme, setTheme } = useTheme()
  const { accent, setAccent } = useAccent()
  const [mounted, setMounted] = useState(false)

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const exportData = () => {
    try {
      const data = localStorage.getItem("todos") || "[]"
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `taskflow-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const data = JSON.parse(content)

          if (Array.isArray(data)) {
            localStorage.setItem("todos", JSON.stringify(data))
            window.location.reload()
          } else {
            throw new Error("Invalid data format")
          }
        } catch (error) {
          console.error("Error parsing imported data:", error)
        }
      }
      reader.readAsText(file)
    } catch (error) {
      console.error("Error importing data:", error)
    }
  }

  const clearAllData = () => {
    localStorage.removeItem("todos")
    window.location.reload()
  }

  const accentOptions: { value: AccentColor; label: string; color: string }[] = [
    { value: "indigo", label: "Indigo", color: "bg-indigo-500" },
    { value: "violet", label: "Violet", color: "bg-violet-500" },
    { value: "pink", label: "Pink", color: "bg-pink-500" },
    { value: "rose", label: "Rose", color: "bg-rose-500" },
    { value: "amber", label: "Amber", color: "bg-amber-500" },
    { value: "emerald", label: "Emerald", color: "bg-emerald-500" },
    { value: "sky", label: "Sky", color: "bg-sky-500" },
    { value: "teal", label: "Teal", color: "bg-teal-500" },
  ]

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-background to-background/80 backdrop-blur-sm border shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Accent Color
          </CardTitle>
          <CardDescription>Choose your preferred accent color for the application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {accentOptions.map((option) => (
              <Button
                key={option.value}
                variant={accent === option.value ? "default" : "outline"}
                className={`flex flex-col items-center justify-center gap-2 h-auto p-4 ${
                  accent === option.value ? "ring-2 ring-offset-2 ring-offset-background" : ""
                }`}
                onClick={() => setAccent(option.value)}
              >
                <motion.div
                  className={`w-6 h-6 rounded-full ${option.color}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
                <span>{option.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-background to-background/80 backdrop-blur-sm border shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how TaskFlow looks on your device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              className="flex flex-col items-center justify-center gap-2 h-auto p-4"
              onClick={() => setTheme("light")}
            >
              <Sun className="h-5 w-5" />
              <span>Light</span>
            </Button>

            <Button
              variant={theme === "dark" ? "default" : "outline"}
              className="flex flex-col items-center justify-center gap-2 h-auto p-4"
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-5 w-5" />
              <span>Dark</span>
            </Button>

            <Button
              variant={theme === "system" ? "default" : "outline"}
              className="flex flex-col items-center justify-center gap-2 h-auto p-4"
              onClick={() => setTheme("system")}
            >
              <Laptop className="h-5 w-5" />
              <span>System</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-background to-background/80 backdrop-blur-sm border shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>Export, import, or clear your task data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-medium">Export Data</h4>
              <p className="text-sm text-muted-foreground">Download your tasks as a JSON file</p>
            </div>
            <Button
              onClick={exportData}
              variant="outline"
              size="sm"
              className="bg-background/50 backdrop-blur-sm hover:bg-accent/5"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-medium">Import Data</h4>
              <p className="text-sm text-muted-foreground">Upload a previously exported JSON file</p>
            </div>
            <div className="flex items-center">
              <input type="file" id="import-file" accept=".json" onChange={importData} className="hidden" />
              <Button
                variant="outline"
                size="sm"
                className="bg-background/50 backdrop-blur-sm hover:bg-accent/5"
                onClick={() => document.getElementById("import-file")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-medium">Clear All Data</h4>
              <p className="text-sm text-muted-foreground">Delete all your tasks permanently</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your tasks and reset the application
                    to its default state.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-background/50 backdrop-blur-sm hover:bg-accent/5">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={clearAllData}>Yes, clear all data</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-background to-background/80 backdrop-blur-sm border shadow-md">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your task management experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-completed">Show Completed Tasks</Label>
              <p className="text-sm text-muted-foreground">Display completed tasks in the main list</p>
            </div>
            <Switch id="show-completed" defaultChecked className="data-[state=checked]:bg-accent" />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="confirm-delete">Confirm Before Deleting</Label>
              <p className="text-sm text-muted-foreground">Show a confirmation dialog before deleting tasks</p>
            </div>
            <Switch id="confirm-delete" defaultChecked className="data-[state=checked]:bg-accent" />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="keyboard-shortcuts">Enable Keyboard Shortcuts</Label>
              <p className="text-sm text-muted-foreground">Use keyboard shortcuts for common actions</p>
            </div>
            <Switch id="keyboard-shortcuts" defaultChecked className="data-[state=checked]:bg-accent" />
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Preferences are stored locally and will be applied on your next visit
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

