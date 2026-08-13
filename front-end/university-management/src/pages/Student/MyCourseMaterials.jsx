import { useEffect, useState } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";

function MyCourseMaterials() {
    const columns = [
        { header: "Title", accessor: "title" },
        { header: "Module", accessor: "module_name" },
        { header: "Class", accessor: "class_name" },
        { header: "Teacher", accessor: "teacher_name" },
        { header: "Uploaded At", accessor: "uploaded_at" },
    ];

    const [courseMaterials, setCourseMaterials] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    async function loadMyCourseMaterials() {
        try {
            const response = await api.get("/course/me");

            const materials = Array.isArray(response.data.courseMaterials)
                ? response.data.courseMaterials
                : [];

            const formattedMaterials = materials.map((material) => ({
                ...material,
                teacher_name: [
                    material.teacher_first_name,
                    material.teacher_last_name,
                ]
                    .filter(Boolean)
                    .join(" "),
                uploaded_at: material.uploaded_at
                    ? new Date(material.uploaded_at).toLocaleString()
                    : "—",
            }));

            setCourseMaterials(formattedMaterials);
            setError("");
        } catch (err) {
            console.log(err);

            setCourseMaterials([]);
            setError(
                err.response?.data?.message ||
                    "Unable to load course materials."
            );
        }
    }

    useEffect(() => {
        loadMyCourseMaterials();
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredCourseMaterials = courseMaterials.filter((material) => {
        const query = search.toLowerCase();

        return (
            material.title?.toLowerCase().includes(query) ||
            material.module_name?.toLowerCase().includes(query) ||
            material.teacher_name?.toLowerCase().includes(query) ||
            material.class_name?.toLowerCase().includes(query) ||
            material.uploaded_at?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="p-8 space-y-8">
            <PageHeader
                title={"My course materials"}
                description={"View materials uploaded for your modules"}
            />

            <TableHeader
                title={"Course materials list"}
                description={"View and search your available course materials"}
            >
                <input
                    type="text"
                    placeholder="Search title, module, teacher..."
                    value={search}
                    onChange={handleSearch}
                    className="border border-slate-300 rounded-lg px-4 py-2"
                />

                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
                    Filter
                </button>
            </TableHeader>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <DataTable
                columns={columns}
                data={filteredCourseMaterials}
            />
        </div>
    );
}

export default MyCourseMaterials;