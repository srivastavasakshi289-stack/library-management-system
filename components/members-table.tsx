"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MemberFormDialog } from "@/components/member-form-dialog"
import { DeleteDialog } from "@/components/delete-dialog"
import { Plus, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { format } from "date-fns"
import type { Member } from "@/types/database"

interface MembersTableProps {
  members: Member[]
}

export function MembersTable({ members }: MembersTableProps) {
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (member: Member) => {
    setSelectedMember(member)
    setFormOpen(true)
  }

  const handleDelete = (member: Member) => {
    setSelectedMember(member)
    setDeleteOpen(true)
  }

  const handleAddNew = () => {
    setSelectedMember(null)
    setFormOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "suspended":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Member Since</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No members found
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.phone || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(member.membership_date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(member.membership_status)}>
                      {member.membership_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(member)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(member)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <MemberFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        member={selectedMember}
      />

      {selectedMember && (
        <DeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          itemType="member"
          itemId={selectedMember.id}
          itemName={selectedMember.name}
        />
      )}
    </div>
  )
}
