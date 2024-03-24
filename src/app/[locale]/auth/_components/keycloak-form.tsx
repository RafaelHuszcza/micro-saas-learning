'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { ErrorMessage } from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function KeyCloakForm() {
  const t = useTranslations('auth.components.keycloak-form')
  const formSchema = z.object({
    email: z.string().email({ message: t('z.invalid-email') }),
    password: z.string().min(1, { message: t('z.invalid-password') }),
  })

  type FormData = z.infer<typeof formSchema>
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form
  const onSubmit = handleSubmit(async (data: FormData) => {
    signIn('keycloak', { username: data.email, password: data.password })
    // try {
    //   const response = await fetch('/api/auth/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //   })
    //   console.log(response)
    //   toast.success(t('toast.success.title'), {
    //     description: t('toast.success.description'),
    //   })
    // } catch (error) {
    //   toast.error(t('toast.error.title'), {
    //     description: t('toast.error.description'),
    //   })
    // }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">{t('email')}</Label>
        <Input
          id="email"
          placeholder={t('email-placeholder')}
          type="email"
          {...register('email')}
        />
        <ErrorMessage errors={errors} name="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t('password')}</Label>
        <Input id="password" type="password" {...register('password')} />
        <ErrorMessage errors={errors} name="password" />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          t('submit-button')
        )}
      </Button>
    </form>
  )
}
