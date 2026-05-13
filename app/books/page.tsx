"use client"

import { Sidebar } from "@/components/sidebar"
import { BooksTable } from "@/components/books-table"
import { getBooks } from "@/lib/database"
import useSWR from "swr"
import { Spinner } from "@/components/ui/spinner"

export default function BooksPage() {
  const { data: books, isLoading, mutate } = useSWR('books', getBooks)

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-background">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Books</h1>
          <p className="text-muted-foreground">Manage your library book collection</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <BooksTable books={books || []} onUpdate={mutate} />
        )}
      </main>
    </div>
  )
}
