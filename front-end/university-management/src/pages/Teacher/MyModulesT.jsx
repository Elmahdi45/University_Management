import { useEffect, useState } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";

function MyModulesT() {

  const [modules, setModules] = useState([]);
  const [search, setSearch] = useState("");

  const columns = [
    {
      header: "Module ID",
      accessor: "id",
    },
    {
      header: "Module",
      accessor: "name",
    },
    {
      header: "Semester",
      accessor: "semester",
    },
    {
      header: "Coefficient",
      accessor: "coefficient",
    },
    {
      header: "Class",
      accessor: "class_name",
    },
  ];

  async function loadModules() {

    try {

      const response = await api.get("/module/teacher");

      setModules(response.data.modules || []);

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadModules();
  }, []);

  const filteredModules = modules.filter((module) =>
    `${module.name} ${module.class_name || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">

      <PageHeader
        title="My Modules"
        description="View the modules you teach"
      />

      <TableHeader
        title="My Modules List"
        description="All modules assigned to you"
      >

        <input
          type="text"
          placeholder="Search modules..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2"
        />

      </TableHeader>

      <DataTable
        columns={columns}
        data={filteredModules}
      />

    </div>
  );
}

export default MyModulesT;