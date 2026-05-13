import { createClient } from "@/lib/supabase/server"
import { MembersTable } from "@/components/members-table"
import type { Member } from "@/types/database"

export default async function MembersPage() {
  const supabase = await createClient()

  const { data: members } = await supabase
    .from("members")
    .select("*")
    .order("name")

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Members</h1>
        <p className="text-muted-foreground mt-1">
          Manage library members and their information
        </p>
      </div>

      <MembersTable members={(members as Member[]) || []} />
    </div>
  )
}
