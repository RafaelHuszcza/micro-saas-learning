export type Todo = {
  id: string
  title: string
  completed: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
  doneAt: Date | null
}
