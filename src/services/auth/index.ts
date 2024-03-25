import Keycloak from '@auth/core/providers/keycloak'
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
// import { PrismaAdapter } from '@auth/prisma-adapter'
// import GitHubProvider from 'next-auth/providers/github'
// import Google from 'next-auth/providers/google'
// import EmailProvider from 'next-auth/providers/nodemailer'

// import { prisma } from '../database'

async function refreshAccessToken(token: JWT) {
  if (!token.refreshToken || typeof token.refreshToken !== 'string') {
    throw new Error('Refresh token is missing or invalid')
  }
  const response = await fetch(
    `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
      method: 'POST',
      cache: 'no-store',
    },
  )

  const refreshToken = await response.json()
  return {
    ...token,
    accessToken: refreshToken.accessToken,
    idToken: refreshToken.id_token,
    expiresAt: new Date().getTime() + refreshToken.expires_in * 1000,
    refreshToken: refreshToken.refreshToken,
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  trustHost: true,
  pages: {
    signIn: '/auth',
    signOut: '/auth',
    verifyRequest: '/auth',
    newUser: '/app',
    error: '/auth',
  },
  // adapter: PrismaAdapter(prisma),
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#runtime
  // session: { strategy: 'jwt' },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 30,
  },
  providers: [
    // EmailProvider({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    // }),
    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    //   allowDangerousEmailAccountLinking: true,
    // }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    //   allowDangerousEmailAccountLinking: true,
    // }),
    Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
        token.expiresAt = account.expires_at
        token.refreshToken = account.refresh_token
        return token
      }
      if (new Date().getTime() < token.expiresAt!) {
        return token
      } else {
        try {
          const refreshedToken = await refreshAccessToken(token)
          return refreshedToken
        } catch (error) {
          console.error('Error refreshing access token', error)
          return { ...token, error: 'RefreshAccessTokenError' }
        }
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.idToken = token.idToken
      session.error = token.error
      return session
    },
  },
})
