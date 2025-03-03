import { create } from "zustand"

interface Expense {
  id: string
  title: string
  amount: number
  category: string
  date: Date | string
  notes?: string
}

interface ExpenseStore {
  expenses: Expense[]
  loadExpenses: () => void
  addExpense: (expense: Expense) => void
  updateExpense: (expense: Expense) => void
  deleteExpense: (id: string) => void
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: [],

  loadExpenses: () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.id) return

    const storedExpenses = localStorage.getItem(`expenses_${user.id}`)
    if (storedExpenses) {
      set({ expenses: JSON.parse(storedExpenses) })
    }
  },

  addExpense: (expense) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.id) return

    const newExpenses = [...get().expenses, expense]
    localStorage.setItem(`expenses_${user.id}`, JSON.stringify(newExpenses))
    set({ expenses: newExpenses })
  },

  updateExpense: (updatedExpense) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.id) return

    const newExpenses = get().expenses.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense))
    localStorage.setItem(`expenses_${user.id}`, JSON.stringify(newExpenses))
    set({ expenses: newExpenses })
  },

  deleteExpense: (id) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.id) return

    const newExpenses = get().expenses.filter((expense) => expense.id !== id)
    localStorage.setItem(`expenses_${user.id}`, JSON.stringify(newExpenses))
    set({ expenses: newExpenses })
  },
}))

