"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

export type AccentColor = "indigo" | "violet" | "pink" | "rose" | "amber" | "emerald" | "sky" | "teal"

interface AccentContextType {
  accent: AccentColor
  setAccent: (accent: AccentColor) => void
}

const AccentContext = createContext<AccentContextType | undefined>(undefined)

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<AccentColor>("indigo")

  // Load accent from localStorage on initial render
  useEffect(() => {
    const savedAccent = localStorage.getItem("accent") as AccentColor | null
    if (savedAccent) {
      setAccentState(savedAccent)
      document.documentElement.setAttribute("data-accent", savedAccent)
    } else {
      document.documentElement.setAttribute("data-accent", accent)
    }
  }, [accent])

  // Save accent to localStorage and update data-accent attribute
  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent)
    localStorage.setItem("accent", newAccent)
    document.documentElement.setAttribute("data-accent", newAccent)
  }

  return <AccentContext.Provider value={{ accent, setAccent }}>{children}</AccentContext.Provider>
}

export function useAccent() {
  const context = useContext(AccentContext)
  if (context === undefined) {
    throw new Error("useAccent must be used within an AccentProvider")
  }
  return context
}

