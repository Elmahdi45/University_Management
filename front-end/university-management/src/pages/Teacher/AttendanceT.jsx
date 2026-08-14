import { useEffect, useState } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";

function AttendanceT() {

  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");

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
      header: "Class",
      accessor: "class_name",
    },
    {
      header: "Date",
      accessor: "date",
    },
    {
      header: "Status",
      accessor: "status",
    },
  ];

  async function loadAttendance() {

    try {

      const response = await api.get("/attendance/teacher");

      setAttendance(response.data.attendance || []);

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadAttendance();
  }, []);

  const filteredAttendance = attendance.filter((item) =>
    `${item.student_name} ${item.module_name} ${item.class_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">

      <PageHeader
        title="Attendance"
        description="Manage student attendance"
      />

      <TableHeader
        title="Attendance List"
        description="Attendance records for your students"
      >

        <input
          type="text"
          placeholder="Search student or module..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2"
        />

      </TableHeader>

      <DataTable
        columns={columns}
        data={filteredAttendance}
      />

    </div>
  );
}

export default AttendanceT;