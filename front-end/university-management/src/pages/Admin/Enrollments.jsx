import { useState, useEffect } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";




function Enrollments(){
    const [enrollments,setEnrollments]=useState([]);
    const [enrollment,setEnrollment]=useState({
          student_id:0,
          module_id:0
    })
    const [newEnrollment,setNewEnrollment]=useState({
          student_id:0,
          module_id:0
    })
   const [search,setSearch]=useState("");
   const [modal,setModal]=useState("add");
   const [isOpen,setIsOpen]=useState(false);
   const [selectedEnrollment,setSelectedEnrollment]=useState(null);
   const [isDeleteOpen,setIsDeleteOpen]=useState(false);
   const columns = [    
    { header:"Enrollment id",accessor:"id"},
    { header: "Student id", accessor: "student_id" },
    {header:"Module id" ,accessor:"module_id"},

   ]

   
    const formData=modal==="add"?enrollment:newEnrollment;
    const setFormData=modal==="add"?setEnrollment:setNewEnrollment;

    async function loadEnrollments(){
          try{
               const response=await api.get('/enrollments');
               setEnrollments(response.data);
          }
          catch(err){
             console.log(err);
          }
    }
    useEffect(()=>{
         loadEnrollments();
    },[])

    const handleAddClick=()=>{
          setModal("add");
          setEnrollment({
              student_id:0,
              module_id:0
          })
          setIsOpen(true);
    }
    const handleAddEnrollment= async(e)=>{ 
           e.preventDefault();
           try{
             const response=await api.post('/enrollments',enrollment);
             alert(response.data.message ||"enrollment created!");
              setEnrollment({
              student_id:0,
              module_id:0
          })
             setIsOpen(false);
             loadEnrollments();
             
         }
         catch(err){
                     console.log(err.response);

                alert(
                    err.response?.data?.message ||
                    "Something went wrong"
                );
         }
    }

        const handleEdit=(row)=>{ 
         setModal("edit");
         setNewEnrollment({
              id:row.id,
              student_id:row.student_id,
              module_id:row.module_id
         })
         setIsOpen(true);   
    }   
    const handleEditEnrollment=async(e)=>{
          e.preventDefault();
         try{    
             const response=await api.put(`/enrollments/edit-enrollment/${newEnrollment.id}`,newEnrollment);
             alert(response.data.message || "Enrollment updated!");
             setIsOpen(false);
             loadEnrollments();
         }  
         catch(err){
              console.log(err.response);

        alert(
            err.response?.data?.message ||
            "Something went wrong"
        );
         }
    }

    const handleDelete=(module)=>{
          setSelectedEnrollment(module);
          setIsDeleteOpen(true);
    }


    const confirmDelete= async()=>{
           try{
                await api.delete(`/enrollments/delete-enrollment/${selectedEnrollment.id}`); 
                alert("Enrollment deleted successfully");
                setIsDeleteOpen(false);
                setSelectedEnrollment(null);
                loadEnrollments();

            }
            catch(err){  
                 console.log(err);
            }
    }

    const handleSearch=(e)=>{
         setSearch(e.target.value);
    }
   const filteredEnrollments = enrollments.filter((e) =>
    String(e.student_id).includes(search) ||
    String(e.module_id).includes(search)
);
     return(
         <div className="p-8 space-y-8">
                   <PageHeader
                     title={"Enrollments"}
                     description={"Manage and view all enrollments"}
                     buttonText={"Enroll"}
                     onButtonClick={handleAddClick}
                 
                 >
                     
                 </PageHeader>

                  <TableHeader title={"Enrollment list"} description={"Manage all enrollments"}>
                    <input
                                type="text"
                                placeholder="Search enrollments..."
                                value={search}
                                onChange={handleSearch}
                                className="border border-slate-300 rounded-lg px-4 py-2"
                  />
                 <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Filter</button>

                 </TableHeader>



                  <DataTable columns={columns} data={filteredEnrollments} onEdit={handleEdit} onDelete={handleDelete}>

                 </DataTable>
      <ConfirmDeleteModal
                 isOpen={isDeleteOpen}
                 onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedEnrollment(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Enrollment"
                 message={`Are you sure you want to delete ${selectedEnrollment?.id}?`}
             >
                  
             </ConfirmDeleteModal>



        {
             isOpen&&(
                 <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">{modal === "add" ? "Enroll student" : "Edit enrollment"}</h2>
                            <span className="font-light w-4 hover:cursor-pointer" onClick={() => setIsOpen(false)}>
                                X
                            </span>
                        </div>

                        <form onSubmit={modal==="add"?handleAddEnrollment:handleEditEnrollment} className="space-y-5">
                             <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Student id</label>
                                 <input type="text" placeholder="student id"
                                     required
                                     className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                     value={formData.student_id}
                                     onChange={(e)=>setFormData({...formData,student_id:Number(e.target.value)})}
                                 />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Module id</label>
                                 <input type="text" placeholder="module id"
                                     required
                                     className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                     value={formData.module_id}
                                     onChange={(e)=>setFormData({...formData,module_id:Number(e.target.value)})}
                                 />
                            </div>

                              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                                    <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold transition-colors"
                                    >   
                                    Cancel
                                    </button>
                                    <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-sm hover:shadow transition-all active:scale-95"
                                    >
                                    {modal === "add" ? "Add" : "Update"}
                                    </button>
                                </div>

                        </form>
                    </div>     
                 </div>
             )
         }
         </div>


         
     )
}
export default Enrollments;