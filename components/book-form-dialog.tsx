"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import type { Book } from "@/types/database"

interface BookFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  book?: Book | null
}

const categories = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "Technology",
  "History",
  "Biography",
  "Self-Help",
  "Children",
  "Mystery",
  "Romance",
]

export function BookFormDialog({ open, onOpenChange, book }: BookFormDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: book?.title || "",
    author: book?.author || "",
    isbn: book?.isbn || "",
    category: book?.category || "",
    description: book?.description || "",
    total_copies: book?.total_copies || 1,
    published_year: book?.published_year || new Date().getFullYear(),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    try {
      if (book) {
        const { error } = await supabase
          .from("books")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", book.id)

        if (error) throw error
        toast.success("Book updated successfully")
      } else {
        const { error } = await supabase.from("books").insert({
          ...formData,
          available_copies: formData.total_copies,
        })

        if (error) throw error
        toast.success("Book added successfully")
      }

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
          <DialogDescription>
            {book ? "Update book details" : "Add a new book to the library collection"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="total_copies">Total Copies</Label>
                <Input
                  id="total_copies"
                  type="number"
                  min="1"
                  value={formData.total_copies}
                  onChange={(e) => setFormData({ ...formData, total_copies: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="published_year">Published Year</Label>
                <Input
                  id="published_year"
                  type="number"
                  value={formData.published_year}
                  onChange={(e) => setFormData({ ...formData, published_year: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : book ? "Update Book" : "Add Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
