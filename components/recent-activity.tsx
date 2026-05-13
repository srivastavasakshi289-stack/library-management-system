"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, isPast } from "date-fns"
import type { Borrowing } from "@/types/database"

interface RecentActivityProps {
  borrowings: Borrowing[]
}

export function RecentActivity({ borrowings }: RecentActivityProps) {
  const recentBorrowings = borrowings.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recentBorrowings.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No recent activity
          </p>
        ) : (
          <div className="space-y-4">
            {recentBorrowings.map((borrowing) => (
              <div
                key={borrowing.id}
                className="flex items-center justify-between gap-4 pb-4 border-b last:border-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">
                    {borrowing.book?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {borrowing.member?.name} - {format(new Date(borrowing.borrow_date), "MMM d, yyyy")}
                  </p>
                </div>
                <Badge
                  variant={
                    borrowing.status === "returned"
                      ? "secondary"
                      : isPast(new Date(borrowing.due_date))
                      ? "destructive"
                      : "default"
                  }
                >
                  {borrowing.status === "returned"
                    ? "Returned"
                    : isPast(new Date(borrowing.due_date))
                    ? "Overdue"
                    : "Borrowed"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
