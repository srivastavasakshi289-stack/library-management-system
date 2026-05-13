"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Book, Member } from "@/types/database"

interface BorrowFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BorrowFormDialog({ open, onOpenChange }: BorrowFormDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [selectedBook, setSelectedBook] = useState("")
  const [selectedMember, setSelectedMember] = useState("")
  const [dueDate, setDueDate] = useState<Date>(addDays(new Date(), 14))

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      const [booksRes, membersRes] = await Promise.all([
        supabase
          .from("books")
          .select("*")
          .gt("available_copies", 0)
          .order("title"),
        supabase
          .from("members")
          .select("*")
          .eq("membership_status", "active")
          .order("name"),
      ])

      if (booksRes.data) setBooks(booksRes.data)
      if (membersRes.data) setMembers(membersRes.data)
    }

    if (open) {
      fetchData()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBook || !selectedMember) {
      toast.error("Please select both a book and a member")
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      // Create borrowing record
      const { error: borrowError } = await supabase.from("borrowings").insert({
        book_id: selectedBook,
        member_id: selectedMember,
        due_date: dueDate.toISOString(),
        status: "borrowed",
      })

      if (borrowError) throw borrowError

      // Update book available copies
      const book = books.find((b) => b.id === selectedBook)
      if (book) {
        const { error: updateError } = await supabase
          .from("books")
          .update({ available_copies: book.available_copies - 1 })
          .eq("id", selectedBook)

        if (updateError) throw updateError
      }

      toast.success("Book borrowed successfully")
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Issue Book</DialogTitle>
          <DialogDescription>
            Create a new borrowing record
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Book *</Label>
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a book" />
                </SelectTrigger>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title} ({book.available_copies} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Member *</Label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => date && setDueDate(date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Issue Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
