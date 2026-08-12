import { useState, useEffect } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";



function TeachingAssignment(){
     const [search,setSearch]=useState("");
     const [teachingAssignments,setTeachingAssignments]=useState([]);
     const [modal,setModal]=useState("add");
     const [isOpen,setIsOpen]=useState(false);
     const [teachingAssignment,setTeachingAssignment]=useState({
            teacher_id:0,
            module_id:0,
            class_id:0
     })
     const [newTeachingAssignment,setNewTeachingAssignment]=useState({
            teacher_id:0,
            module_id:0,
            class_id:0
     })
     const formData=modal==="add"?teachingAssignment:newTeachingAssignment;
     const setFormData=modal==="add"?setTeachingAssignment:setNewTeachingAssignment;
       const [isDeleteOpen,setIsDeleteOpen]=useState(false);
     const [selectedTeachingAssignment,setSelectedTeachingAssignment]=useState(null);

     const columns = [    
      {header:"T.A id" ,accessor:"teaching_assignment_id"},
    { header:"Teacher name",accessor:"teacher_name"},
    { header: "Module name", accessor: "module_name" },
    {header:"class name" ,accessor:"class_name"},

   ]

       async function loadTeachingAssignments(){
          try{
               const response=await api.get('/teachingAssignment');
               setTeachingAssignments(response.data);
          }
          catch(err){
             console.log(err);
          }
    }
    useEffect(()=>{
         loadTeachingAssignments();
    },[])


      const handleAddClick=()=>{
               setModal("add");
               setTeachingAssignment({
                    teacher_id:0,
                    module_id:0,
                    class_id:0   
               })
               setIsOpen(true);

      }
      const handleAddTeachingAssignment= async(e)=>{
            e.preventDefault();
            try{    
                 const response=await api.post('/teachingAssignment',teachingAssignment);
                 alert(response.data.message || "Teaching assignment created");
                 setTeachingAssignment({
                    id:0,
                    teacher_id:0,
                    module_id:0,
                    class_id:0  
                 })
                 setIsOpen(false);
                 loadTeachingAssignments();
            }
            catch(err){
                console.log(err.response);
                 alert(
            err.response?.data?.message ||
            "Something went wrong"
         );
            }
      }

    const handleEdit = (row) => {
    setModal("edit");

    setNewTeachingAssignment({
        id: row.teaching_assignment_id,
        teacher_id: row.teacher_id,
        module_id: row.module_id,
        class_id: row.class_id
    });

    setIsOpen(true);
};


      const handleEditTeachingAssignment= async(e)=>{
               e.preventDefault();
               try{
                     const response=await api.put(`/teachingAssignment/edit-teachingAssignment/${newTeachingAssignment.id}`,newTeachingAssignment);
                     alert(response.data.message || "Teaching assignment updated");
                       setTeachingAssignment({
                          id:0,
                          teacher_id:0,
                          module_id:0,
                          class_id:0  
                      })
                 setIsOpen(false);
                 loadTeachingAssignments();
                     
               }
               catch(err){
                      console.log(err.response);
                 alert(
                    err.response?.data?.message ||
                    "Something went wrong"
               );
               }
      }
      const handleDelete=(teachingAssignment)=>{
          setSelectedTeachingAssignment(teachingAssignment);
          setIsDeleteOpen(true);
      }
     const confirmDelete= async()=>{
           try{
                await api.delete(`/teachingAssignment/delete-teachingAssignment/${selectedTeachingAssignment.teaching_assignment_id}`); 
                alert("Teaching assignment deleted successfully");
                setIsDeleteOpen(false);
                setSelectedTeachingAssignment(null);
                loadTeachingAssignments();

            }
            catch(err){  
                 console.log(err);
            }
    }

      const handleSearch=(e)=>{
         setSearch(e.target.value);
    }

      return (
          <div className="p-8 space-y-8"> 
              <PageHeader
                 title={"Teaching assignments"}
                 description={"Assign university teachers"}
                 buttonText={"Add teaching assignment"}
                 onButtonClick={handleAddClick}
              >
                  
              </PageHeader>


               <TableHeader title={"Teaching assingments list"} description={"Manage all university teaching assingments"}>
                    <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={handleSearch}
                                className="border border-slate-300 rounded-lg px-4 py-2"
                  />
                 <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Filter</button>

                 </TableHeader>

                 <DataTable columns={columns} data={teachingAssignments} onEdit={handleEdit} onDelete={handleDelete}>

                 </DataTable>

           <ConfirmDeleteModal
                 isOpen={isDeleteOpen}
                 onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedTeachingAssignment(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Teaching assignment"
                 message={`Are you sure you want to delete ${selectedTeachingAssignment?.teacher_name}?`}
             >
                  
             </ConfirmDeleteModal>


                  {
             isOpen&&(
                 <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">{modal === "add" ? "Add teaching assignment" : "Edit teaching assignment"}</h2>
                            <span className="font-light w-4 hover:cursor-pointer" onClick={() => setIsOpen(false)}>
                                X
                            </span>
                        </div>

                        <form onSubmit={modal==="add"?handleAddTeachingAssignment:handleEditTeachingAssignment} className="space-y-5">
                             <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teacher id</label>
                                 <input type="text" placeholder="Teacher id"
                                     required
                                     className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                     value={formData.teacher_id}
                                     onChange={(e)=>setFormData({...formData,teacher_id:e.target.value})}
                                 />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Module id</label>
                                 <input type="text" placeholder="Module id"
                                     required
                                     className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                     value={formData.module_id}
                                     onChange={(e)=>setFormData({...formData,module_id:e.target.value})}
                                 />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class id</label>
                                 <input type="text" placeholder="Class id"
                                     required
                                     className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                     value={formData.class_id}
                                     onChange={(e)=>setFormData({...formData,class_id:e.target.value})}
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
export default TeachingAssignment;