"use client"

import { Bell, User } from "lucide-react"
import { Button } from "../components/ui/button"

export default function Topbar() {
  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}