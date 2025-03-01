"use client";

import type React from "react";

import { useState } from "react";
import { format } from "date-fns";
import { useTodo } from "@/context/todo-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { DialogClose } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Plus, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Todo, TodoPriority, TodoStatus } from "@/context/todo-context";

interface TodoEditFormProps {
  todo: Todo;
  onClose: () => void;
}

export function TodoEditForm({ todo, onClose }: TodoEditFormProps) {
  const { updateTodo, allTags } = useTodo();
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [priority, setPriority] = useState<TodoPriority>(todo.priority);
  const [status, setStatus] = useState<TodoStatus>(todo.status);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    todo.dueDate ? new Date(todo.dueDate) : undefined
  );
  const [tags, setTags] = useState<string[]>(todo.tags);
  const [newTag, setNewTag] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

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
    });

    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const selectExistingTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
           {" "}
      <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
               {" "}
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />
             {" "}
      </div>
           {" "}
      <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
               {" "}
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          className="min-h-[100px]"
        />
             {" "}
      </div>
           {" "}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {" "}
        <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>     
             {" "}
          <Select
            value={priority}
            onValueChange={(value: TodoPriority) => setPriority(value)}
          >
                       {" "}
            <SelectTrigger>
                            <SelectValue placeholder="Select priority" />       
                 {" "}
            </SelectTrigger>
                       {" "}
            <SelectContent>
                            <SelectItem value="low">Low</SelectItem>           
                <SelectItem value="medium">Medium</SelectItem>             {" "}
              <SelectItem value="high">High</SelectItem>           {" "}
            </SelectContent>
                     {" "}
          </Select>
                 {" "}
        </div>
               {" "}
        <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>       
           {" "}
          <Select
            value={status}
            onValueChange={(value: TodoStatus) => setStatus(value)}
          >
                       {" "}
            <SelectTrigger>
                            <SelectValue placeholder="Select status" />         
               {" "}
            </SelectTrigger>
                       {" "}
            <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>   
                        <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                         {" "}
            </SelectContent>
                     {" "}
          </Select>
                 {" "}
        </div>
               {" "}
        <div className="space-y-2">
                    <label className="text-sm font-medium">Due Date</label>     
             {" "}
          <Popover>
                       {" "}
            <PopoverTrigger asChild>
                           {" "}
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                                <CalendarIcon className="mr-2 h-4 w-4" />       
                        {dueDate ? format(dueDate, "PPP") : "Select date"}     
                       {" "}
              </Button>
                         {" "}
            </PopoverTrigger>
                       {" "}
            <PopoverContent className="w-auto p-0">
                           {" "}
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
                         {" "}
            </PopoverContent>
                     {" "}
          </Popover>
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>       {" "}
        <div className="flex flex-wrap gap-2 mb-2">
                   {" "}
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1"
            >
                            {tag}             {" "}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => removeTag(tag)}
              >
                                <X className="h-3 w-3" />             {" "}
              </Button>
                         {" "}
            </Badge>
          ))}
                 {" "}
        </div>
               {" "}
        <div className="flex gap-2">
                   {" "}
          <div className="relative flex-1">
                       {" "}
            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                       {" "}
            <Input
              type="text"
              placeholder="Add a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
                     {" "}
          </div>
                   {" "}
          <Button type="button" size="sm" onClick={addTag}>
                        <Plus className="h-4 w-4" />         {" "}
          </Button>
                 {" "}
        </div>
               {" "}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
                       {" "}
            {allTags
              .filter((tag) => !tags.includes(tag))
              .map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => selectExistingTag(tag)}
                >
                                    {tag}               {" "}
                </Badge>
              ))}
                     {" "}
          </div>
        )}
             {" "}
      </div>
           {" "}
      <div className="flex justify-end gap-2">
               {" "}
        <DialogClose asChild>
                   {" "}
          <Button type="button" variant="outline">
                        Cancel          {" "}
          </Button>
                 {" "}
        </DialogClose>
               {" "}
        <Button type="submit" disabled={!title.trim()}>
                    Save Changes        {" "}
        </Button>
             {" "}
      </div>
         {" "}
    </form>
  );
}
