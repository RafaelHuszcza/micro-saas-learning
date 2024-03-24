import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  try {
    if (body) {
      const fetchFucntion = fetch(
        `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: process.env.KEYCLOAK_CLIENT_ID!,
            client_secret: process.env.KEYCLOAK_SECRET!,
            grant_type: 'password',
            username: body.email,
            password: body.password,
          }),
        },
      )

      return NextResponse.(fetchFucntion)
    }
  } catch (error) {
    console.error(error)
    const response = {
      error: 'Unable to logout from the session',
    }
    const responseHeaders = {
      status: 500,
    }
    return NextResponse.json(response, responseHeaders)
  }
  return NextResponse.json({ status: 500 })
}
