"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  BookOpen, 
  Users, 
  BookMarked, 
  LayoutDashboard,
  Library
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Books", href: "/books", icon: BookOpen },
  { name: "Members", href: "/members", icon: Users },
  { name: "Borrowings", href: "/borrowings", icon: BookMarked },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-card border-r border-border min-h-screen">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <Library className="h-8 w-8 text-primary" />
        <span className="text-xl font-semibold text-foreground">LibraryMS</span>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="px-6 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Library Management System
        </p>
      </div>
    </aside>
  )
}
