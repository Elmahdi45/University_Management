import { useState,useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";
import api from "../../api/axios";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";




function Departments(){
    const [departments,setDepartments]=useState([]);
 const columns = [    
    { header: "Department Name", accessor: "name" },
    { header:"Department id",accessor:"id"}
 ]

    async function loadDepartments(){
          try{
              const response=await api.get("/department");
              setDepartments(response.data);
          }
          catch(err){
              console.log(err);
          }
    }
    useEffect(()=>{
          loadDepartments();
    },[])

     const handleAdd=()=>{ 

     }
     const handleEdit=()=>{
         
     }
     const handleDelete=()=>{

     }
      return (
          <div className="p-8 space-y-8"> 
                <PageHeader
                    title={"Departments"}  
                    description={"Manage all university departments"}
                    buttonText={"Add Department"}
                    onButtonClick={handleAdd}
                >         
                </PageHeader>

              <TableHeader
                   title="Departments List"
                   description={"View and manage university departments"}
                  >
                     <input 
                       type="text" 
                       placeholder="Search departments..."
                       className="border border-slate-300 rounded-lg px-4 py-2"
                       
                       />
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Filter</button>

                </TableHeader>

                  <DataTable
                    columns={columns}
                    data={departments}
                     onEdit={handleEdit}
                    onDelete={handleDelete}
                    >          
                  </DataTable>

          </div>
      )
}
export default Departments;