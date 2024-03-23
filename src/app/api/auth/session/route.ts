import { NextResponse } from 'next/server'

import { auth } from '@/services/auth'

export async function GET() {
  const session = await auth()
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
