import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { apiClient, todoQueryKeys } from '@/api'

import { todosRoute } from '../routes'
import { Todo } from '../types'

export function useCreateTodo() {
  const t = useTranslations('api.todos')
  const queryClient = useQueryClient()

  const createTodoFn = async (newTodo: Todo) => {
    const response = await apiClient.post(todosRoute, newTodo)
    return response.data
  }

  return useMutation({
    mutationFn: createTodoFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: todoQueryKeys.all })
    },
    onSuccess: () => {
      toast.success(t('toast.create.success.title'), {
        description: t('toast.create.success.description'),
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (context?: any) => {
      queryClient.setQueryData(todoQueryKeys.all, context.previousTodo)
      toast.error(t('toast.create.error.title'), {
        description: t('toast.create.error.description'),
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoQueryKeys.all })
    },
  })
}
