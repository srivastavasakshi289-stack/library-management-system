import { Sidebar } from "@/components/sidebar" // Check karein ye line upar ho

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen">
          {/* SIRF EK BAR YE RAKHEIN */}
          <Sidebar /> 
          
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
