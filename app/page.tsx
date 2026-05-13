import { createClient } from "@/lib/supabase/server"
import { StatsCards } from "@/components/stats-cards"
import { RecentActivity } from "@/components/recent-activity"
import { isPast } from "date-fns"
import type { DashboardStats, Borrowing } from "@/types/database"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch all data for dashboard
  const [booksRes, membersRes, borrowingsRes] = await Promise.all([
    supabase.from("books").select("*"),
    supabase.from("members").select("*"),
    supabase.from("borrowings").select("*, book:books(*), member:members(*)").order("created_at", { ascending: false }),
  ])

  const books = booksRes.data || []
  const members = membersRes.data || []
  const borrowings = (borrowingsRes.data || []) as Borrowing[]

  const activeBorrowings = borrowings.filter((b) => b.status === "borrowed")
  const overdueBorrowings = activeBorrowings.filter((b) => 
    isPast(new Date(b.due_date))
  )

  const stats: DashboardStats = {
    totalBooks: books.length,
    totalMembers: members.length,
    activeBorrowings: activeBorrowings.length,
    overdueBorrowings: overdueBorrowings.length,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to your library management system
        </p>
      </div>

      <div className="space-y-8">
        <StatsCards stats={stats} />

        <div className="grid gap-8 lg:grid-cols-2">
          <RecentActivity borrowings={borrowings} />
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Stats</h3>
            <div className="grid gap-4">
              <div className="bg-card border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total Book Copies</p>
                <p className="text-2xl font-bold">
                  {books.reduce((sum, b) => sum + b.total_copies, 0)}
                </p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Available Copies</p>
                <p className="text-2xl font-bold">
                  {books.reduce((sum, b) => sum + b.available_copies, 0)}
                </p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold">
                  {members.filter((m) => m.membership_status === "active").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
