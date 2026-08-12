import { useEffect, useState } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

function CourseMaterials() {
    const [search, setSearch] = useState("");
    const [courseMaterials, setCourseMaterials] = useState([]);

    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCourseMaterial, setSelectedCourseMaterial] = useState(null);

    const [formData, setFormData] = useState({
        id: "",
        title: "",
        file_path: "",
    });

    const loadCourseMaterials = async () => {
        try {
            const response = await api.get("/courseMaterial");

            setCourseMaterials(response.data.courseMaterials || []);
        } catch (err) {
            console.log(err.response || err);

            // A 404 here just means there are no materials yet.
            if (err.response?.status === 404) {
                setCourseMaterials([]);
                return;
            }

            alert(
                err.response?.data?.message ||
                "Could not load course materials"
            );
        }
    };

    useEffect(() => {
        loadCourseMaterials();
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredCourseMaterials = courseMaterials.filter((material) => {
        const searchText = search.toLowerCase();

        return (
            material.title?.toLowerCase().includes(searchText) ||
            material.module_name?.toLowerCase().includes(searchText) ||
            material.teacher_first_name?.toLowerCase().includes(searchText) ||
            material.teacher_last_name?.toLowerCase().includes(searchText)
        );
    });

    const handleEdit = (material) => {
        setFormData({
            id: material.id,
            title: material.title || "",
            file_path: material.file_path || "",
        });

        setIsOpen(true);
    };

    const handleEditCourseMaterial = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put(
                `/courseMaterial/edit-course-materials/${formData.id}`,
                {
                    title: formData.title,
                    file_path: formData.file_path,
                }
            );

            alert(response.data.message || "Course material updated successfully");

            setIsOpen(false);
            setFormData({
                id: "",
                title: "",
                file_path: "",
            });

            loadCourseMaterials();
        } catch (err) {
            console.log(err.response || err);

            alert(
                err.response?.data?.message ||
                "Could not update course material"
            );
        }
    };

    const handleDelete = (material) => {
        setSelectedCourseMaterial(material);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedCourseMaterial?.id) {
            alert("Course material ID is missing");
            return;
        }

        try {
            const response = await api.delete(
                `/courseMaterial/delete-course-materials/${selectedCourseMaterial.id}`
            );

            alert(response.data.message || "Course material deleted successfully");

            setIsDeleteOpen(false);
            setSelectedCourseMaterial(null);

            loadCourseMaterials();
        } catch (err) {
            console.log(err.response || err);

            alert(
                err.response?.data?.message ||
                "Could not delete course material"
            );
        }
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Title", accessor: "title" },
        { header: "Module", accessor: "module_name" },
        { header: "Semester", accessor: "module_semester" },
        {
            header: "Teacher",
            accessor: (row) =>
                `${row.teacher_first_name || ""} ${row.teacher_last_name || ""}`.trim(),
        },
        {
            header: "File path",
            accessor: "file_path",
        },
        {
            header: "Uploaded at",
            accessor: (row) =>
                row.uploaded_at
                    ? new Date(row.uploaded_at).toLocaleString()
                    : "-",
        },
    ];

    return (
        <div className="p-4 md:p-8 space-y-8">
            <PageHeader
                title="Course materials"
                description="Manage and view all university course materials"
            />

            <TableHeader
                title="Course materials list"
                description="View, edit, and delete course materials"
            >
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search materials..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full sm:w-72 border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </TableHeader>

            <div className="overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={filteredCourseMaterials}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedCourseMaterial(null);
                }}
                onConfirm={confirmDelete}
                title="Delete course material"
                message={`Are you sure you want to delete "${selectedCourseMaterial?.title || "this course material"}"?`}
            />

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                Edit course material
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Update the title or file path.
                            </p>
                        </div>

                        <form
                            onSubmit={handleEditCourseMaterial}
                            className="space-y-5"
                        >
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                    File path
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.file_path}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            file_path: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-xl px-5 py-2.5 font-semibold text-gray-600 transition-colors hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-indigo-600 px-6 py-2.5 font-bold text-white transition-all hover:bg-indigo-700"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CourseMaterials;