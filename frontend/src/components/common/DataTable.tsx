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
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm bg-white">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-3 sm:px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide ${
                  col.className || ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, idx) => (
            <tr
              key={String(row[rowKey]) || idx}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-3 sm:px-4 py-3 text-gray-900 font-medium ${col.className || ""}`}
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
