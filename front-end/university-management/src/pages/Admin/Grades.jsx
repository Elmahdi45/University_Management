import { useState, useEffect } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";



function Grades() {
    const [grades, setGrades] = useState([]);
    const [search, setSearch] = useState("");
       const columns = [    
    { header: "Grade id", accessor: "grade_id" },
    {header:"Student first name",accessor:"first_name"},
    {header:"Student last name" ,accessor:"last_name"},
    {header:"Module id" ,accessor:"module_id"},
    {header:"Module name",accessor:"module_name"},
    {header:"Student grade",accessor:"grade"},
    {header:"Class name",accessor:"class_name"}
    

   ]

    async function loadGrades() {
        try {
            const response = await api.get("/grades");
            setGrades(response.data.grades);
            
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        loadGrades();
    }, []);

  const filteredGrades = grades.filter((grade) =>
    `${grade.first_name} ${grade.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase())
);
    return (
        <div className="p-8 space-y-8">

            <PageHeader
                title="Grades"
                description="View student grades"
            />

            <TableHeader
                title="Grades List"
                description="View all student grades"
            >
                <input
                    type="text"
                    placeholder="Search student..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-slate-300 rounded-lg px-4 py-2"
                />
            </TableHeader>

            <DataTable
                columns={columns}
                data={filteredGrades}
            />

        </div>
    );
}
export default Grades;