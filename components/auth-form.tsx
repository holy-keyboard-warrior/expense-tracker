"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export default function AuthForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>, isLogin: boolean) => {
    setIsLoading(true)
    console.log('submitting form');
    
    try {
      if (isLogin) {
        // Login logic
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const user = users.find((u: any) => u.email === values.email && u.password === values.password)

        if (!user) {
          throw new Error("Invalid email or password")
        }

        // Store current user in localStorage
        localStorage.setItem("user", JSON.stringify({ email: user.email, id: user.id }))

        toast("Login successful", {
          description: "Welcome back!",
        })
      } else {
        // Register logic
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const existingUser = users.find((u: any) => u.email === values.email)

        if (existingUser) {
          throw new Error("Email already in use")
        }

        const newUser = {
          id: Date.now().toString(),
          email: values.email,
          password: values.password,
        }

        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))
        localStorage.setItem("user", JSON.stringify({ email: newUser.email, id: newUser.id }))

        toast("Registration successful", {
          description: "Your account has been created",
        })
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit((values) => onSubmit(values, true))(e);
            }} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </div>
      </TabsContent>
      <TabsContent value="register">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit((values) => onSubmit(values, false))(e);
            }} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Register"}
              </Button>
            </form>
          </Form>
        </div>
      </TabsContent>
    </Tabs>
  )
}
