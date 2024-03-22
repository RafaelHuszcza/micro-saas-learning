'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useCreateTodo } from '@/api'
import { Todo } from '@/api/types'
import { ErrorMessage } from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

type TodoUpsertSheetProps = {
  children?: React.ReactNode
  defaultValue?: Todo
}

export function TodoUpsertSheet({
  children,
  defaultValue,
}: TodoUpsertSheetProps) {
  const t = useTranslations('app.components.todo-upsert-sheet')
  const Schema = z.object({
    title: z.string().min(1, { message: t('z.title-required') }),
  })
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: defaultValue,
  })
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form

  const createTodo = useCreateTodo()
  const onSubmit = handleSubmit(async (data) => {
    createTodo.mutateAsync(data)
    setOpen(false)
  })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div ref={ref}>{children}</div>
      </SheetTrigger>
      <SheetContent>
        <form onSubmit={onSubmit} className="h-screen space-y-8">
          <SheetHeader>
            <SheetTitle>Upsert Todo</SheetTitle>
            <SheetDescription>
              Add or edit your todo item here. Click save when you re done.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-1">
            <Label htmlFor="email">{t('label')}</Label>
            <Input placeholder="Enter your todo title" {...register('title')} />
            <ErrorMessage errors={errors} name="title" />
          </div>
          <SheetFooter className="mt-auto">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                t('submit-button')
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
