    import { Pencil, Trash2 } from "lucide-react";

    function DataTable({
    columns,
    data,
    actions = true,
    onEdit,
    onDelete,
    }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">

            <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
                {columns.map((column) => (
                <th
                    key={column.accessor}
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
                >
                    {column.header}
                </th>
                ))}

                {actions && (
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                    Actions
                </th>
                )}
            </tr>
            </thead>

            <tbody>

            {data.map((row) => (

                <tr
                key={row.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition"
                >

                {columns.map((column) => (

                    <td
                    key={column.accessor}
                    className="px-6 py-4 text-slate-700"
                    >
                    {row[column.accessor]}
                    </td>

                ))}

                {actions && (
                    <td className="px-6 py-4">

                    <div className="flex justify-center gap-3">

                        <button
                        onClick={() => onEdit(row)}
                        className="text-indigo-600 hover:text-indigo-800"
                        >
                        <Pencil size={18} />  
                        </button>

                        <button
                        onClick={() => onDelete(row)}
                        className="text-red-600 hover:text-red-800"
                        >
                        <Trash2 size={18} />
                        </button>

                    </div>

                    </td>
                )}

                </tr>

            ))}

            </tbody>

        </table>
        </div>
    );
    }

    export default DataTable;