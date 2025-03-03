"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ExpenseList from "@/components/expense-list"
import ExpenseForm from "@/components/expense-form"
import ExpenseStats from "@/components/expense-stats"
import DashboardHeader from "@/components/dashboard-header"
import { useToast } from "@/components/ui/use-toast"
import { useExpenseStore } from "@/lib/expense-store"

export default function Dashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const { loadExpenses } = useExpenseStore()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/")
      return
    }

    // Load expenses from localStorage
    loadExpenses()
    setIsLoading(false)
  }, [router, loadExpenses])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      <DashboardHeader />
      <main className="container mx-auto p-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="add">Add Expense</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 py-4">
            <ExpenseStats />
          </TabsContent>
          <TabsContent value="expenses" className="space-y-4 py-4">
            <ExpenseList />
          </TabsContent>
          <TabsContent value="add" className="space-y-4 py-4">
            <ExpenseForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

