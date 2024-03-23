import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/services/database'

export async function GET(req: NextRequest) {
  let token = req.headers.get('Authorization')
  if (!token) {
    return NextResponse.json(
      {
        error: 'Not authorized',
      },
      {
        status: 401,
      },
    )
  }
  token = token.replace('Bearer ', '')
  const session = await prisma.session.findFirst({
    where: {
      sessionToken: token,
    },
    select: {
      id: true,
    },
  })
  if (!session) {
    return NextResponse.json(
      {
        error: 'Not authorized',
      },
      {
        status: 401,
      },
    )
  }
  return NextResponse.json({ status: 200 })
}
