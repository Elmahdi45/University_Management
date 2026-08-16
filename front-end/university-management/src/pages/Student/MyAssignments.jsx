import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";
function MyAssignments() {
    const columns = [
        { header: "Title", accessor: "title" },
        { header: "Description", accessor: "description" },
        { header: "Module", accessor: "module_name" },
        { header: "Class", accessor: "class_name" },
        { header: "Teacher", accessor: "teacher_name" },
        { header: "Deadline", accessor: "deadline" },
        {
    header: "View",
    accessor: (assignment) => (
        <Link
            to={`/my-assignment/${assignment.id}`}
            className="font-medium text-indigo-600 hover:text-indigo-800"
        >
            View
        </Link>
    ),
},
       
    ];

    const [assignments, setAssignments] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    async function loadMyAssignments() {
        try {
            const response = await api.get("/assignment/me");

            const data = Array.isArray(response.data.assignments)
                ? response.data.assignments
                : [];

            const formattedAssignments = data.map((assignment) => ({
                ...assignment,
                teacher_name: [
                    assignment.teacher_first_name,
                    assignment.teacher_last_name,
                ]
                    .filter(Boolean)
                    .join(" "),
                deadline: assignment.deadline
                    ? new Date(assignment.deadline).toLocaleString()
                    : "—",
            }));

            setAssignments(formattedAssignments);
            setError("");
        } catch (err) {
            console.log(err);

            setAssignments([]);
            setError(
                err.response?.data?.message ||
                    "Unable to load assignments."
            );
        }
    }

    useEffect(() => {
        loadMyAssignments();
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const deleteIt=()=>{

    }
    const editIt=()=>{
         
    }
    const filteredAssignments = assignments.filter((assignment) => {
        const query = search.toLowerCase();

        return (
            assignment.title?.toLowerCase().includes(query) ||
            assignment.description?.toLowerCase().includes(query) ||
            assignment.module_name?.toLowerCase().includes(query) ||
            assignment.class_name?.toLowerCase().includes(query) ||
            assignment.teacher_name?.toLowerCase().includes(query) ||
            assignment.deadline?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="p-8 space-y-8">
            <PageHeader
                title={"My assignments"}
                description={"View assignments for your modules"}
            />

            <TableHeader
                title={"My assignments list"}
                description={"View all your available assignments"}
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
                data={filteredAssignments}
               
            />
        </div>
    );
}

export default MyAssignments;