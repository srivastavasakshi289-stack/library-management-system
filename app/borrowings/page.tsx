"use client"
import { BorrowingsTable } from "@/components/borrowings-table"
import { getBorrowings, getBooks, getMembers } from "@/lib/database"
import useSWR from "swr"
import { Spinner } from "@/components/ui/spinner"

export default function BorrowingsPage() {
  const { data: borrowings, isLoading: borrowingsLoading, mutate } = useSWR('borrowings', getBorrowings)
  const { data: books, isLoading: booksLoading } = useSWR('books', getBooks)
  const { data: members, isLoading: membersLoading } = useSWR('members', getMembers)
  const isLoading = borrowingsLoading || booksLoading || membersLoading

  return (
    <main className="flex-1 p-8 bg-background">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Borrowings</h1>
        <p className="text-muted-foreground">Track book borrowings and returns</p>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <BorrowingsTable 
          borrowings={borrowings || []} 
          books={books || []}
          members={members || []}
          onUpdate={mutate} 
        />
      )}
    </main>
  )
}
