function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete item",
    message = "Are you sure you want to delete this item?",
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

                <div className="flex items-center justify-between">

                    <h2 className="text-xl font-bold text-gray-900">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 text-xl"
                    >
                        ×
                    </button>

                </div>

                <p className="mt-4 text-gray-600">
                    {message}
                </p>

                <div className="flex justify-end gap-3 mt-8">

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-5 py-2.5 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 transition"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ConfirmDeleteModal;