"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useTodo } from "@/context/todo-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Search, X, Undo2, Redo2 } from "lucide-react";

export function TodoHeader() {
  const { setTheme, theme } = useTheme();
  const { state, setFilter, undo, redo } = useTodo();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setFilter({ search: value });
  };

  const clearSearch = () => {
    setSearchValue("");
    setFilter({ search: "" });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="space-y-4">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/70">
            TaskFlow
          </h1>
          <motion.div
            className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-accent to-accent/30 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          />
        </motion.div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => undo()}
            disabled={state.history.past.length === 0}
            title="Undo (Ctrl+Z)"
            className="bg-background/50 backdrop-blur-sm border shadow-sm transition-all hover:shadow-md hover:bg-accent/5 "
          >
            <Undo2 className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => redo()}
            disabled={state.history.future.length === 0}
            title="Redo (Ctrl+Y)"
            className="bg-background/50 backdrop-blur-sm border shadow-sm transition-all hover:shadow-md hover:bg-accent/5 "
          >
            <Redo2 className="h-4 w-4" />
          </Button>

          <Button
            id="toggle-theme-btn"
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            title="Toggle theme"
            className="bg-background/50 backdrop-blur-sm border shadow-sm transition-all hover:shadow-md hover:bg-accent/5 "
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />

        <Input
          id="search-input"
          type="text"
          placeholder="Search tasks..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10 bg-background/50 backdrop-blur-sm  border shadow-sm transition-all focus:shadow-md"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </header>
  );
}
