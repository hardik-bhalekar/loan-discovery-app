import { ArrowDownUp, ArrowDown, ArrowUp } from 'lucide-react';

export default function DataTable({ columns, rows, sortState, onSort, keyField }) {
  return (
    <div className="table-frame">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-[color-mix(in_oklab,var(--bg-secondary)_84%,var(--bg-card)_16%)] backdrop-blur">
            <tr>
              {columns.map((column) => {
                const isSorted = sortState?.key === column.key;
                const direction = isSorted ? sortState.direction : null;
                const Icon = direction === 'asc' ? ArrowUp : direction === 'desc' ? ArrowDown : ArrowDownUp;

                return (
                  <th key={column.key} className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort?.(column.key)}
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-left transition-colors hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
                      >
                        {column.label}
                        <Icon className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[keyField]} className="border-t border-[var(--border-subtle)] transition-colors hover:bg-[color-mix(in_oklab,var(--bg-secondary)_76%,var(--bg-card)_24%)]">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 align-top text-[var(--text-primary)]">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
