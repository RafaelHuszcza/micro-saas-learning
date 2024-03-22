import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

import { i18n, timeZone } from '../i18n-config'

export default getRequestConfig(async ({ locale }) => {
  if (!i18n.locales.includes(locale as string)) notFound()
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone,
  }
})
