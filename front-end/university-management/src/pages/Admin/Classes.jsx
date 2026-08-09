import { useState,useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";
import api from "../../api/axios";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

function Classes(){ 
     
    const [classes,setClasses]=useState([]);
    const [clas,setClas]=useState({
          class_name:"",
          department_id:0
    });
    const [newClass,setNewClass]=useState({
          class_name:"",
          department_id:0
    });
    const [isOpen,setIsOpen]=useState(false);
    const [modal,setModal]=useState("add");
    const [isDeleteOpen,setIsDeleteOpen]=useState(false);
    const [selectedClass,setSelectedClass]=useState(null);

    const [search,setSearch]=useState("");
     const columns = [    
    { header:"Class id", accessor:"id"},
    { header: "Class Name", accessor: "class_name" },
    { header:"Department id",accessor:"department_id"}
   ]
    const formData=modal==="add"?clas:newClass;
    const setFormData=modal==="add"?setClas:setNewClass;

    async function loadClasses(){
          try{
             const response=await api.get('/class');
             setClasses(response.data);
          }
          catch(err){
             console.log(err);
          }
    }
    useEffect(()=>{
          loadClasses();
    },[])

    const handleAdd = () => {
        setModal("add");

        setClas({
         class_name: "",
         department_id:0
        });

        setIsOpen(true);
};

 const handleAddClass = async (e) => {
    e.preventDefault();
    try {
        const response = await api.post("/class", clas);
        alert(response.data.message || "Class created");
        setIsOpen(false);
        setClas({
            class_name: "",
            department_id:0
        });

        loadClasses();

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
           setNewClass({
              id:row.id,
              department_id: row.department_id,
              class_name:row.class_name
           })
           setIsOpen(true);
     }
        const handleEditClass=async(e)=>{
             e.preventDefault();
            try{
                const response=await api.put(`/class/edit-class/${newClass.id}`,newClass);
                alert(response.data.message || "Class updated successfully");
                setIsOpen(false);
                loadClasses();
            }
            catch(err){
                  console.log(err);
            }
     }
   const handleDelete=(classe)=>{
            setSelectedClass(classe);
            setIsDeleteOpen(true);
     }
    const confirmDelete= async()=>{        
            try{
                await api.delete(`/class/delete-class/${selectedClass.id}`); 
                alert("Class deleted successfully");
                setIsDeleteOpen(false);
                setSelectedClass(null);
                loadClasses();

            }
            catch(err){  
                 console.log(err);
            }
  }

    const handleSearch=(e)=>{
         setSearch(e.target.value);
    }
  const filteredClasses = classes.filter((c) =>
    c.class_name.toLowerCase().includes(search.toLowerCase())
);
   
      return (
         <div className="p-8 space-y-8">
             <PageHeader
                    title={"Classes"}  
                    description={"Manage all university classes"}
                    buttonText={"Add Class"}
                    onButtonClick={handleAdd}
                >         
                </PageHeader>

                <TableHeader
                   title="Classes List"
                   description={"View and manage university Classes"}
                  >
                     <input 
                       type="text" 
                       placeholder="Search Classes..."
                       className="border border-slate-300 rounded-lg px-4 py-2"
                       value={search}
                       onChange={handleSearch}
                       />
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Filter</button>

                </TableHeader>

                 <DataTable
                    columns={columns}
                    data={filteredClasses}
                     onEdit={handleEdit}
                    onDelete={handleDelete}
                    >          
                  </DataTable>   




            <ConfirmDeleteModal
                 isOpen={isDeleteOpen}
                 onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedClass(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Class"
                 message={`Are you sure you want to Class${selectedClass?.class_name}?`}
             >
                  
             </ConfirmDeleteModal>
                      {
             isOpen&&(
                 <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">{modal === "add" ? "Add a Class" : "Edit CLass"}</h2>
                            <span className="font-light w-4 hover:cursor-pointer" onClick={() => setIsOpen(false)}>
                                X
                            </span>
                        </div>

                        <form onSubmit={modal==="add"?handleAddClass:handleEditClass} className="space-y-5">
                             <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class name</label>
                                 <input type="text" placeholder="example 4APG"
                                     required
                                     className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                     value={formData.class_name}
                                     onChange={(e)=>setFormData({...formData,class_name:e.target.value})}
                                 />
                             </div>

                            <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department id</label>
                                        <input
                                        type="number"
                                        placeholder="Department id"
                                        required
                                        className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                        value={formData.department_id}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                department_id: Number(e.target.value)
                                            })
                                        }
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
export default Classes;