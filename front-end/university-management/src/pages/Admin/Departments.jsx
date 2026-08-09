import { useState,useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";
import api from "../../api/axios";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";




function Departments(){
    const [departments,setDepartments]=useState([]);
    const [search,setSearch]=useState("");
    const [isOpen,setIsOpen]=useState(false);
    const [modal,setModal]=useState("add");
    const [department,setDepartment]=useState({
          name:""
    })
    const [newDepartment,setNewDepartment]=useState({
          name:""
    })
    
    const [isDeleteOpen,setIsDeleteOpen]=useState(false);
    const formData=modal==="add"?department:newDepartment;
    const setFormData=modal==="add"?setDepartment:setNewDepartment;
    const [selectedDepartment,setSelectedDepartment]=useState(null);

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

    const handleAdd = () => {
        setModal("add");

        setDepartment({
         name: ""
        });

        setIsOpen(true);
};
    const handleAddDepartment = async (e) => {
    e.preventDefault();

    try {
        const response = await api.post("/department", department);

        alert(response.data.message || "Department created");

        setIsOpen(false);

        setDepartment({
            name: ""
        });

        loadDepartments();

    } catch (err) {
        console.log(err);
        alert(
            err.response?.data?.message ||
            "Something went wrong"
        );
    }
};
     const handleEdit=(row)=>{
           setModal("edit");
           setNewDepartment({
              id: row.id,
              name:row.name
           })
           setIsOpen(true);
     }

     const handleEditDepartment=async(e)=>{
             e.preventDefault();
            try{
                const response=await api.put(`/department/edit-department/${newDepartment.id}`,newDepartment);
                alert(response.data.message || "Department updated successfully");
                setIsOpen(false);
                loadDepartments();
            }
            catch(err){
                  console.log(err);
            }
     }
     const handleDelete=(department)=>{
            setSelectedDepartment(department);
            setIsDeleteOpen(true);
     }
    const confirmDelete= async()=>{
            
            try{
                await api.delete(`/department/delete-department/${selectedDepartment.id}`); 
                alert("Department deleted successfully");
                setIsDeleteOpen(false);
                setSelectedDepartment(null);
                loadDepartments();

            }
            catch(err){  
                 console.log(err);
            }
  }

     const handleSearch=(e)=>{
           setSearch(e.target.value);
     }

    const filteredDepartments = departments.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) 
    );
   

    

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
                       value={search}
                       onChange={handleSearch}
                       />
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Filter</button>

                </TableHeader>

                  <DataTable
                    columns={columns}
                    data={filteredDepartments}
                     onEdit={handleEdit}
                    onDelete={handleDelete}
                    >          
                  </DataTable>



            <ConfirmDeleteModal
                 isOpen={isDeleteOpen}
                 onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedDepartment(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Department"
                 message={`Are you sure you want to delete ${selectedDepartment?.name}?`}
             >
                  
             </ConfirmDeleteModal>


                      {
             isOpen&&(
                 <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">{modal === "add" ? "Add a Department" : "Edit Department"}</h2>
                            <span className="font-light w-4 hover:cursor-pointer" onClick={() => setIsOpen(false)}>
                                X
                            </span>
                        </div>

                        <form onSubmit={modal==="add"?handleAddDepartment:handleEditDepartment} className="space-y-5">
                             <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department name</label>
                                 <input type="text" placeholder="example Elmahdi"
                                     required
                                     className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                     value={formData.name}
                                     onChange={(e)=>setFormData({...formData,name:e.target.value})}
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
export default Departments;