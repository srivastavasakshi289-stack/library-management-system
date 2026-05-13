"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemType: "book" | "member" | "borrowing"
  itemId: string
  itemName: string
}

export function DeleteDialog({
  open,
  onOpenChange,
  itemType,
  itemId,
  itemName,
}: DeleteDialogProps) {
  const router = useRouter()

  const handleDelete = async () => {
    const supabase = createClient()
    
    try {
      const table = itemType === "borrowing" ? "borrowings" : `${itemType}s`
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", itemId)

      if (error) throw error

      toast.success(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted successfully`)
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete &quot;{itemName}&quot;. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
