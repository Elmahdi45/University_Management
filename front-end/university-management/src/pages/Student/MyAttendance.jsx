import { useState,useEffect } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";



function MyAttendance(){ 


const columns = [
  { header: "Module", accessor: "module_name" },
  { header: "Status", accessor: "status" },
  { header: "Date", accessor: "date" },
];

    const [myAttendance,setMyAttendance]=useState([]);

    const [search,setSearch]=useState("");
     async function loadMyAttendance(){
         try{
             const response=await api.get('/attendance/me');
             setMyAttendance(response.data.attendance);
         }
         catch(err){
                console.log(err);

                alert(
                    err.response?.data?.message || "Something went wrong"
                );   
         }
    }
    useEffect(()=>{
         loadMyAttendance();
    },[]);

    const handleSearch=(e)=>{
         setSearch(e.target.value);
    }
    const filteredAttendance = myAttendance.filter((a) =>
    a.module_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.status?.toLowerCase().includes(search.toLowerCase()) ||
    a.date?.toString().includes(search)
);
    return (
         <div className="p-8 space-y-8">
                <PageHeader
                     title={"My Attendance"}
                     description={"Check your attendance"}                     
                 >               
               </PageHeader>

                <TableHeader title={"My attendance list"} description={"View all your attendance"}>
                    <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={handleSearch}
                                className="border border-slate-300 rounded-lg px-4 py-2"
                  />
                 <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Filter</button>

                 </TableHeader>

                  <DataTable columns={columns} data={filteredAttendance}>

                 </DataTable>
         </div>
    )
}
export default MyAttendance;