import { useState,useEffect } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";


function MyGrades(){
 const columns = [
  { header: "Module", accessor: "module_name" },
  { header: "Semester", accessor: "semester" },
  { header: "Class", accessor: "class_name" },
  { header: "Grade", accessor: "grade" },
];
    const [search,setSearch]=useState("");
    const [myGrades,setMyGrades]=useState([]);

    async function loadMyGrades(){
         try{
             const response=await api.get('/grades/me');
             setMyGrades(response.data.grades);
         }
         catch(err){
                console.log(err);

                alert(
                    err.response?.data?.message || "Something went wrong"
                );   
         }
    }
    useEffect(()=>{
         loadMyGrades();
    },[]);
    const handleSearch=(e)=>{
         setSearch(e.target.value);
    }
     return(
         <div className="p-8 space-y-8">
                <PageHeader
                     title={"My grades"}
                     description={"View All your grades"}                     
                 >               
              </PageHeader>

                <TableHeader title={"My grades list"} description={"View all your grades"}>
                    <input
                                type="text"
                                placeholder="Search modules..."
                                value={search}
                                onChange={handleSearch}
                                className="border border-slate-300 rounded-lg px-4 py-2"
                  />
                 <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Filter</button>

                 </TableHeader>

                 <DataTable columns={columns} data={myGrades}>

                 </DataTable>
          </div>
     )
}
export default MyGrades;