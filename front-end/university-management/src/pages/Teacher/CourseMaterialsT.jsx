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
    const [isAddOpen, setIsAddOpen] = useState(false);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCourseMaterial, setSelectedCourseMaterial] = useState(null);

    const [formData, setFormData] = useState({
        id: "",
        title: "",
        file_path: "",
    });

    const [addData, setAddData] = useState({
        module_id: "",
        title: "",
        file_path: "",
    });


    // =========================
    // LOAD MATERIALS
    // =========================

    const loadCourseMaterials = async () => {

        try {

            const response = await api.get("/course");

            setCourseMaterials(
                response.data.courseMaterials || []
            );

        } catch (err) {

            console.log(err.response || err);

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


    // =========================
    // SEARCH
    // =========================

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredCourseMaterials = courseMaterials.filter(
        (material) => {

            const searchText = search.toLowerCase();

            return (
                material.title
                    ?.toLowerCase()
                    .includes(searchText) ||

                material.module_name
                    ?.toLowerCase()
                    .includes(searchText)
            );
        }
    );


    // =========================
    // ADD
    // =========================

    const handleAddCourseMaterial = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/course",
                {
                    module_id: Number(addData.module_id),
                    title: addData.title,
                    file_path: addData.file_path
                }
            );

            alert(
                response.data.message ||
                "Course material created successfully"
            );

            setAddData({
                module_id: "",
                title: "",
                file_path: ""
            });

            setIsAddOpen(false);

            loadCourseMaterials();

        } catch (err) {

            console.log(err.response || err);

            alert(
                err.response?.data?.message ||
                "Could not create course material"
            );
        }
    };


    // =========================
    // EDIT
    // =========================

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
                `/course/edit-course-materials/${formData.id}`,
                {
                    title: formData.title,
                    file_path: formData.file_path,
                }
            );

            alert(
                response.data.message ||
                "Course material updated successfully"
            );

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


    // =========================
    // DELETE
    // =========================

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
                `/course/delete-course-materials/${selectedCourseMaterial.id}`
            );

            alert(
                response.data.message ||
                "Course material deleted successfully"
            );

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


    // =========================
    // TABLE
    // =========================

    const columns = [

        {
            header: "ID",
            accessor: "id"
        },

        {
            header: "Title",
            accessor: "title"
        },

        {
            header: "Module",
            accessor: "module_name"
        },

        {
            header: "Semester",
            accessor: "module_semester"
        },

        {
            header: "File path",
            accessor: "file_path"
        },

        {
            header: "Uploaded at",
            accessor: (row) =>
                row.uploaded_at
                    ? new Date(
                        row.uploaded_at
                    ).toLocaleString()
                    : "-"
        }

    ];


    return (

        <div className="p-4 md:p-8 space-y-8">

            <PageHeader
                title="Course materials"
                description="Manage your course materials"
            />


            <TableHeader
                title="Course materials list"
                description="View, edit, and delete your course materials"
            >

                <div className="flex flex-col sm:flex-row gap-3">

                    <input
                        type="text"
                        placeholder="Search materials..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full sm:w-72 border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                        + Add Course Material
                    </button>

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


            {/* DELETE MODAL */}

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


            {/* EDIT MODAL */}

            {isOpen && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

                        <h2 className="text-xl font-bold text-gray-800">
                            Edit course material
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Update the title or file path.
                        </p>


                        <form
                            onSubmit={handleEditCourseMaterial}
                            className="space-y-5 mt-6"
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
                                            title: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
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
                                            file_path: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                />

                            </div>


                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">

                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-xl px-5 py-2.5 font-semibold text-gray-600 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-indigo-600 px-6 py-2.5 font-bold text-white hover:bg-indigo-700"
                                >
                                    Update
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* ADD MODAL */}

            {isAddOpen && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

                        <h2 className="text-xl font-bold text-gray-800">
                            Add course material
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Add a new material to one of your modules.
                        </p>


                        <form
                            onSubmit={handleAddCourseMaterial}
                            className="space-y-5 mt-6"
                        >

                            <div>

                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                    Module ID
                                </label>

                                <input
                                    type="number"
                                    required
                                    value={addData.module_id}
                                    onChange={(e) =>
                                        setAddData({
                                            ...addData,
                                            module_id: e.target.value
                                        })
                                    }
                                    placeholder="Enter module ID"
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                />

                            </div>


                            <div>

                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={addData.title}
                                    onChange={(e) =>
                                        setAddData({
                                            ...addData,
                                            title: e.target.value
                                        })
                                    }
                                    placeholder="Course material title"
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                />

                            </div>


                            <div>

                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                    File path
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={addData.file_path}
                                    onChange={(e) =>
                                        setAddData({
                                            ...addData,
                                            file_path: e.target.value
                                        })
                                    }
                                    placeholder="Enter file path"
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                />

                            </div>


                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">

                                <button
                                    type="button"
                                    onClick={() => setIsAddOpen(false)}
                                    className="rounded-xl px-5 py-2.5 font-semibold text-gray-600 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-indigo-600 px-6 py-2.5 font-bold text-white hover:bg-indigo-700"
                                >
                                    Add
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