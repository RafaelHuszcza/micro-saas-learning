import { todosRoute } from '../routes'

export const todoQueryKeys = {
  all: [todosRoute],
  details: () => [...todoQueryKeys.all, 'detail'],
  detail: (id: string) => [...todoQueryKeys.details(), id],
  filter: (filter: string) => [...todoQueryKeys.all, 'filter', filter],
}
