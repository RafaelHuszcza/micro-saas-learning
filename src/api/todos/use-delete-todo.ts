import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { apiClient, todoQueryKeys } from '@/api'

import { todosRoute } from '../routes'

export function useDeleteTodo() {
  const t = useTranslations('api.todos')
  const queryClient = useQueryClient()
  const deleteTodoFn = async (id: string) => {
    const response = await apiClient.delete(`${todosRoute}/${id}`)
    return response
  }
  return useMutation({
    mutationFn: deleteTodoFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: todoQueryKeys.all })
    },
    onSuccess: () => {
      toast.success(t('toast.delete.success.title'), {
        description: t('toast.delete.success.description'),
      })
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: todoQueryKeys.all })
      toast.error(t('toast.delete.error.title'), {
        description: t('toast.delete.error.description'),
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoQueryKeys.all })
    },
  })
}
