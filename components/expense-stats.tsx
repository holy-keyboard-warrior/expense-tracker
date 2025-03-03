"use client"

import { useMemo } from "react"
import { format, subDays, startOfMonth, endOfMonth } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useExpenseStore } from "@/lib/expense-store"
import { getCategoryLabel } from "@/lib/utils"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#A4DE6C", "#D0ED57", "#FFC658"]

export default function ExpenseStats() {
  const { expenses } = useExpenseStore()

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + Number.parseFloat(expense.amount.toString()), 0)
  }, [expenses])

  const last30DaysExpenses = useMemo(() => {
    const thirtyDaysAgo = subDays(new Date(), 30)
    return expenses
      .filter((expense) => new Date(expense.date) >= thirtyDaysAgo)
      .reduce((sum, expense) => sum + Number.parseFloat(expense.amount.toString()), 0)
  }, [expenses])

  const currentMonthExpenses = useMemo(() => {
    const start = startOfMonth(new Date())
    const end = endOfMonth(new Date())
    return expenses
      .filter((expense) => {
        const date = new Date(expense.date)
        return date >= start && date <= end
      })
      .reduce((sum, expense) => sum + Number.parseFloat(expense.amount.toString()), 0)
  }, [expenses])

  // Prepare data for category pie chart
  const categoryData = useMemo(() => {
    const categoryMap = expenses.reduce<Record<string, number>>((acc, expense) => {
      const category = expense.category
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += Number.parseFloat(expense.amount.toString())
      return acc
    }, {})

    return Object.entries(categoryMap).map(([category, amount]) => ({
      name: getCategoryLabel(category),
      value: amount,
    }))
  }, [expenses])

  // Prepare data for monthly bar chart
  const monthlyData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subDays(new Date(), i * 30)
      return {
        month: format(date, "MMM"),
        total: 0,
      }
    }).reverse()

    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date)
      const expenseMonth = format(expenseDate, "MMM")
      const monthData = last6Months.find((data) => data.month === expenseMonth)
      if (monthData) {
        monthData.total += Number.parseFloat(expense.amount.toString())
      }
    })

    return last6Months
  }, [expenses])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${last30DaysExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +{totalExpenses > 0 ? ((last30DaysExpenses / totalExpenses) * 100).toFixed(1) : '0'}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonthExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +{totalExpenses > 0 ? ((currentMonthExpenses / totalExpenses) * 100).toFixed(1) : '0'}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Trend</TabsTrigger>
        </TabsList>
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>Breakdown of your expenses across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${typeof value === 'number' ? value.toFixed(2) : Number(value).toFixed(2)}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expenses</CardTitle>
              <CardDescription>Your spending trend over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {monthlyData.some((data) => data.total > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${typeof value === 'number' ? value.toFixed(2) : Number(value).toFixed(2)}`} />
                      <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
