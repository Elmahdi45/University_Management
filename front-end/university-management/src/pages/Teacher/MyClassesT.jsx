import { useEffect, useState } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";

function MyClassesT() {

  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");

  const columns = [
    {
      header: "Class ID",
      accessor: "id",
    },
    {
      header: "Class",
      accessor: "name",
    },
    {
      header: "Department",
      accessor: "department_name",
    },
    
  ];

  async function loadClasses() {

    try {

      const response = await api.get("/class/my-classes");

      setClasses(response.data.classes|| []);

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadClasses();
  }, []);

  const filteredClasses = classes.filter((item) =>
    `${item.name} ${item.department_name || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">

      <PageHeader
        title="My Classes"
        description="View the classes assigned to you"
      />

      <TableHeader
        title="My Classes List"
        description="Classes you currently teach"
      >

        <input
          type="text"
          placeholder="Search classes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2"
        />

      </TableHeader>

      <DataTable
        columns={columns}
        data={filteredClasses}
      />

    </div>
  );
}

export default MyClassesT;