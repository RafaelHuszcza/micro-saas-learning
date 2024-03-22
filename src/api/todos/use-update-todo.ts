import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { apiClient, todoQueryKeys } from '@/api'

import { todosRoute } from '../routes'
import { Todo } from '../types'

export function useUpdateTodo() {
  const t = useTranslations('api.todos')
  let { id } = useParams()
  const queryClient = useQueryClient()

  const editTodoFn = async (updatedTodo: Todo) => {
    id = id || updatedTodo.id
    const response = await apiClient.put(`${todosRoute}/${id}`, updatedTodo)
    return response
  }

  return useMutation({
    mutationFn: editTodoFn,
    onMutate: async (updatedTodo) => {
      await queryClient.cancelQueries({
        queryKey: todoQueryKeys.detail(updatedTodo.id.toString()),
      })
      const previousTodo = queryClient.getQueryData(
        todoQueryKeys.detail(updatedTodo.id.toString()),
      )
      queryClient.setQueryData(
        todoQueryKeys.detail(updatedTodo.id.toString()),
        updatedTodo,
      )
      return { previousTodo, updatedTodo }
    },
    onSuccess: () => {
      toast.success(t('toast.update.success.title'), {
        description: t('toast.update.success.description'),
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err, updatedTodo, context?: any) => {
      console.log(err)
      queryClient.setQueryData(
        todoQueryKeys.detail(updatedTodo.id.toString()),
        context.previousTodo,
      )
      toast.error(t('toast.update.error.title'), {
        description: t('toast.update.error.description'),
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoQueryKeys.all })
    },
  })
}
