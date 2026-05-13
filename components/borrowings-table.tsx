"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BorrowFormDialog } from "@/components/borrow-form-dialog"
import { DeleteDialog } from "@/components/delete-dialog"
import { returnBook } from "@/lib/database"
import { Plus, Search, MoreHorizontal, RotateCcw, Trash2 } from "lucide-react"
import { format, isPast } from "date-fns"
import { toast } from "sonner"
import type { Book, Member, BorrowingWithDetails } from "@/types/database"

interface BorrowingsTableProps {
  borrowings: BorrowingWithDetails[]
  books: Book[]
  members: Member[]
  onUpdate?: () => void
}

export function BorrowingsTable({ borrowings, books, members, onUpdate }: BorrowingsTableProps) {
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedBorrowing, setSelectedBorrowing] = useState<BorrowingWithDetails | null>(null)

  const filteredBorrowings = borrowings.filter(
    (borrowing) =>
      borrowing.book?.title.toLowerCase().includes(search.toLowerCase()) ||
      borrowing.member?.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleReturn = async (borrowing: BorrowingWithDetails) => {
    try {
      await returnBook(borrowing.id, borrowing.book_id)
      toast.success("Book returned successfully")
      onUpdate?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to return book")
    }
  }

  const handleDelete = (borrowing: BorrowingWithDetails) => {
    setSelectedBorrowing(borrowing)
    setDeleteOpen(true)
  }

  const getStatusBadge = (borrowing: BorrowingWithDetails) => {
    if (borrowing.status === "returned") {
      return <Badge variant="secondary">Returned</Badge>
    }
    if (isPast(new Date(borrowing.due_date)) && borrowing.status === "borrowed") {
      return <Badge variant="destructive">Overdue</Badge>
    }
    return <Badge>Borrowed</Badge>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search borrowings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Issue Book
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Borrow Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Return Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBorrowings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No borrowings found
                </TableCell>
              </TableRow>
            ) : (
              filteredBorrowings.map((borrowing) => (
                <TableRow key={borrowing.id}>
                  <TableCell className="font-medium">
                    {borrowing.book?.title || "Unknown"}
                  </TableCell>
                  <TableCell>{borrowing.member?.name || "Unknown"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(borrowing.borrow_date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(borrowing.due_date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {borrowing.return_date
                      ? format(new Date(borrowing.return_date), "MMM d, yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>{getStatusBadge(borrowing)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {borrowing.status === "borrowed" && (
                          <DropdownMenuItem onClick={() => handleReturn(borrowing)}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Return Book
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(borrowing)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <BorrowFormDialog 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        books={books}
        members={members}
        onSuccess={onUpdate}
      />

      {selectedBorrowing && (
        <DeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          itemType="borrowing"
          itemId={selectedBorrowing.id}
          itemName={selectedBorrowing.book?.title || "this borrowing"}
          onSuccess={onUpdate}
        />
      )}
    </div>
  )
}
