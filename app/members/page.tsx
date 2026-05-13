"use client"
import { MembersTable } from "@/components/members-table"
import { getMembers } from "@/lib/database"
import useSWR from "swr"
import { Spinner } from "@/components/ui/spinner"

export default function MembersPage() {
  const { data: members, isLoading, mutate } = useSWR('members', getMembers)
  return (
    <main className="flex-1 p-8 bg-background">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Members</h1>
        <p className="text-muted-foreground">Manage library members and their information</p>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <MembersTable members={members || []} onUpdate={mutate} />
      )}
    </main>
  )
}
