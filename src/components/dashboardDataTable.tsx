'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Book } from '@/types/books'
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import DashboardTableHeader from './dashboardTableHeader'

interface Props {
  isLoading: boolean
  data: Book[]
  handleCreate: () => void
  handleEdit: (book: Book) => void
  handleDelete: (book: Book) => void
}

export function DashboardDataTable(props: Props) {
  const { data, handleCreate, handleDelete, handleEdit, isLoading } = props

  const [searchQuery, setSearchQuery] = useState('')

  const columns = useMemo<ColumnDef<Book>[]>(
    () => [
      { accessorKey: 'title', header: 'Title' },
      { accessorKey: 'author', header: 'Author' },
      { accessorKey: 'description', header: 'Description' },
      {
        id: 'actions',
        cell: ({ row }) => {
          const book = row.original

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(book)}>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(book)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      }
    ],
    [handleEdit, handleDelete]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchQuery
    },
    onGlobalFilterChange: setSearchQuery
  })

  return (
    <section>
      <DashboardTableHeader onCreateClick={handleCreate} onSearchChange={setSearchQuery} searchQuery={searchQuery} />

      <div className="shadow-sm mb-2 overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {isLoading ? (
              <TableRow className="h-10 w-1/4 animate-pulse bg-zinc-100">
                {columns.map((_, idx) => (
                  <TableCell key={idx} />
                ))}
              </TableRow>
            ) : (
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='bg-zinc-100 hover:bg-zinc-100'>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, idx) => (
                <TableRow
                  key={idx}
                  className={`h-[49px] animate-pulse ${idx % 2 === 0 ? 'bg-zinc-50' : 'bg-yellow-50'}`}
                >
                  {columns.map((_, idx) => (
                    <TableCell key={idx} />
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow key={row.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-yellow-50'} hover:bg-yellow-100`}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
