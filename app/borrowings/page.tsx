import { createClient } from "@/lib/supabase/server"
import { BorrowingsTable } from "@/components/borrowings-table"
import type { Borrowing } from "@/types/database"

export default async function BorrowingsPage() {
  const supabase = await createClient()

  const { data: borrowings } = await supabase
    .from("borrowings")
    .select("*, book:books(*), member:members(*)")
    .order("created_at", { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Borrowings</h1>
        <p className="text-muted-foreground mt-1">
          Track book borrowings and returns
        </p>
      </div>

      <BorrowingsTable borrowings={(borrowings as Borrowing[]) || []} />
    </div>
  )
}
