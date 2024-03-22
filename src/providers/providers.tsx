"use client"
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from './theme-provider';

export const Providers = ({ children, messages, locale, timeZone }: { children: React.ReactNode, messages: AbstractIntlMessages, locale: string, timeZone: string }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
        {children}
        <Toaster richColors position="top-right" />
      </NextIntlClientProvider >
    </ThemeProvider>
  )
}
