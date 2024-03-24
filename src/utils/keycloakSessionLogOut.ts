import { signOut } from 'next-auth/react'

export default async function keycloakSessionLogOut() {
  try {
    const response = await fetch('/api/auth/logout', { method: 'GET' })
    console.log(response)
    signOut({ callbackUrl: '/auth' })
  } catch (error) {
    console.log(error)
  }
}
