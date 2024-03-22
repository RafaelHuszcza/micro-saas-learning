import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/services/auth'
import { prisma } from '@/services/database'

async function getUserTodos() {
  const session = await auth()
  const todos = await prisma.todo.findMany({
    where: {
      userId: session?.user?.id,
    },
    select: {
      id: true,
      title: true,
      doneAt: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return todos
}

export async function GET() {
  try {
    const todos = await getUserTodos()
    return NextResponse.json(todos)
  } catch (error) {
    return NextResponse.json({ error: 'error' })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await createTodoSchema.parseAsync(body)
    const todo = await createTodo(result)
    return NextResponse.json(todo)
  } catch (error) {
    return NextResponse.json({ error })
  }
}
const createTodoSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
})

async function createTodo(input: z.infer<typeof createTodoSchema>) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Not authorized')
  }
  if (!input.title) {
    throw new Error('Title is required')
  }
  const todo = await prisma.todo.create({
    data: {
      title: input.title,
      userId: session?.user?.id,
    },
  })
  return todo
}
