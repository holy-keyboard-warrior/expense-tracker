"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Edit, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import ExpenseForm from "@/components/expense-form"
import { useExpenseStore } from "@/lib/expense-store"
import { getCategoryLabel } from "@/lib/utils"

export default function ExpenseList() {
  const { toast } = useToast()
  const { expenses, deleteExpense } = useExpenseStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [editingExpense, setEditingExpense] = useState<any>(null)

  const handleDelete = (id: string) => {
    deleteExpense(id)
    toast({
      title: "Expense deleted",
      description: "Your expense has been deleted successfully",
    })
  }

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter ? expense.category === categoryFilter : true
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="food">Food & Dining</SelectItem>
            <SelectItem value="transportation">Transportation</SelectItem>
            <SelectItem value="housing">Housing</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
            <SelectItem value="personal">Personal Care</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="travel">Travel</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredExpenses.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.title}</TableCell>
                  <TableCell>{getCategoryLabel(expense.category)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(expense.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">${Number.parseFloat(expense.amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Open menu</span>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingExpense(expense)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(expense.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-md border">
          <p className="text-muted-foreground">No expenses found</p>
        </div>
      )}

      <Dialog open={!!editingExpense} onOpenChange={(open) => !open && setEditingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {editingExpense && <ExpenseForm expense={editingExpense} onClose={() => setEditingExpense(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

