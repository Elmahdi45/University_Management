import { useState, useEffect } from "react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import TableHeader from "../../components/TableHeader";
import DataTable from "../../components/DataTable";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

function Students() {
  const [students, setStudents] = useState([]);

  const [student, setStudent] = useState({
    first_name: "",
    last_name: "",
    password: "",
    phone: "",
    gender: "",
    class_id: 0,
  });

  const [newStudent, setNewStudent] = useState({
    id: null,
    first_name: "",
    last_name: "",
    password: "",
    phone: "",
    gender: "",
    class_id: 0,
  });

const [isDeleteOpen, setIsDeleteOpen] = useState(false);
const [selectedStudent, setSelectedStudent] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState("add"); 
  const [search,setSearch]=useState("");



  const handleSearch=(e)=>{ 
        setSearch(e.target.value);
  }

const filteredStudents = students.filter((t) =>
  t.first_name.toLowerCase().includes(search.toLowerCase()) ||
  t.last_name.toLowerCase().includes(search.toLowerCase())
);

  const formData = modal === "add" ? student : newStudent;
  const setFormData = modal === "add" ? setStudent : setNewStudent;

  const columns = [
    { header: "First Name", accessor: "first_name" },
    { header: "Last Name", accessor: "last_name" },
    { header: "Email", accessor: "email" },
    { header: "Class", accessor: "class_name" },
    { header: "Gender", accessor: "gender" },
  ];

  async function loadStudents() {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAddClick = () => {
    setModal("add");
    setStudent({
      first_name: "",
      last_name: "",
      password: "",
      phone: "",
      gender: "",
      class_id: 0,
    });
    setIsOpen(true);
  };

  const handleEdit = (row) => {
    setModal("edit");
    setNewStudent({
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      password: "",
      phone: row.phone,
      gender: row.gender,
      class_id: row.class_id,
    });
    setIsOpen(true);
  };


const handleDelete = (student) => {
  setSelectedStudent(student);
  setIsDeleteOpen(true);
};

const confirmDelete = async () => {
  try {
    await api.delete(`/students/delete-student/${selectedStudent.id}`);

    alert("Student deleted successfully");

    setIsDeleteOpen(false);
    setSelectedStudent(null);

    loadStudents();

  } catch (err) {
    console.log(err.response);

    alert(
      err.response?.data?.message ||
      "Something went wrong"
    );
  }
};
  const handleAddStudent = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/students", student);

      alert(response.data.message);
      setIsOpen(false);
      loadStudents();
    } catch (err) {
      console.log(err.response);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...newStudent };
      if (!payload.password) delete payload.password;

      const response = await api.put(`/students/edit-student/${newStudent.id}`, payload);

      alert(response.data.message || "Student updated successfully");

      setIsOpen(false);
      loadStudents();
    } catch (err) {
      console.log(err.response);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Students"
        description="Manage all registered students."
        buttonText="Add Student"
        onButtonClick={handleAddClick}
      />

      <TableHeader title="Students List" description="View, edit and manage all students.">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={handleSearch}
          className="border border-slate-300 rounded-lg px-4 py-2"
        />

        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Filter</button>
      </TableHeader>

      <DataTable columns={columns} data={filteredStudents} onEdit={handleEdit} onDelete={handleDelete} />
       
      <ConfirmDeleteModal
    isOpen={isDeleteOpen}
    onClose={() => {
        setIsDeleteOpen(false);
        setSelectedStudent(null);
    }}
    onConfirm={confirmDelete}
    title="Delete student"
    message={`Are you sure you want to delete ${selectedStudent?.first_name} ${selectedStudent?.last_name}?`}
/>  

      {isOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{modal === "add" ? "Add a student" : "Edit student"}</h2>
              <span className="font-light w-4 hover:cursor-pointer" onClick={() => setIsOpen(false)}>
                X
              </span>
            </div>

            <form onSubmit={modal === "add" ? handleAddStudent : handleEditStudent} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Student first name</label>
                <input
                  type="text"
                  placeholder="example Elmahdi"
                  required
                  className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Student last name</label>
                <input
                  type="text"
                  placeholder="example khardi"
                  required
                  className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password {modal === "edit" && <span className="font-normal text-gray-400">(leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  placeholder="***********"
                  required={modal === "add"}
                  className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                <input
                  type="text"
                  placeholder="Eg.+212 78809807"
                  required
                  className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class</label>
                <input
                  type="text"
                  placeholder="EX.1"
                  required
                  className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                  value={formData.class_id}
                  onChange={(e) => setFormData({ ...formData, class_id: Number(e.target.value) })}
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
      )}
  
    </div>
  );
}

export default Students;