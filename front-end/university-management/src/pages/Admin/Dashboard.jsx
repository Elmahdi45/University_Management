import {
  GraduationCap,
  Users2,
  Building2,
  BookOpen,
  ClipboardList,
  FileText,
} from "lucide-react";
import { useState,useEffect } from "react";
import api from "../../api/axios";
import {Link } from "react-router-dom";
function Dashboard() {
 const [classes,setClasses]=useState([]);
 const [user, setUser] = useState([]);
 const [students,setStudents]=useState([]);
 const [student,setStudent]=useState({
       first_name:"",
       last_name:"",
       password:"",
       phone:"",
       gender:"",
       class_id:0,
 });
 const [newStudent,setNewStudent]=useState({
       first_name:"",
       last_name:"",
       password:"",
       phone:"",
       gender:"",
       class_id:0, 
 })
 const [enrollments,setEnrollments]=useState([]);
 const [modal,setModal]=useState("teacher");    
 const [teachers,setTeachers]=useState([]);
 const [teacher,setTeacher]=useState({
        first_name:"",
        last_name:"",
        password:"",
        phone:"",
        gender:"",
        department_id:0
 })

 const [modules,setModules]=useState([]);
 const [module,setModule]=useState({
       name:"",
       coefficient:0,
       semester:""
 })
 const [assignments,setAssignments]=useState([]);
 const [departments,setDepartments]=useState([]);
 const [department,setDepartment]=useState({
      name:""
 });
 
 const [isOpen,setIsOpen]=useState(false);
 const formData =
    modal === "teacher"
        ? teacher
        : modal === "student"
        ? student
        : modal === "department"
        ? department
        : module;

const setFormData =
    modal === "teacher"
        ? setTeacher
        : modal === "student"
        ? setStudent
        : modal === "department"
        ? setDepartment
        : setModule;



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

async function loadDepartments(){
      try{
          const response=await api.get('/department');
          setDepartments(response.data);
          
      }
      catch(err){
          console.log(err);
      }
}

useEffect(()=>{
    loadDepartments();  
},[])

async function loadTeachers(){
       try{
          const response=await api.get('/teacher',teachers);
          setTeachers(response.data);
       }
       catch(err){
          console.log(err);
       }
}

useEffect(()=>{ 
     loadTeachers();  
},[])

async function loadStudents(){
     try{
         const response=await api.get("/students");
         setStudents(response.data);
     }
     catch(err){
         console.log(err);
     }
}
useEffect(()=>{
      loadStudents();
},[]);

async function loadUser() {
    try {
        const response = await api.get("/admins/me");
        setUser(response.data.admin);

    } catch (err) {
        console.log(err);
    }
}

useEffect(() => {
    loadUser();
}, []);


const handleAddTeacher=async(e)=>{   
       e.preventDefault();
       try{
            const response = await api.post('/teacher',teacher);
            alert(response.data.message);

            setIsOpen(false);
            loadTeachers();
       }
       catch(err){
          console.log(err.response);

        alert(
            err.response?.data?.message ||
            "Something went wrong"
        );
       }
         
}

const handleAddStudent = async (e) => {
    e.preventDefault();

    try {
        const response = await api.post("/students", student);

        alert(response.data.message);

        setIsOpen(false);
        loadStudents();

    } catch (err) {
        console.log(err.response);

        alert(
            err.response?.data?.message ||
            "Something went wrong"
        );
    }
};

const handleAddDepartment=async (e)=>{
        e.preventDefault();
        try{
             const response=await api.post('/department',department);
             alert(response.data.message || "Department added");
             setIsOpen(false);
             setDepartment({
                 name: ""
            });
            loadDepartments();
        }
        catch(err){
            console.log(err);
        }
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


const handleClick = (action) => {
    const modalType = {
        "Add Teacher": "teacher",
        "Add Student": "student",
        "Add Department": "department",
        "Add Module": "module",
    };

    setModal(modalType[action]);
    setIsOpen(true);
};


const upcomingDeadlines = [
  {
    id: 1,
    assignment: "Java Project",
    module: "Java",
    deadline: "Aug 8",
  },
  {
    id: 2,
    assignment: "Database Design",
    module: "PostgreSQL",
    deadline: "Aug 10",
  },
  {
    id: 3,
    assignment: "Linux Lab",
    module: "Operating Systems",
    deadline: "Aug 12",
  },
];

const recentEnrollments = enrollments.slice(0, 3).map((enrollment) => ({
    id: enrollment.id,
    student: `${enrollment.student_first_name} ${enrollment.student_last_name}`,
    created_by: enrollment.created_by_last_name,
    created_at:enrollment.created_at
}));

const recentSubmissions = [
  {
    id: 1,
    student: "Ahmed Benali",
    assignment: "Java OOP Project",
    grade: null,
  },
  {
    id: 2,
    student: "Sara Idrissi",
    assignment: "Database Design",
    grade: 18,
  },
  {
    id: 3,
    student: "Youssef Amrani",
    assignment: "Operating Systems",
    grade: 15,
  },
];

     const recentAssignments = [
  {
    id: 1,
    title: "Java OOP Project",
    module: "Java",
    deadline: "Aug 10",
  },
  {
    id: 2,
    title: "Operating Systems Lab",
    module: "OS",
    deadline: "Aug 12",
  },
  {
    id: 3,
    title: "Database Design",
    module: "PostgreSQL",
    deadline: "Aug 15",
  },
];

 const quickActions = [
  {
    title: "Add Student",
    description: "Register a new student",
    color: "bg-indigo-100",
    text: "text-indigo-600",
    icon: GraduationCap,
  },
  {
    title: "Add Teacher",
    description: "Create a teacher account",
    color: "bg-green-100",
    text: "text-green-600",
    icon: Users2,
  },
  {
    title: "Add Department",
    description: "Create a department",
    color: "bg-purple-100",
    text: "text-purple-600",
    icon: Building2,
  },
  {
    title: "Add Module",
    description: "Create a module",
    color: "bg-orange-100",
    text: "text-orange-600",
    icon: BookOpen,
  },
];
  const stats = [
    {
      title: "Total Students",
      value: students.length,
      icon: GraduationCap,
      bg: "bg-indigo-100",
      color: "text-indigo-600",
    },
    {
      title: "Total Teachers",
      value: teachers.length,
      icon: Users2,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Departments",
      value: departments.length,
      icon: Building2,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      title: "Total Classes",
      value: classes.length,
      icon: BookOpen,
      bg: "bg-orange-100",
      color: "text-orange-600",
    },
    {
      title: "Total Modules",
      value: modules.length,
      icon: ClipboardList,
      bg: "bg-cyan-100",
      color: "text-cyan-600",
    },
    {
      title: "Active Assignments",
      value: assignments.length,
      icon: FileText,
      bg: "bg-pink-100",
      color: "text-pink-600",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Hello, {user?.first_name}
        </h1>

        <p className="mt-1 text-slate-500">
          Here's what's happening across the university today.
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 transition hover:shadow-md hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}
              >
                <Icon size={24} className={stat.color} />
              </div>

              <h2 className="mt-6 text-3xl font-bold">
                {stat.value}
              </h2>

              <p className="mt-1 text-slate-500">
                {stat.title}
              </p>
            </div>
          );
        })}

      </div>


      {/* Quick Actions */}

