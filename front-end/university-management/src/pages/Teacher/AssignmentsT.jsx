import { useEffect, useState } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

function AssignmentsT() {

    const [search, setSearch] = useState("");
    const [assignments, setAssignments] = useState([]);
    const [modules, setModules] = useState([]);

    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const [formData, setFormData] = useState({
        id: "",
        module_id: "",
        title: "",
        description: "",
        deadline: ""
    });

   
    const loadAssignments = async () => {
        try {

            const response = await api.get("/assignment");

            setAssignments(response.data.assignments || []);

        } catch (err) {

            console.log(err.response || err);

            if (err.response?.status === 404) {
                setAssignments([]);
                return;
            }

            alert(
                err.response?.data?.message ||
                "Could not load assignments"
            );
        }
    };

    // -----------------------------
    // LOAD TEACHER MODULES
    // -----------------------------

    const loadModules = async () => {
        try {

            
            const response = await api.get("/teachingAssignment/get-my-teachingassignment");

            setModules(response.data.teaching_assignments || []);

        } catch (err) {

            console.log(err.response || err);

            if (err.response?.status === 404) {
                setModules([]);
                return;
            }

            alert(
                err.response?.data?.message ||
                "Could not load your modules"
            );
        }
    };

    useEffect(() => {
        loadAssignments();
        loadModules();
    }, []);

    // -----------------------------
    // SEARCH
    // -----------------------------

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredAssignments = assignments.filter((assignment) => {

        const searchText = search.toLowerCase();

        return (
            assignment.title
                ?.toLowerCase()
                .includes(searchText) ||

            assignment.description
                ?.toLowerCase()
                .includes(searchText) ||

            assignment.module_name
                ?.toLowerCase()
                .includes(searchText) ||

            assignment.class_name
                ?.toLowerCase()
                .includes(searchText)
        );
    });

    // -----------------------------
    // ADD
    // -----------------------------

    const handleAdd = () => {

        setFormData({
            id: "",
            module_id: "",
            title: "",
            description: "",
            deadline: ""
        });

        setIsOpen(true);
    };

    const handleAddAssignment = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/assignment",
                {
                    module_id: Number(formData.module_id),
                    title: formData.title,
                    description: formData.description,
                    deadline: formData.deadline
                }
            );

            alert(
                response.data.message ||
                "Assignment created successfully"
            );

            setIsOpen(false);

            setFormData({
                id: "",
                module_id: "",
                title: "",
                description: "",
                deadline: ""
            });

            loadAssignments();

        } catch (err) {

            console.log(err.response || err);

            alert(
                err.response?.data?.message ||
                "Could not create assignment"
            );
        }
    };

    // -----------------------------
    // EDIT
    // -----------------------------

    const handleEdit = (assignment) => {

        setFormData({
            id: assignment.id,
            module_id: assignment.module_id,
            title: assignment.title || "",
            description: assignment.description || "",
            deadline: assignment.deadline
                ? assignment.deadline.slice(0, 16)
                : ""
        });

        setIsOpen(true);
    };

    const handleEditAssignment = async (e) => {

        e.preventDefault();

        try {

            const response = await api.put(
                `/assignment/edit-assignment/${formData.id}`,
                {
                    title: formData.title,
                    description: formData.description,
                    deadline: formData.deadline
                }
            );

            alert(
                response.data.message ||
                "Assignment updated successfully"
            );

            setIsOpen(false);

            setFormData({
                id: "",
                module_id: "",
                title: "",
                description: "",
                deadline: ""
            });

            loadAssignments();

        } catch (err) {

            console.log(err.response || err);

            alert(
                err.response?.data?.message ||
                "Could not update assignment"
            );
        }
    };

    // -----------------------------
    // DELETE
    // -----------------------------

    const handleDelete = (assignment) => {

        setSelectedAssignment(assignment);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {

        if (!selectedAssignment?.id) {
            alert("Assignment ID is missing");
            return;
        }

        try {

            const response = await api.delete(
                `/assignment/delete-assignment/${selectedAssignment.id}`
            );

            alert(
                response.data.message ||
                "Assignment deleted successfully"
            );

            setIsDeleteOpen(false);
            setSelectedAssignment(null);

            loadAssignments();

        } catch (err) {

            console.log(err.response || err);

            alert(
                err.response?.data?.message ||
                "Could not delete assignment"
            );
        }
    };

    // -----------------------------
    // TABLE
    // -----------------------------

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
            header: "Class",
            accessor: "class_name"
        },
        {
            header: "Description",
            accessor: "description"
        },
        {
            header: "Deadline",
            accessor: (row) =>
                row.deadline
                    ? new Date(row.deadline).toLocaleString()
                    : "-"
        }
    ];

    return (
        <div className="p-4 md:p-8 space-y-8">

            <PageHeader
                title="My Assignments"
                description="Create and manage assignments for your students"
            />

            <TableHeader
                title="Assignments list"
                description="View, create, edit, and delete your assignments"
            >

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

                    <input
                        type="text"
                        placeholder="Search assignments..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full sm:w-72 border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                        onClick={handleAdd}
                        className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700"
                    >
                        + Add Assignment
                    </button>

                </div>

            </TableHeader>

            <div className="overflow-x-auto">

                <DataTable
                    columns={columns}
                    data={filteredAssignments}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            </div>

            {/* DELETE */}

            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedAssignment(null);
                }}
                onConfirm={confirmDelete}
                title="Delete assignment"
                message={`Are you sure you want to delete "${selectedAssignment?.title || "this assignment"}"?`}
            />

            {/* ADD / EDIT MODAL */}

            {isOpen && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

                        <div className="mb-6">

                            <h2 className="text-xl font-bold text-gray-800">
                                {formData.id
                                    ? "Edit assignment"
                                    : "Add assignment"}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {formData.id
                                    ? "Update assignment information."
                                    : "Create a new assignment for your students."}
                            </p>

                        </div>

                        <form
                            onSubmit={
                                formData.id
                                    ? handleEditAssignment
                                    : handleAddAssignment
                            }
                            className="space-y-5"
                        >

                            {/* MODULE */}

                            {!formData.id && (

                                <div>

                                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                        Module
                                    </label>

                                    <select
                                        required
                                        value={formData.module_id}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                module_id: e.target.value
                                            })
                                        }
                                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                    >

                                        <option value="">
                                            Select a module
                                        </option>

                                        {modules.map((item) => (

                                            <option
                                                key={item.module_id}
                                                value={item.module_id}
                                            >
                                                {item.module_name}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                            )}

                            {/* TITLE */}

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
                                    placeholder="Assignment title"
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                />

                            </div>

                            {/* DESCRIPTION */}

                            <div>

                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                    Description
                                </label>

                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value
                                        })
                                    }
                                    placeholder="Assignment description"
                                    rows={4}
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                />

                            </div>

                            {/* DEADLINE */}

                            <div>

                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                    Deadline
                                </label>

                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.deadline}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            deadline: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                />

                            </div>

                            {/* BUTTONS */}

                            <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-4">

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
                                    {formData.id
                                        ? "Update"
                                        : "Create"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AssignmentsT;