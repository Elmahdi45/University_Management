import { useState, useEffect } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";



function Assignments(){

    const columns = [    
    { header:"Assignment id",accessor:"id"},
    { header:"Module id",accessor:"module_id"},
    { header: "Title", accessor: "title" },
    { header: "Teacher id", accessor: "teacher_id" },

    {header:"Description" ,accessor:"description"},
    {header:"Deadline" ,accessor:"deadline"},

   ]
    const [search,setSearch]=useState("");
    const [assignments,setAssignments]=useState([]);
    const [assignment,setAssignment]=useState({
          id:0,
          module_id:0,
          title:"",
          description:"",
          deadline:""
    })
     const [newAssignment,setNewAssignment]=useState({
          id:0,
          module_id:0,
          title:"",
          description:"",
          deadline:""
    })
    const [modal,setModal]=useState("add");
    const [isOpen,setIsOpen]=useState(false);
    const [isDeleteOpen,setIsDeleteOpen]=useState(false);
    const [selectedAssignment,setSelectedAssignment]=useState(null);

    const formData=modal==="add"?assignment:newAssignment;
    const setFormData=modal==="add"?setAssignment:setNewAssignment;

    async function loadAssignments(){
          try{
              const response=await api.get('/assignment');
              setAssignments(response.data.assignments);
          }
          catch(err){
              console.log(err);
          }
    }
    useEffect(()=>{
         loadAssignments();
    },[])

    const handleAddClick=()=>{
            setModal("add");
            setAssignment({
                    id:0,
                    module_id:0,
                    title:"",
                    description:"",
                    deadline:""
            })
            setIsOpen(true);  
    }
    const handleAddAssignment= async(e)=>{
           e.preventDefault();
           try{
               const response=await api.post('/assignment',assignment);
               alert(response.data.message || "Assignment Created!");
               setIsOpen(false);
               loadAssignments();
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
          setNewAssignment({
                    id:row.id,
                    module_id:row.module_id,
                    title:row.title,
                    teacher_id:row.teacher_id,
                    description:row.description,
                    deadline:row.deadline
            })
          setIsOpen(true);
    }

    const handleEditAssignment= async(e)=>{
           e.preventDefault();
           try{
                const response=await api.put(`/assignment/edit-assignment/${newAssignment.id}`,newAssignment);
                alert(response.data.message ||"Assignment updated!");
                setIsOpen(false);
                loadAssignments();
           }
           catch(err){
              console.log(err.response);
              alert(err.response?.data?.message || "Something went wrong");
           }
    }
    const handleDelete=(assignment)=>{
           setSelectedAssignment(assignment);
           setIsDeleteOpen(true);
    }
    const confirmDelete= async()=>{
             try{
                const response=await api.delete(`/assignment/delete-assignment/${selectedAssignment.id}`);
                alert("Assignment deleted successfully");
                setIsDeleteOpen(false);
                setSelectedAssignment(null);
                loadAssignments();
             }
             catch(err){
                 console.log(err);
             }
    }

    const handleSearch=(e)=>{
          setSearch(e.target.value);
    }
    const filteredAssignments=assignments.filter(a=>a.title.toLowerCase().includes(search.toLocaleLowerCase()));
      return (
          <div className="p-8 space-y-8">
               <PageHeader
                     title={"Assignments"}
                     description={"Manage and view all university assignments"}
                     buttonText={"Create assignment"}
                     onButtonClick={handleAddClick}
                 
                 >
                     
                 </PageHeader>

                 <TableHeader title={"Assignments list"} description={"Manage all assignments"}>
                    <input
                                type="text"
                                placeholder="Search assignments..."
                                value={search}
                                onChange={handleSearch}
                                className="border border-slate-300 rounded-lg px-4 py-2"
                  />
                 <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Filter</button>

                 </TableHeader>

                  <DataTable columns={columns} data={filteredAssignments} onEdit={handleEdit} onDelete={handleDelete}>

                 </DataTable>
                  

            <ConfirmDeleteModal
                 isOpen={isDeleteOpen}
                 onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedAssignment(null);
                }}
                 onConfirm={confirmDelete}
                 title="Delete assignment"
                 message={`Are you sure you want to delete ${selectedAssignment?.title}?`}
             >
                  
             </ConfirmDeleteModal>


                {
             isOpen&&(
                 <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">{modal === "add" ? "Add an assignment" : "Edit assignment"}</h2>
                            <span className="font-light w-4 hover:cursor-pointer" onClick={() => setIsOpen(false)}>
                                X
                            </span>
                        </div>

                        <form onSubmit={modal==="add"?handleAddAssignment:handleEditAssignment} className="space-y-5">
                             <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assignment title</label>
                                 <input type="text" placeholder="Assignment title"
                                     required
                                     className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                     value={formData.title}
                                     onChange={(e)=>setFormData({...formData,title:e.target.value})}
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
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                 <input type="text" placeholder="Assignment description"
                                     required
                                     className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                     value={formData.description}
                                     onChange={(e)=>setFormData({...formData,description:e.target.value})}
                                 />
                            </div>

                             <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teacher id</label>
                                 <input type="text" placeholder="Assignment teacher id"
                                     required
                                     className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                     value={formData.teacher_id}
                                     onChange={(e)=>setFormData({...formData,teacher_id:e.target.value})}
                                 />
                            </div>

                             <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assignment deadline</label>
                                 <input type="text" placeholder="Assignment deadline"
                                     required
                                     className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                     value={formData.deadline}
                                     onChange={(e)=>setFormData({...formData,deadline:e.target.value})}
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
export default Assignments;