'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
export function useQueryString() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (name: string, value: string) => {
    router.push(pathname + '?' + changeQueryString(name, value))
  }
  const handleChangeArray = (array: { name: string; value: string }[]) => {
    router.push(pathname + '?' + changeQueryStringArray(array))
  }
  const handleRemove = (name: string) => {
    router.push(pathname + '?' + removeQueryString(name))
  }

  const changeQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(name, value)
    return params.toString()
  }

  const changeQueryStringArray = (array: { name: string; value: string }[]) => {
    const params = new URLSearchParams(searchParams)
    for (let i = 0; i < array.length; i++) {
      params.set(array[i].name, array[i].value)
    }
    return params.toString()
  }

  const removeQueryString = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams)
      params.delete(name)
      return params.toString()
    },
    [searchParams],
  )

  return { handleChange, handleRemove, handleChangeArray }
}
