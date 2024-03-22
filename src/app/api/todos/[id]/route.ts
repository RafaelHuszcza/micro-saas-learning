import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/services/auth'
import { prisma } from '@/services/database'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params

  if (!id) {
    throw new Error('Id is required')
  }
  const todo = await getTodo({ id })
  return Response.json({ todo })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!params.id) {
    throw new Error('Id is required')
  }
  const todo = await deleteTodo({ id: params.id })
  return Response.json({ todo })
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!params.id) {
    throw new Error('Id is required')
  }
  try {
    const body = await req.json()
    const result = await todoSchema.parseAsync(body)
    const updatedTodo = await updateTodo({ input: result, id: params.id })
    return NextResponse.json(updatedTodo)
  } catch (error) {
    return NextResponse.error()
  }
}

async function getTodo(input: z.infer<typeof idSchema>) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Not authorized')
  }
  if (!input.id) {
    throw new Error('Id is required')
  }
  const todo = await prisma.todo.findFirst({
    where: {
      userId: session?.user?.id,
      id: input.id,
    },
    select: {
      id: true,
    },
  })

  return todo
}

const idSchema = z.object({
  id: z.string().min(1, { message: 'Id is required' }),
})
const todoSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  doneAt: z.coerce.date().optional(),
})

async function updateTodo({
  input,
  id,
}: {
  input: z.infer<typeof todoSchema>
  id: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Not authorized')
  }
  console.log('id', id)
  const todo = await prisma.todo.findUnique({
    where: {
      id,
      userId: session?.user?.id,
    },
    select: {
      id: true,
    },
  })
  if (!todo) {
    return {
      error: 'Not found',
      data: null,
    }
  }
  const updatedTodo = await prisma.todo.update({
    where: {
      id,
      userId: session?.user?.id,
    },
    data: {
      title: input.title,
      doneAt: input.doneAt,
    },
  })

  return {
    error: null,
    data: updatedTodo,
  }
}

async function deleteTodo(input: z.infer<typeof idSchema>) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Not authorized')
  }
  if (!input.id) {
    throw new Error('Id is required')
  }

  const todo = await prisma.todo.findUnique({
    where: {
      id: input.id,
      userId: session?.user?.id,
    },
    select: {
      id: true,
    },
  })

  if (!todo) {
    throw new Error('Not found')
  }

  await prisma.todo.delete({
    where: {
      id: input.id,
      userId: session?.user?.id,
    },
  })

  return 'Todo deleted successfully'
}
