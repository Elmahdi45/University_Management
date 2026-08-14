import { useEffect, useState } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";

function MyStudentsT() {

    const columns = [
        {
            header: "First Name",
            accessor: "first_name"
        },
        {
            header: "Last Name",
            accessor: "last_name"
        },
        {
            header: "Email",
            accessor: "email"
        },
        {
            header: "Phone",
            accessor: "phone"
        },
        {
            header: "Class",
            accessor: "class_name"
        }
    ];

    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");

    async function loadMyStudents() {
        try {
            const response = await api.get("/teachingAssignment/get-my-students");

            setStudents(response.data.students || []);

        } catch (err) {
            console.log(err);

            alert(
                err.response?.data?.message ||
                "Something went wrong"
            );
        }
    }

    useEffect(() => {
        loadMyStudents();
    }, []);

    const filteredStudents = students.filter((student) => {

        const value = search.toLowerCase();

        return (
            student.first_name?.toLowerCase().includes(value) ||
            student.last_name?.toLowerCase().includes(value) ||
            student.email?.toLowerCase().includes(value) ||
            student.class_name?.toLowerCase().includes(value)
        );
    });

    return (
        <div className="p-8 space-y-8">

            <PageHeader
                title="My Students"
                description="View the students assigned to your classes"
            />

            <TableHeader
                title="My Students List"
                description="Students from your assigned classes"
            >

                <input
                    type="text"
                    placeholder="Search students..."
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
                data={filteredStudents}
            />

        </div>
    );
}

export default MyStudentsT;