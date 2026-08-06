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
 const [isOpen,setIsOpen]=useState(false);



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

     const recentEnrollments = [
  {
    id: 1,
    student: "Ahmed Benali",
    class: "GI-3A",
    date: "Today",
  },
  {
    id: 2,
    student: "Sara Idrissi",
    class: "GI-2B",
    date: "Yesterday",
  },
  {
    id: 3,
    student: "Youssef Amrani",
    class: "GI-1A",
    date: "2 days ago",
  },
];
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
      value: 246,
      icon: Users2,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Departments",
      value: 12,
      icon: Building2,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      title: "Total Classes",
      value: 86,
      icon: BookOpen,
      bg: "bg-orange-100",
      color: "text-orange-600",
    },
    {
      title: "Total Modules",
      value: 134,
      icon: ClipboardList,
      bg: "bg-cyan-100",
      color: "text-cyan-600",
    },
    {
      title: "Active Assignments",
      value: 39,
      icon: FileText,
      bg: "bg-pink-100",
      color: "text-pink-600",
    },
  ];

  return (
    <div className="p-8 space-y-8">

      {/* Welcome */}

      <div>
        <h1 className="text-3xl font-bold">
          Good afternoon, {user?.first_name}
        </h1>

        <p className="mt-1 text-slate-500">
          Here's what's happening across the university today.
        </p>
      </div>

      {/* Statistics */}

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
                    onClick={() => setIsOpen(true)} 
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

            <button className="text-indigo-600 hover:underline">
                View All
            </button>

        </div>

        <div className="mt-6 space-y-5">

            {recentEnrollments.map((enrollment) => (

                <div
                    key={enrollment.id}
                    className="flex justify-between items-center border-b border-slate-100 pb-4 last:border-none"
                >

                    <div>

                        <h3 className="font-semibold">
                            {enrollment.student}
                        </h3>

                        <p className="text-sm text-slate-500">
                            {enrollment.class}
                        </p>

                    </div>

                    <span className="text-sm text-slate-500">
                        {enrollment.date}
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
                             <h2 className="text-xl font-bold">Add a student</h2>
                             <span className="font-light w-4 hover:cursor-pointer" onClick={()=>setIsOpen(false)}>X</span>
                        </div>

                        <form onSubmit={handleAddStudent} className="space-y-5">
                            <div>
                                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">Student first name</label>
                                 <input
                                    type="text"
                                    placeholder="example Elmahdi"
                                    required
                                    className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                    value={student.first_name}
                                    onChange={(e) => setStudent({ ...student, first_name: e.target.value })}
                                />
                            </div>

                            <div>
                                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">Student last name</label>
                                 <input
                                    type="text"
                                    placeholder="example khardi"
                                    required
                                    className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                    value={student.last_name}
                                    onChange={(e) => setStudent({ ...student, last_name: e.target.value })}
                                />
                            </div>

                             <div>
                                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                                 <input
                                    type="password"
                                    placeholder="***********"
                                    required
                                    className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                    value={student.password}
                                    onChange={(e) => setStudent({ ...student, password: e.target.value })}
                                />
                            </div>

                             <div>
                                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                                 <input
                                    type="text"
                                    placeholder="Eg.+212 78809807"
                                    required
                                    className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                    value={student.phone}
                                    onChange={(e) => setStudent({ ...student, phone: e.target.value })}
                                />
                            </div>

                             <div>
                                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class</label>
                                 <input
                                    type="text"
                                    placeholder="EX.1"
                                    required
                                    className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-indigo-500 outline-none transition-all"
                                    value={student.class_id}
                                    onChange={(e) => setStudent({ ...student, class_id: Number(e.target.value )})}
                                />
                            </div>

                             <div>
                                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
                                 <select name="gender" className="w-full border border-gray-300 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                     value={student.gender}
                                     onChange={(e) => setStudent({ ...student, gender: e.target.value })}>
                                     <option value="male">Male</option>
                                     <option value="female">Female</option>
                                 </select>
                            </div>


                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setStudent({ first_name: "", last_name: "", password: "", phone: "" , gender:"" , class_id:0});
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