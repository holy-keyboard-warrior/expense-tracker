import AuthForm from "@/components/auth-form"

export default function Home() {
  // In a real app, we'd check server-side if the user is authenticated
  // For this client-side only app, we'll handle this in the layout with useEffect
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">ExpenseTracker</h1>
          <p className="mt-2 text-muted-foreground">Track your expenses, gain insights, save money</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}

