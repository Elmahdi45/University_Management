import { useState, useEffect } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";



function Modules(){
  const [search,setSearch]=useState("");
  const [modules,setModules]=useState([]);
  const [modal,setModal]=useState("add");
  const [isOpen,setIsOpen]=useState(false);
  const [isDeleteOpen,setIsDeleteOpen]=useState(false);
  const [selectedModule,setSelectedModule]=useState(null);
  const [module,setModule]=useState({
       name:"",
       coefficient:0,
       semester:""
  })
  const [newModule,setNewModule]=useState({
       name:"",
       coefficient:0,
       semester:""
  })

    const formData=modal==="add"?module:newModule;
    const setFormData=modal==="add"?setModule:setNewModule;

   const columns = [    
    { header:"Module id",accessor:"id"},
    { header: "Module Name", accessor: "name" },
    {header:"Module semester" ,accessor:"semester"},
    {header:"Module coefficient" ,accessor:"coefficient"},

   ]

    async function loadModules(){
          try{
               const response=await api.get('/module');
               setModules(response.data);
          }
          catch(err){
             console.log(err);
          }
    }
    useEffect(()=>{
         loadModules();
    },[])


   
    const handleAddClick=()=>{
          setModal("add");
          setModule({
            name: "",
            semester:"",
            coefficient:0,

           });
          setIsOpen(true);
    }

  const handleAddModule=async(e)=>{
         e.preventDefault();
         try{
             const response=await api.post('/module',module);
             alert(response.data.message ||"Module created!");
             setModule({
                 name:"",
                 semester:"",
                 coefficient:0
             })
             setIsOpen(false);
             loadModules();
             
         }
         catch(err){
             console.log(err);
         }
    }

    const handleEdit=(row)=>{ 
         setModal("edit");
         setNewModule({
              id:row.id,
              coefficient:row.coefficient,
              name:row.name,
              semester:row.semester
         })
         setIsOpen(true);   
    }
    const handleEditModule=async(e)=>{
         e.preventDefault();
         try{    
             const response=await api.put(`/module/edit-module/${newModule.id}`,newModule);
             alert(response.data.message || "Module updated!");
             setIsOpen(false);
             loadModules();
         }  
         catch(err){
              console.log(err);
         }
    }
    const handleDelete=(module)=>{
          setSelectedModule(module);
          setIsDeleteOpen(true);
    }
    const confirmDelete= async()=>{
           try{
                await api.delete(`/module/delete-module/${selectedModule.id}`); 
                alert("Module deleted successfully");
                setIsDeleteOpen(false);
                setSelectedModule(null);
                loadModules();

            }
            catch(err){  
                 console.log(err);
            }
    }

    const handleSearch=(e)=>{
         setSearch(e.target.value);
    }
     const filteredModules= modules.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) 
    );
    return (     
          <div className="p-8 space-y-8">
                 <PageHeader
                     title={"Modules"}
                     description={"Manage and view all university modules"}
                     buttonText={"Add module"}
                     onButtonClick={handleAddClick}
                 
                 >
                     
                 </PageHeader>


                 <TableHeader title={"Modules list"} description={"Manage all modules"}>
                    <input
                                type="text"
                                placeholder="Search modules..."
                                value={search}
                                onChange={handleSearch}
                                className="border border-slate-300 rounded-lg px-4 py-2"
                  />
                 <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Filter</button>

                 </TableHeader>

                 <DataTable columns={columns} data={filteredModules} onEdit={handleEdit} onDelete={handleDelete}>

                 </DataTable>


            <ConfirmDeleteModal
                 isOpen={isDeleteOpen}
                 onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedModule(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Module"
                 message={`Are you sure you want to delete ${selectedModule?.name}?`}
             >
                  
             </ConfirmDeleteModal>




         {
             isOpen&&(
                 <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">{modal === "add" ? "Add a Module" : "Edit Module"}</h2>
                            <span className="font-light w-4 hover:cursor-pointer" onClick={() => setIsOpen(false)}>
                                X
                            </span>
                        </div>

                        <form onSubmit={modal==="add"?handleAddModule:handleEditModule} className="space-y-5">
                             <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Module name</label>
                                 <input type="text" placeholder="example Physics"
                                     required
                                     className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                     value={formData.name}
                                     onChange={(e)=>setFormData({...formData,name:e.target.value})}
                                 />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Module Coefficient</label>
                                 <input type="text" placeholder="Coefficient"
                                     required
                                     className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                     value={formData.coefficient}
                                     onChange={(e)=>setFormData({...formData,coefficient:e.target.value})}
                                 />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Module semester</label>
                                 <input type="text" placeholder="Module semester"
                                     required
                                     className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                     value={formData.semester}
                                     onChange={(e)=>setFormData({...formData,semester:e.target.value})}
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
export default Modules;