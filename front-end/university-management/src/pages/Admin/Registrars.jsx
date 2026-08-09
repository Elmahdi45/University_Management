import { useState,useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";
import api from "../../api/axios";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";


function Registrars(){
    const [registrars,setRegistrars]=useState([]);
    const [registrar,setRegistrar]=useState({
          first_name:"",
        last_name:"",
        password:"",
        phone:"",
        gender:"",
    })
    const [newRegistrar,setNewRegistrar]=useState({
           first_name:"",
        last_name:"",
        password:"",
        phone:"",
        gender:"",
    })
    const [selectedRegistrar,setSelectedRegistrar]=useState(null);
    const [modal,setModal]=useState("add");
    const [search,setSearch]=useState("");
    const [isOpen,setIsOpen]=useState(false);
    const [isDeleteOpen,setIsDeleteOpen]=useState(false);

    const columns = [
    { header: "First Name", accessor: "first_name" },
    { header: "Last Name", accessor: "last_name" },
    { header: "Email", accessor: "email" },
    { header: "Department", accessor: "department_name" },
    { header: "Gender", accessor: "gender" },
  ];
  const filteredRegistrars = registrars.filter((r) =>
  r.first_name.toLowerCase().includes(search.toLowerCase()) ||
  r.last_name.toLowerCase().includes(search.toLowerCase())
);


  const formData=modal==="add"?registrar:newRegistrar;
  const setFormData= modal==="add"?setRegistrar:setNewRegistrar;

    async function loadRegistrars(){
          try{
              const response=await api.get('/registrar');
              setRegistrars(response.data);
          }
          catch(err){
             console.log(err);
          }
    }
    useEffect(()=>{
        loadRegistrars();    
    },[])
    const handleSearch=(e)=>{
         setSearch(e.target.value);
    }
    const handleAdd=()=>{
        setModal("add");
        setIsOpen(true);
    }
    const handleAddRegistrar=async (e)=>{
          e.preventDefault();
          try{
              const response=await api.post('/registrar',registrar);
              alert(response.data.message || "Registrar account created!");
              setIsOpen(false);
              loadRegistrars();
          }
          catch(err){
             console.log(err);
          }
    }
    const handleEditRegistrar= async(e)=>{
        const payload={...newRegistrar};
        if(!payload.password){
             delete payload.password;
        }
         e.preventDefault();
         try{
             const response=await api.put(`/registrar/edit-registrar/${newRegistrar.id}`,payload);
             alert(response.data.message || "Registrar updated successfully");
             setIsOpen(false);
             loadRegistrars();
         }
         catch(err){
             console.log(err);
         }

    }
    const handleEdit=(row)=>{
         setModal("edit");
            setNewRegistrar({
            id: row.id,
            first_name: row.first_name,
            last_name: row.last_name,
            password: "",
            phone: row.phone,
            gender: row.gender,

       })
       setIsOpen(true);
    }
    const handleDelete=(registrar)=>{
            setSelectedRegistrar(registrar);
            setIsDeleteOpen(true);
    }
     const confirmDelete= async()=>{
            try{
                await api.delete(`/registrar/delete/${selectedRegistrar.id}`); 
                alert("Registrar deleted successfully");
                setIsDeleteOpen(false);
                setSelectedTeacher(null);
                loadRegistrars();

            }
            catch(err){  
                 console.log(err);
            }
  }

    
        return (
             <div className="p-8 space-y-8">
                  <PageHeader 
                   title={"Registrars"}
                   description={"View and manage university registrars"}
                   buttonText={"Add Registrar"}
                   onButtonClick={handleAdd}
                  ></PageHeader>

                  <TableHeader
                   title="Registrars List"
                   description={"View and manage university registrars"}
                  >
                     <input 
                       type="text" 
                       placeholder="Search Registrars..."
                       className="border border-slate-300 rounded-lg px-4 py-2"
                       value={search}
                       onChange={handleSearch}
                       />
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Filter</button>

                  </TableHeader>

                  <DataTable
                    columns={columns}
                    data={filteredRegistrars}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    >
                      
                  </DataTable>
                    <ConfirmDeleteModal
                 isOpen={isDeleteOpen}
                 onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedStudent(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Teacher"
                 message={`Are you sure you want to delete ${selectedRegistrar?.first_name} ${selectedRegistrar?.last_name}?`}
             >
                  
             </ConfirmDeleteModal>


                  {
             isOpen&&(
                 <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">{modal === "add" ? "Add a Registrar" : "Edit Registrar"}</h2>
                            <span className="font-light w-4 hover:cursor-pointer" onClick={() => setIsOpen(false)}>
                                X
                            </span>
                        </div>

                        <form onSubmit={modal==="add"?handleAddRegistrar:handleEditRegistrar} className="space-y-5">
                             <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registrar first name</label>
                                 <input type="text" placeholder="example Elmahdi"
                                     required
                                     className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                     value={formData.first_name}
                                     onChange={(e)=>setFormData({...formData,first_name:e.target.value})}
                                 />
                             </div>

                             <div>
                                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registrar last name</label>
                                 <input type="text" placeholder="example Khardi" 
                                    required
                                    className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                    value={formData.last_name}
                                    onChange={(e)=>setFormData({...formData,last_name:e.target.value})}
                                 />
                             </div>

                             <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Password {modal === "edit" && <span className="font-normal text-gray-400">(leave blank to keep current)</span>}
                                  </label>
                                  <input type="password" placeholder="********" 
                                     className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                     required={modal==="add"}
                                     value={formData.password}
                                     onChange={(e)=>setFormData({...formData,password:e.target.value})}
                                   />      
                             </div>

                             <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                                <input type="text"
                                  placeholder="ex. 0607773888"
                                  className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                  required
                                  value={formData.phone}    
                                  onChange={(e)=>setFormData({...formData,phone:e.target.value})}
                                />
                             </div>

                               <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
                                    <select
                                    required
                                    className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    </select>
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
export default Registrars;