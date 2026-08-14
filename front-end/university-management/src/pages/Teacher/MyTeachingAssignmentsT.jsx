import { useEffect, useState } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";

function MyTeachingAssignmentsT() {

    const columns = [
        {
            header: "Module",
            accessor: "module_name"
        },
        {
            header: "Class",
            accessor: "class_name"
        },
        {
            header: "Semester",
            accessor: "semester"
        }
    ];

    const [assignments, setAssignments] = useState([]);
    const [search, setSearch] = useState("");

    async function loadMyTeachingAssignments() {
        try {

            const response = await api.get(
                "/teachingAssignment/get-my-teachingassignment"
            );

            setAssignments(
                response.data.teaching_assignments || []
            );

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Something went wrong"
            );
        }
    }

    useEffect(() => {
        loadMyTeachingAssignments();
    }, []);

    const filteredAssignments = assignments.filter((assignment) => {

        const value = search.toLowerCase();

        return (
            assignment.module_name
                ?.toLowerCase()
                .includes(value) ||

            assignment.class_name
                ?.toLowerCase()
                .includes(value) ||

            String(assignment.semester)
                .toLowerCase()
                .includes(value)
        );
    });

    return (
        <div className="p-8 space-y-8">

            <PageHeader
                title="My Teaching Assignments"
                description="View the modules and classes you are assigned to teach"
            />

            <TableHeader
                title="Teaching Assignments List"
                description="Your current teaching assignments"
            >

                <input
                    type="text"
                    placeholder="Search assignments..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-slate-300 rounded-lg px-4 py-2"
                />

                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
                    Filter
                </button>

            </TableHeader>

            <DataTable
                columns={columns}
                data={filteredAssignments}
            />

        </div>
    );
}

export default MyTeachingAssignmentsT;