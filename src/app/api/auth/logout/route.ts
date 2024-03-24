import { NextResponse } from 'next/server'

import { auth } from '@/services/auth'

export async function GET() {
  const session = await auth()

  if (session) {
    const url = `${process.env.END_SESSION_POINT}?id_token_hint=${session.idToken}&post_logout_redirect_uri=${encodeURIComponent(process.env.NEXTAUTH_URL!)}`
    try {
      const response = await fetch(url, { method: 'GET' })
      console.log(response)
    } catch (err) {
      console.error(err)
      return NextResponse.json({ status: 500 })
    }
  }
  return NextResponse.json({ status: 500 })
}