<div className="space-y-5">

    <div>
        <h2 className="text-2xl font-bold">
            Quick Actions
        </h2>

        <p className="text-slate-500 mt-1">
            Frequently used administrative actions.
        </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {quickActions.map((action) => {

            const Icon = action.icon;

            return (

                <button
                    key={action.title}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-left transition hover:shadow-md hover:-translate-y-1"
                    onClick={()=>handleClick(action.title)} 
                >

                    <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}
                    >
                        <Icon
                            size={24}
                            className={action.text}
                        />
                    </div>

                    <h3 className="mt-5 text-xl font-semibold">
                        {action.title}
                    </h3>

                    <p className="mt-1 text-slate-500">
                        {action.description}
                    </p>

                </button>

            );

        })}

    </div>

    {/* Recent Students */}

<div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

    <div className="flex justify-between items-center">

        <div>
            <h2 className="text-2xl font-bold">
                Recent Students
            </h2>

            <p className="text-slate-500 mt-1">
                Latest registered students.
            </p>
        </div>

        <button className="text-indigo-600 font-medium hover:underline">
           <Link to="/students">View All</Link> 
        </button>

    </div>

    <div className="mt-8 space-y-5">

        {students.slice(0,9).map((student) => (

            <div
                key={student.id}
                className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-none"
            >

                <div className="flex items-center gap-4">

                    <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">

                        {student.first_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}

                    </div>

                    <div>

                        <h3 className="font-semibold">
                            {student.last_name}
                        </h3>

                        <p className="text-sm text-slate-500">
                            {student.email}
                        </p>

                    </div>

                </div>

                <div className="text-right">

                    <p className="font-medium">
                        {student.class_name}
                    </p>

                
                </div>

            </div>

        ))}

    </div>

    {/* Bottom Cards */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

    {/* Recent Assignments */}

    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

        <div className="flex justify-between items-center">

            <div>

                <h2 className="text-xl font-bold">
                    Recent Assignments
                </h2>

                <p className="text-slate-500 mt-1">
                    Latest created assignments.
                </p>

            </div>

            <button className="text-indigo-600 hover:underline">
                View All
            </button>

        </div>

        <div className="mt-6 space-y-5">

            {recentAssignments.map((assignment) => (

                <div
                    key={assignment.id}
                    className="flex justify-between items-center border-b border-slate-100 pb-4 last:border-none"
                >

                    <div>

                        <h3 className="font-semibold">
                            {assignment.title}
                        </h3>

                        <p className="text-sm text-slate-500">
                            {assignment.module}
                        </p>

                    </div>

                    <span className="text-sm text-slate-500">
                        {assignment.deadline}
                    </span>

                </div>

            ))}

        </div>

    </div>

    {/* Recent Submissions */}

    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

        <div className="flex justify-between items-center">

            <div>

                <h2 className="text-xl font-bold">
                    Recent Submissions
                </h2>

                <p className="text-slate-500 mt-1">
                    Latest student submissions.
                </p>

            </div>

            <button className="text-indigo-600 hover:underline">
                View All
            </button>

        </div>

        <div className="mt-6 space-y-5">

            {recentSubmissions.map((submission) => (

                <div
                    key={submission.id}
                    className="flex justify-between items-center border-b border-slate-100 pb-4 last:border-none"
                >

                    <div>

                        <h3 className="font-semibold">
                            {submission.student}
                        </h3>

                        <p className="text-sm text-slate-500">
                            {submission.assignment}
                        </p>

                    </div>

                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                            submission.grade === null
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                        }`}
                    >
                        {submission.grade === null
                            ? "Pending"
                            : `${submission.grade}/20`}
                    </span>

                </div>

            ))}

        </div>
        

    </div>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

    {/* Latest Enrollments */}

    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

        <div className="flex justify-between items-center">

            <div>

                <h2 className="text-xl font-bold">
                    Latest Enrollments
                </h2>

                <p className="text-slate-500 mt-1">
                    Recently enrolled students.
                </p>

            </div>

            <Link to="/enrollments"><button className="text-indigo-600 hover:underline">
                View All
            </button></Link>

        </div>

        <div className="mt-6 space-y-5">

            {recentEnrollments.map((enrollment) => (

                <div
                        key={enrollment.id}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-slate-100 pb-4 last:border-none"
                    >
                        <div className="min-w-0">
                            <h3 className="font-semibold truncate">
                                {enrollment.student}
                            </h3>

                            <p className="text-sm text-slate-500 truncate">
                                {enrollment.created_at}
                            </p>
                        </div>

                        <span className="text-sm text-slate-500 shrink-0">
                            {enrollment.created_by}
                        </span>
                    </div>

            ))}

        </div>

    </div>

    {/* Upcoming Deadlines */}

    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

        <div className="flex justify-between items-center">

            <div>

                <h2 className="text-xl font-bold">
                    Upcoming Deadlines
                </h2>

                <p className="text-slate-500 mt-1">
                    Assignments due soon.
                </p>

            </div>

            <button className="text-indigo-600 hover:underline">
                View All
            </button>

        </div>

        <div className="mt-6 space-y-5">

            {upcomingDeadlines.map((deadline) => (

                <div
                    key={deadline.id}
                    className="flex justify-between items-center border-b border-slate-100 pb-4 last:border-none"
                >

                    <div>

                        <h3 className="font-semibold">
                            {deadline.assignment}
                        </h3>

                        <p className="text-sm text-slate-500">
                            {deadline.module}
                        </p>

                    </div>

                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium">
                        {deadline.deadline}
                    </span>

                </div>

            ))}

        </div>

    </div>

</div>

</div>
    
    

</div>

</div>


      {isOpen && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                               <h2 className="text-xl font-bold">
                                    {modal === "teacher"
                                        ? "Add Teacher"
                                        : modal === "student"
                                        ? "Add Student"
                                        : modal === "department"
                                        ? "Add Department"
                                        : "Add Module"}
                                </h2>
                             <span className="font-light w-4 hover:cursor-pointer" onClick={()=>setIsOpen(false)}>X</span>
                        </div>

                        <form onSubmit={modal === "teacher" ? handleAddTeacher : modal==="student"?handleAddStudent: modal==="department"?handleAddDepartment:handleAddModule}
                            className="space-y-5">
                            {modal === "department" && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Department Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Example Computer Science"
                                        required
                                        className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setDepartment({
                                                ...formData,
                                                name: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            )}

                            {modal === "module" && (
                              
                                <div>
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Module Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Example Computer Science"
                                        required
                                        className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl"
                                        value={formData.name}
                                        onChange={(e) =>
                                        setFormData({
                                                ...formData,
                                                name: e.target.value
                                            })
                                        }
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Module Coefficient
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Module coefficient"
                                        required
                                        className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl"
                                        value={formData.coefficient}
                                        onChange={(e) =>
                                        setFormData({
                                                ...formData,
                                                coefficient: e.target.value
                                            })
                                        }
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Module semester
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Module semester"
                                        required
                                        className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl"
                                        value={formData.semester}
                                        onChange={(e) =>
                                        setFormData({
                                                ...formData,
                                                semester: e.target.value
                                            })
                                        }
                                    />
                                  </div>
                                </div>
                                

                                
                            )}
                 {(modal === "teacher" || modal === "student") && (
    <>
        {/* First name */}
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                First name
            </label>

            <input
                type="text"
                placeholder="Your first name"
                required
                value={formData.first_name}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        first_name: e.target.value
                    })
                }
                className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl"
            />
        </div>

        {/* Last name */}
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Last name
            </label>

            <input
                type="text"
                placeholder="Your last name"
                required
                value={formData.last_name}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        last_name: e.target.value
                    })
                }
                className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl"
            />
        </div>

        {/* Password */}
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
            </label>

            <input
                type="password"
                placeholder="Your password"
                required
                value={formData.password}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        password: e.target.value
                    })
                }
                className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl"
            />
        </div>

        {/* Phone */}
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone
            </label>

            <input
                type="text"
                placeholder="Your phone number"
                required
                value={formData.phone}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        phone: e.target.value
                    })
                }
                className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl"
            />
        </div>

        {/* Department/Class */}
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {modal === "teacher" ? "Department ID" : "Class ID"}
            </label>

            <input
                type="number"
                required
                value={
                    modal === "teacher"
                        ? formData.department_id
                        : formData.class_id
                }
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        [modal === "teacher"
                            ? "department_id"
                            : "class_id"]: Number(e.target.value)
                    })
                }
                className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl"
            />
        </div>

        {/* Gender */}
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Gender
            </label>

            <select
                required
                value={formData.gender}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        gender: e.target.value
                    })
                }
                className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl"
            >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
        </div>
    </>
)}


             <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setFormData({ first_name: "", last_name: "", password: "", phone: "" , gender:"" ,  [modal === "teacher" ? "department_id" : "class_id"]:0});
                    }}
                    className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-sm hover:shadow transition-all active:scale-95"
                  >
                    Add
                  </button>
                </div>
                        </form>
                </div>
               
          </div>
      )}

    </div>
  );
}

export default Dashboard;