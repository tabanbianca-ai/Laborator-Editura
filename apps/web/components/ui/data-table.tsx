import type { ReactNode } from "react";

import { EmptyState } from "./empty-state";
import { Table } from "./table";

interface DataTableColumn<TRow> {
  header: string;
  render: (row: TRow) => ReactNode;
}

interface DataTableProps<TRow> {
  ariaLabel: string;
  columns: Array<DataTableColumn<TRow>>;
  emptyTitle?: string;
  getRowKey: (row: TRow) => string;
  rows: TRow[];
}

export function DataTable<TRow>({
  ariaLabel,
  columns,
  emptyTitle = "No records",
  getRowKey,
  rows
}: DataTableProps<TRow>) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} />;
  }

  return (
    <Table ariaLabel={ariaLabel}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.header}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={getRowKey(row)}>
            {columns.map((column) => (
              <td key={column.header}>{column.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
