import "@/app/globals.css"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Dashboard Example",
  description: "Simple dashboard with Next.js + shadcn/ui",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-gray-50 min-h-screen")}>
        {children}
      </body>
    </html>
  )
}
