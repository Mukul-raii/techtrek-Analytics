interface TableColumn<T> {
  header: string;
  key: keyof T;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 ${
                  col.className || ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={String(row[rowKey]) || idx}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-3 sm:px-4 py-3 text-gray-900 ${col.className || ""}`}
                >
                  {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
