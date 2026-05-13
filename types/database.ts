export interface Book {
  id: string
  title: string
  author: string
  isbn: string | null
  category: string | null
  description: string | null
  cover_url: string | null
  total_copies: number
  available_copies: number
  published_year: number | null
  created_at: string
  updated_at: string
}

export interface Member {
  id: string
  name: string
  email: string
  phone: string | null
  address: string | null
  membership_date: string
  membership_status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}

export interface Borrowing {
  id: string
  book_id: string
  member_id: string
  borrow_date: string
  due_date: string
  return_date: string | null
  status: 'borrowed' | 'returned' | 'overdue'
  created_at: string
  updated_at: string
  // Joined fields
  book?: Book
  member?: Member
}

export interface DashboardStats {
  totalBooks: number
  totalMembers: number
  activeBorrowings: number
  overdueBorrowings: number
}
