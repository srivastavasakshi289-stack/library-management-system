"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, BookMarked, AlertTriangle } from "lucide-react"
import type { DashboardStats } from "@/types/database"

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: BookOpen,
      description: "Books in collection",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Members",
      value: stats.totalMembers,
      icon: Users,
      description: "Registered members",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Active Borrowings",
      value: stats.activeBorrowings,
      icon: BookMarked,
      description: "Currently borrowed",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Overdue",
      value: stats.overdueBorrowings,
      icon: AlertTriangle,
      description: "Overdue returns",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
