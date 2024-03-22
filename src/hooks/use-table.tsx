'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { useQueryString } from '@/hooks'

type Order = 'asc' | 'desc'

export const useTable = () => {
  const searchParams = useSearchParams()
  const { handleChange, handleChangeArray } = useQueryString()

  const rowsPerPageOptions = [6, 8, 12, 16]
  const rowsPerPageParams = searchParams.get('rowsPerPage')
    ? Number(searchParams.get('rowsPerPage'))
    : 6

  const rowsPerPage = rowsPerPageOptions.includes(rowsPerPageParams)
    ? rowsPerPageParams
    : 6

  const [searchFilter, setSearchFilter] = useState(
    searchParams.get('filter') ?? '',
  )

  const filter = searchParams.get('filter') ?? ''

  const orderParam = searchParams.get('order')
  const order: Order =
    orderParam === 'asc' || orderParam === 'desc' ? orderParam : 'asc'

  const orderBy = searchParams.get('orderBy') ?? 'code'

  const page = searchParams.get('page')
    ? Number(searchParams.get('page')) - 1
    : 0

  const handleSearch = () => {
    handleChangeArray([
      { name: 'filter', value: searchFilter },
      { name: 'page', value: '1' },
    ])
  }
  const handleSetFilter = (value: string) => {
    setSearchFilter(value)
  }
  const handleChangePage = (event: unknown, newPage: number) => {
    handleChange('page', (newPage + 1).toString())
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleChangeArray([
      { name: 'rowsPerPage', value: event.target.value.toString() },
      { name: 'page', value: '1' },
    ])
  }
  const handleChangeOrderBy = (newOrderBy: string) => {
    const isAsc = orderBy === newOrderBy && order === 'asc'
    handleChangeArray([
      { name: 'orderBy', value: newOrderBy },
      { name: 'order', value: isAsc ? 'desc' : 'asc' },
    ])
  }

  return {
    rowsPerPageOptions,
    rowsPerPage,
    filter,
    order,
    orderBy,
    page,
    handleSearch,
    handleChangePage,
    handleChangeRowsPerPage,
    handleChangeOrderBy,
    handleSetFilter,
    searchFilter,
  }
}
