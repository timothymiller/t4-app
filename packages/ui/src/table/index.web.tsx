import { useMemo, useState, useRef } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Car } from '@t4/api/src/db/schema'
import { Paragraph, H3 } from 'tamagui'

type Props = {
  data: Car[]
}

export const Table = ({ data }: Props): React.ReactNode => {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<Car>[]>(
    () => [
      {
        accessorKey: 'make',
        header: 'Make',
        size: 130,
      },
      {
        accessorKey: 'model',
        header: 'Model',
        size: 120,
      },
      {
        accessorKey: 'year',
        header: 'Year',
        size: 80,
      },
      {
        accessorKey: 'color',
        header: 'Color',
        size: 100,
      },
      {
        accessorKey: 'price',
        header: 'Price',
        accessor: (row) => `$${row}`,
        size: 90,
      },
      {
        accessorKey: 'mileage',
        header: 'Mileage',
        size: 120,
      },
      {
        accessorKey: 'fuelType',
        header: 'Fuel Type',
        size: 140,
      },
      {
        accessorKey: 'transmission',
        header: 'Transmission',
        size: 170,
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  })

  const tableContainerRef = useRef<HTMLDivElement>(null)

  const { rows } = table.getRowModel()
  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => tableContainerRef.current,
    count: data.length,
    estimateSize: () => 50,
    overscan: 10,
  })
  const { getVirtualItems: virtualRows } = rowVirtualizer

  const paddingTop = virtualRows().length > 0 ? virtualRows()?.[0]?.start || 0 : 0
  const paddingBottom =
    virtualRows().length > 0
      ? rows.length - (virtualRows()?.[virtualRows().length - 1]?.end || 0)
      : 0

  return (
    <div className="p-2">
      <div className="h-2" />
      <div ref={tableContainerRef} className="container">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize(), textAlign: 'left' }}
                    >
                      {header.isPlaceholder ? null : (
                        <H3
                          style={{ cursor: header.column.getCanSort() ? 'pointer' : '' }}
                          {...{
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </H3>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows().map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<Car>
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        <Paragraph>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Paragraph>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
