import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { apiClient, todoQueryKeys } from '@/api'

import { todosRoute } from '../routes'
interface getTodosParams {
  filter?: string
}
export function useTodos(props: getTodosParams) {
  const getTodosFn = async () => {
    const response = await apiClient.get(todosRoute, { params: { ...props } })
    return response.data
  }

  return useQuery({
    queryKey: todoQueryKeys.all,
    queryFn: () => getTodosFn(),
    placeholderData: keepPreviousData,
  })
}
