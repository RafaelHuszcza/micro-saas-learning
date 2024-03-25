import { signOut } from 'next-auth/react'

export default async function keycloakSessionLogOut() {
  try {
    await fetch(`${process.env.NEXTAUTH_URL}/logout`, {
      method: 'GET',
    })
    signOut({ callbackUrl: '/auth' })
  } catch (error) {
    console.log(error)
  }
}
