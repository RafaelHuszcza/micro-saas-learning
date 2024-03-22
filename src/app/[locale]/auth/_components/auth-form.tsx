"use client"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ErrorMessage } from "@/components/error-message"
import { signIn } from "next-auth/react"
import { toast } from "sonner"

export function AuthForm() {
  const formSchema = z.object({
    email: z.string().email(),
  })

  type FormData = z.infer<typeof formSchema>
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })
  const { handleSubmit, register, formState: { errors } } = form
  const onSubmit = handleSubmit(async (data: FormData) => {
    try {
      await signIn("email", { email: data.email, redirect: false })
      toast.success("Magic Link Sent", { description: "Check your email to login" })
    } catch (error) {
      toast.error("Error", { description: "An error occurred. Please try again." })
    }

  })

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="m@example.com" type="email" {...register("email")} />
            <ErrorMessage errors={errors} name="email" />
          </div>
          <Button type="submit" className="w-full" >
            Send magic link
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

