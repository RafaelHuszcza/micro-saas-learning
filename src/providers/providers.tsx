'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl'

import { Toaster } from '@/components/ui/sonner'

import { ThemeProvider } from './theme-provider'

export const Providers = ({
  children,
  messages,
  locale,
  timeZone,
}: {
  children: React.ReactNode
  messages: AbstractIntlMessages
  locale: string
  timeZone: string
}) => {
  const queryClient = new QueryClient()
  return (
    <SessionProvider refetchInterval={4 * 60}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <NextIntlClientProvider
            locale={locale}
            messages={messages}
            timeZone={timeZone}
          >
            {children}
            <Toaster richColors position="top-right" closeButton />
          </NextIntlClientProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
