import { useEffect, useState } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";

function GradesT() {
    const [grades, setGrades] = useState([]);
    const [search, setSearch] = useState("");

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        grade: "",
    });

    const [addFormData, setAddFormData] = useState({
        student_id: "",
        module_id: "",
        grade: "",
    });

    const loadGrades = async () => {
        try {
            const response = await api.get("/grades/get-my-students");

            setGrades(response.data.grades || []);
        } catch (err) {
            console.log(err.response || err);

            if (err.response?.status === 404) {
                setGrades([]);
                return;
            }

            alert(
                err.response?.data?.message ||
                "Could not load grades"
            );
        }
    };

    useEffect(() => {
        loadGrades();
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

   const filteredGrades = grades
    .map((grade) => ({
        ...grade,
        student_name: `${grade.student_first_name || ""} ${grade.student_last_name || ""}`.trim(),
    }))
    .filter((grade) => {
        const searchText = search.toLowerCase();

        return (
            grade.student_name.toLowerCase().includes(searchText) ||
            grade.module_name?.toLowerCase().includes(searchText) ||
            grade.class_name?.toLowerCase().includes(searchText)
        );
    });

   

    const handleEdit = (grade) => {
        if (!grade.grade_id) {
            alert("This student does not have a grade yet. Use Add Grade.");
            return;
        }

        setFormData({
            id: grade.grade_id,
            grade: grade.grade ?? "",
        });

        setIsEditOpen(true);
    };

    const handleUpdateGrade = async (e) => {
        e.preventDefault();

        if (formData.grade === "") {
            alert("Grade is required");
            return;
        }

        const numericGrade = Number(formData.grade);

        if (
            isNaN(numericGrade) ||
            numericGrade < 0 ||
            numericGrade > 20
        ) {
            alert("Grade must be between 0 and 20");
            return;
        }

        try {
            const response = await api.put(
                `/grades/grades/${formData.id}`,
                {
                    grade: numericGrade,
                }
            );

            alert(
                response.data.message ||
                "Grade updated successfully"
            );

            setIsEditOpen(false);

            setFormData({
                id: "",
                grade: "",
            });

            loadGrades();

        } catch (err) {
            console.log(err.response || err);

            alert(
                err.response?.data?.message ||
                "Could not update grade"
            );
        }
    };

    // =========================
    // ADD GRADE
    // =========================

    const handleAddGrade = async (e) => {
        e.preventDefault();

        if (
            !addFormData.student_id ||
            !addFormData.module_id ||
            addFormData.grade === ""
        ) {
            alert("All fields are required");
            return;
        }

        const numericGrade = Number(addFormData.grade);

        if (
            isNaN(numericGrade) ||
            numericGrade < 0 ||
            numericGrade > 20
        ) {
            alert("Grade must be between 0 and 20");
            return;
        }

        try {
            const response = await api.post(
                "/grades",
                {
                    student_id: Number(addFormData.student_id),
                    module_id: Number(addFormData.module_id),
                    grade: numericGrade,
                }
            );

            alert(
                response.data.message ||
                "Grade created successfully"
            );

            setIsAddOpen(false);

            setAddFormData({
                student_id: "",
                module_id: "",
                grade: "",
            });

            loadGrades();

        } catch (err) {
            console.log(err.response || err);

            alert(
                err.response?.data?.message ||
                "Could not create grade"
            );
        }
    };

    // =========================
    // UNIQUE STUDENTS
    // =========================

    const students = [];

    grades.forEach((row) => {
        const alreadyExists = students.some(
            (student) => student.student_id === row.student_id
        );

        if (!alreadyExists) {
            students.push({
                student_id: row.student_id,
                first_name: row.student_first_name,
                last_name: row.student_last_name,
            });
        }
    });

    
    const modules = [];

    grades.forEach((row) => {
        const alreadyExists = modules.some(
            (module) => module.module_id === row.module_id
        );

        if (!alreadyExists) {
            modules.push({
                module_id: row.module_id,
                module_name: row.module_name,
                semester: row.semester,
            });
        }
    });

   

const columns = [
    {
        header: "Student",
        accessor: "student_name",
    },
    {
        header: "Module",
        accessor: "module_name",
    },
    {
        header: "Semester",
        accessor: "semester",
    },
    {
        header: "Class",
        accessor: "class_name",
    },
    {
        header: "Grade",
        accessor: "grade",
    },
];

    return (
        <div className="p-4 md:p-8 space-y-8">

            <PageHeader
                title="Grades"
                description="Manage grades for students in your classes"
            />

            <TableHeader
                title="Student grades"
                description="View, add, and update grades for your students"
            >
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

                    <input
                        type="text"
                        placeholder="Search students..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full sm:w-72 border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                        type="button"
                        onClick={() => setIsAddOpen(true)}
                        className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white transition-colors hover:bg-indigo-700"
                    >
                        + Add Grade
                    </button>

                </div>
            </TableHeader>

            <div className="overflow-x-auto">

                <DataTable
                    columns={columns}
                    data={filteredGrades}
                    onEdit={handleEdit}
                />

            </div>

            {/* =========================
                ADD GRADE MODAL
            ========================= */}

            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                Add Grade
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Add a grade for one of your students.
                            </p>
                        </div>

                        <form
                            onSubmit={handleAddGrade}
                            className="space-y-5"
                        >

                            {/* STUDENT */}

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                    Student
                                </label>

                                <select
                                    required
                                    value={addFormData.student_id}
                                    onChange={(e) =>
                                        setAddFormData({
                                            ...addFormData,
                                            student_id: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">
                                        Select student
                                    </option>

                                    {students.map((student) => (
                                        <option
                                            key={student.student_id}
                                            value={student.student_id}
                                        >
                                            {student.first_name}{" "}
                                            {student.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* MODULE */}

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                    Module
                                </label>

                                <select
                                    required
                                    value={addFormData.module_id}
                                    onChange={(e) =>
                                        setAddFormData({
                                            ...addFormData,
                                            module_id: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">
                                        Select module
                                    </option>

                                    {modules.map((module) => (
                                        <option
                                            key={module.module_id}
                                            value={module.module_id}
                                        >
                                            {module.module_name} - Semester{" "}
                                            {module.semester}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* GRADE */}

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                    Grade / 20
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    step="0.01"
                                    required
                                    value={addFormData.grade}
                                    onChange={(e) =>
                                        setAddFormData({
                                            ...addFormData,
                                            grade: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* BUTTONS */}

                            <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-4">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddOpen(false);

                                        setAddFormData({
                                            student_id: "",
                                            module_id: "",
                                            grade: "",
                                        });
                                    }}
                                    className="rounded-xl px-5 py-2.5 font-semibold text-gray-600 transition-colors hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-indigo-600 px-6 py-2.5 font-bold text-white transition-all hover:bg-indigo-700"
                                >
                                    Add Grade
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* =========================
                EDIT GRADE MODAL
            ========================= */}

            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                Update Grade
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Update the student's grade.
                            </p>
                        </div>

                        <form
                            onSubmit={handleUpdateGrade}
                            className="space-y-5"
                        >

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                    Grade / 20
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    step="0.01"
                                    required
                                    value={formData.grade}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            grade: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-4">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditOpen(false);

                                        setFormData({
                                            id: "",
                                            grade: "",
                                        });
                                    }}
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

export default GradesT;