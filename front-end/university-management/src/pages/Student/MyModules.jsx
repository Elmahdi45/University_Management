import { useState,useEffect } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";



function MyModules(){
   const columns = [    
    { header:"Module id",accessor:"id"},
    { header: "Module Name", accessor: "name" },
    {header:"Module semester" ,accessor:"semester"},
    {header:"Module coefficient" ,accessor:"coefficient"},
    {header:"Module teacher" ,accessor:"teacher_first_name"}

   ]
    const [modules,setModules]=useState([]);
    const [search,setSearch]=useState("");

     
    async function loadMyModules(){
          try{
                 const response=await api.get('/module/my-modules');
                 setModules(response.data.modules); 
          }
          catch(err){
              console.log(err);
             
          }
    }
    useEffect(()=>{
         loadMyModules();
    },[])


    
    const handleSearch=(e)=>{
         setSearch(e.target.value);
    }

const filteredModules = modules.filter((m) => {
  const query = search.toLowerCase();

  return (
    m.name?.toLowerCase().includes(query) ||
    m.semester?.toString().toLowerCase().includes(query) ||
    m.coefficient?.toString().toLowerCase().includes(query) ||
    m.teacher_first_name?.toLowerCase().includes(query) ||
    m.teacher_last_name?.toLowerCase().includes(query)
  );
});     return (
         <div className="p-8 space-y-8">
                <PageHeader
                     title={"My modules"}
                     description={"View All your modules"}
                                 
                 >               
              </PageHeader>
                <TableHeader title={"My modules list"} description={"View all your modules"}>
                    <input
                                type="text"
                                placeholder="Search modules..."
                                value={search}
                                onChange={handleSearch}
                                className="border border-slate-300 rounded-lg px-4 py-2"
                  />
                 <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Filter</button>

                 </TableHeader>



                
                 <DataTable columns={columns} data={filteredModules}>

                 </DataTable>
         </div>
     )
}
export default MyModules;