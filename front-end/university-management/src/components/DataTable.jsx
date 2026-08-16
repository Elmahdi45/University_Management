function DataTable({
    columns = [],
    data = [],
    onEdit,
    onDelete,
}) {
    const hasActions = onEdit || onDelete;

    const getCellValue = (row, accessor) => {
        if (typeof accessor === "function") {
            return accessor(row);
        }

        return row[accessor] ?? "-";
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={`${column.header}-${index}`}
                                className="px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap"
                            >
                                {column.header}
                            </th>
                        ))}

                        {hasActions && (
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                    {data.length > 0 ? (
                        data.map((row, index) => (
                            <tr
                                key={row.id ?? index}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                {columns.map((column, columnIndex) => (
                                    <td
                                        key={`${column.header}-${columnIndex}`}
                                        className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap"
                                    >
                                        {getCellValue(row, column.accessor)}
                                    </td>
                                ))}

                                {hasActions && (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            {onEdit && (
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(row)}
                                                    className="font-medium text-indigo-600 hover:text-indigo-800"
                                                >
                                                    Edit
                                                </button>
                                            )}

                                            {onDelete && (
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(row)}
                                                    className="font-medium text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + (hasActions ? 1 : 0)}
                                className="px-6 py-10 text-center text-slate-500"
                            >
                                No data found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;