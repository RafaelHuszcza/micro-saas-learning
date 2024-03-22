import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { apiClient, todoQueryKeys } from '@/api'

import { todosRoute } from '../routes'

export function useTodo() {
  const { id } = useParams()

  const getTodoFn = async () => {
    const response = await apiClient.get(`${todosRoute}/${id}`)
    return response.data
  }

  return useQuery({
    queryKey: todoQueryKeys.detail(id.toString()),
    queryFn: getTodoFn,
    retry: 1,
  })
}
