import { createClient } from "@/lib/supabase/server"
import { BooksTable } from "@/components/books-table"
import type { Book } from "@/types/database"

export default async function BooksPage() {
  const supabase = await createClient()

  const { data: books } = await supabase
    .from("books")
    .select("*")
    .order("title")

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Books</h1>
        <p className="text-muted-foreground mt-1">
          Manage your library book collection
        </p>
      </div>

      <BooksTable books={(books as Book[]) || []} />
    </div>
  )
}
