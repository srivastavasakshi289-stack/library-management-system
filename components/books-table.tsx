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
import { BookFormDialog } from "@/components/book-form-dialog"
import { DeleteDialog } from "@/components/delete-dialog"
import { Plus, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import type { Book } from "@/types/database"

interface BooksTableProps {
  books: Book[]
  onUpdate?: () => void
}

export function BooksTable({ books, onUpdate }: BooksTableProps) {
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.category?.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (book: Book) => {
    setSelectedBook(book)
    setFormOpen(true)
  }

  const handleDelete = (book: Book) => {
    setSelectedBook(book)
    setDeleteOpen(true)
  }

  const handleAddNew = () => {
    setSelectedBook(null)
    setFormOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead className="text-center">Copies</TableHead>
              <TableHead className="text-center">Available</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No books found
                </TableCell>
              </TableRow>
            ) : (
              filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    {book.category && (
                      <Badge variant="secondary">{book.category}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {book.isbn || "-"}
                  </TableCell>
                  <TableCell className="text-center">{book.total_copies}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={book.available_copies > 0 ? "default" : "destructive"}
                    >
                      {book.available_copies}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(book)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(book)}
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

      <BookFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        book={selectedBook}
        onSuccess={onUpdate}
      />

      {selectedBook && (
        <DeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          itemType="book"
          itemId={selectedBook.id}
          itemName={selectedBook.title}
          onSuccess={onUpdate}
        />
      )}
    </div>
  )
}
