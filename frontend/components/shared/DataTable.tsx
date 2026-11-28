"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "@/components/shared/Pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  onRowClick?: (row: TData) => void;
  isRowSelected?: (row: TData) => boolean;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 9,
  onRowClick,
  isRowSelected,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className="w-full flex flex-col">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-muted-foreground font-medium">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="py-4 px-6 font-medium whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="text-foreground bg-card divide-y divide-border/50">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const selected = isRowSelected?.(row.original) ?? false;
                return (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className={`transition-colors ${
                      onRowClick ? "cursor-pointer" : ""
                    } ${
                      selected
                        ? "bg-primary/10 hover:bg-primary/15"
                        : "hover:bg-secondary/20"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="py-4 px-6 whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={table.getState().pagination.pageIndex + 1}
        totalPages={table.getPageCount()}
        onPageChange={(page) => table.setPageIndex(page - 1)}
      />
    </div>
  );
}