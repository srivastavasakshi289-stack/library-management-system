import { createClient } from './supabase/client'
import type { Book, Member, Borrowing, BorrowingWithDetails } from '@/types/database'

export async function getBooks(): Promise<Book[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getBook(id: string): Promise<Book | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) return null
  return data
}

export async function createBook(book: Omit<Book, 'id' | 'created_at' | 'updated_at'>): Promise<Book> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .insert(book)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateBook(id: string, book: Partial<Book>): Promise<Book> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .update({ ...book, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteBook(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function getMembers(): Promise<Member[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getMember(id: string): Promise<Member | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) return null
  return data
}

export async function createMember(member: Omit<Member, 'id' | 'created_at' | 'updated_at' | 'membership_date'>): Promise<Member> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('members')
    .insert(member)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateMember(id: string, member: Partial<Member>): Promise<Member> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('members')
    .update({ ...member, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteMember(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function getBorrowings(): Promise<BorrowingWithDetails[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('borrowings')
    .select(`
      *,
      book:books(*),
      member:members(*)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function createBorrowing(borrowing: { book_id: string; member_id: string; due_date: string }): Promise<Borrowing> {
  const supabase = createClient()
  
  // First, decrease available copies
  const { data: book } = await supabase
    .from('books')
    .select('available_copies')
    .eq('id', borrowing.book_id)
    .single()
  
  if (!book || book.available_copies <= 0) {
    throw new Error('No copies available')
  }
  
  await supabase
    .from('books')
    .update({ available_copies: book.available_copies - 1 })
    .eq('id', borrowing.book_id)
  
  const { data, error } = await supabase
    .from('borrowings')
    .insert(borrowing)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function returnBook(borrowingId: string, bookId: string): Promise<void> {
  const supabase = createClient()
  
  // Update borrowing status
  await supabase
    .from('borrowings')
    .update({ status: 'returned', return_date: new Date().toISOString() })
    .eq('id', borrowingId)
  
  // Increase available copies
  const { data: book } = await supabase
    .from('books')
    .select('available_copies')
    .eq('id', bookId)
    .single()
  
  if (book) {
    await supabase
      .from('books')
      .update({ available_copies: book.available_copies + 1 })
      .eq('id', bookId)
  }
}

export async function deleteBorrowing(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('borrowings')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function getStats() {
  const supabase = createClient()
  
  const [booksRes, membersRes, borrowingsRes] = await Promise.all([
    supabase.from('books').select('id, available_copies, total_copies'),
    supabase.from('members').select('id, membership_status'),
    supabase.from('borrowings').select('id, status')
  ])
  
  const books = booksRes.data || []
  const members = membersRes.data || []
  const borrowings = borrowingsRes.data || []
  
  return {
    totalBooks: books.length,
    availableBooks: books.reduce((sum, b) => sum + (b.available_copies || 0), 0),
    totalMembers: members.length,
    activeMembers: members.filter(m => m.membership_status === 'active').length,
    activeBorrowings: borrowings.filter(b => b.status === 'borrowed').length,
    overdueBorrowings: borrowings.filter(b => b.status === 'overdue').length,
  }
}
