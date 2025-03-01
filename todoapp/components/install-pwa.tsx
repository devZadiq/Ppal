"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"

interface InstallPWAProps {
  onDismiss: () => void
}

export function InstallPWA({ onDismiss }: InstallPWAProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null)

    // Act on the user's choice
    if (outcome === "accepted") {
      console.log("User accepted the install prompt")
    } else {
      console.log("User dismissed the install prompt")
    }

    onDismiss()
  }

  if (!deferredPrompt) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mb-6 rounded-lg border bg-gradient-to-r from-accent/20 to-background backdrop-blur-sm p-4 shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-accent/20 p-2">
            <Download className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-medium">Install TaskFlow</h3>
            <p className="text-sm text-muted-foreground">Add to your home screen for quick access</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDismiss}
            className="bg-background/50 backdrop-blur-sm hover:bg-accent/5"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={handleInstall} className="bg-accent hover:bg-accent/90 transition-colors">
            Install
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

