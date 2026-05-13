"use client"

import { Sidebar } from "@/components/sidebar"
import { StatsCards } from "@/components/stats-cards"
import { RecentActivity } from "@/components/recent-activity"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getStats, getBorrowings } from "@/lib/database"
import useSWR from "swr"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useSWR('stats', getStats)
  const { data: borrowings, isLoading: borrowingsLoading, error: borrowingsError } = useSWR('borrowings', getBorrowings)

  const isLoading = statsLoading || borrowingsLoading
  const hasError = statsError || borrowingsError

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-background">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your library management system</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner className="h-8 w-8" />
          </div>
        ) : hasError ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">
                Unable to load data. Please check your database connection.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <StatsCards stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Borrowings</CardTitle>
                  <CardDescription>Latest book checkouts and returns</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentActivity borrowings={borrowings?.slice(0, 5) || []} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Library overview at a glance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Books in circulation</span>
                      <span className="font-semibold">{stats?.activeBorrowings || 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Available for checkout</span>
                      <span className="font-semibold">{stats?.availableBooks || 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Active members</span>
                      <span className="font-semibold">{stats?.activeMembers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Overdue returns</span>
                      <span className="font-semibold text-destructive">{stats?.overdueBorrowings || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
