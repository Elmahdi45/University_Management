import { BookA, BookCopyIcon, User2,BookOpen,GraduationCap,ClipboardList,CalendarCheck, Heading1} from "lucide-react";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import api from "../../api/axios";
function DashboardS(){

    const [search,setSearch]=useState("");
    const [myGrades,setMyGrades]=useState([]);
    const [myModules,setModules]=useState([]);
    const [myAssignments,setMyAssignments]=useState([]);
      async function loadMyAssignments() {
    try {
        const response = await api.get("/assignment/me");

        setMyAssignments(response.data.assignments || []);
    } catch (err) {
        console.log(err.response || err);

        if (err.response?.status === 404) {
            setMyAssignments([]);
            return;
        }

        alert(
            err.response?.data?.message ||
            "Unable to load assignments."
        );

        setMyAssignments([]);
    }
}
    useEffect(() => {
        loadMyAssignments();
    }, []);

    async function loadMyGrades(){
         try{
             const response=await api.get('/grades/me');
             setMyGrades(response.data.grades);
         }
         catch(err){
                console.log(err);

                alert(
                    err.response?.data?.message || "Something went wrong"
                );   
         }
    }
    useEffect(()=>{
         loadMyGrades();
    },[]);

     async function loadMyModules(){
          try{
                 const response=await api.get('/module/my-modules');
                 setModules(response.data.modules); 
          }
          catch(err){
              console.log(err);
             
          }
    }
    useEffect(()=>{
         loadMyModules();
    },[])



const stats = [
  {
    title: "Enrolled Modules",
    value: myModules.length,
    icon: BookOpen,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    title: "Pending Assignments",
    value: myAssignments.length,
    icon: ClipboardList,
    bg: "bg-orange-100",
    color: "text-orange-600",
  },

  
];

const recentGrades = myGrades.slice(0, 4).map((g) => ({
    module: g.module_name,
    grade: g.grade,
}));

const recentModules = myModules.slice(0,4).map((m)=>({
      module:m.name,
      id:m.id
      
}))

const upcomingDeadlines = myAssignments
    .filter((assignment) => {
        if (!assignment.deadline) return false;

        const deadline = new Date(assignment.deadline);

        return !Number.isNaN(deadline.getTime()) && deadline > new Date();
    })
    .sort(
        (a, b) =>
            new Date(a.deadline) - new Date(b.deadline)
    )
    .slice(0, 3);
    
     return (
         <div className="p-8 space-y-8"> 
             <div> 
                 <h1 className="text-3xl font-bold">Hello,Elmahdi</h1>
             </div>
             <p className="mt-1 text-slate-500">
                Here's an overview of your academic activity 
             </p>


             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {
                        stats.map((stat)=>{
                             const Icon=stat.icon;

                             return(
                                <div key={stat.title} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 transition hover:shadow-md hover:-translate-y-1">
                                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                        <Icon size={24} className={stat.color} /> 
                                     </div>

                                     <div className="mt-6 text-3xl font-bold">
                                         <h2>{stat.value}</h2>
                                     </div>
                                    <p className="mt-1 text-slate-500">
                                        {stat.title}
                                    </p>
                                 

                                </div>
                             )
                        })
                    }


             </div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Recent Grades */}
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Recent Grades</h2>
        <p className="text-gray-500">Your latest grades</p>
      </div>

      <Link
        to="/my-grades"
        className="text-indigo-500 font-semibold hover:underline"
      >
        View All
      </Link>
    </div>

    <div className="mt-6 space-y-4">
      {recentGrades.map((g) => (
        <div
          key={g.module}
          className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-none"
        >
          <div>
            <p className="font-medium text-slate-800">
              {g.module}
            </p>
            <p className="text-sm text-slate-400">
              Recent grade
            </p>
          </div>

          <p
            className={`font-bold ${
              g.grade >= 10
                ? "text-emerald-600"
                : "text-red-500"
            }`}
          >
            {g.grade}/20
          </p>
        </div>
      ))}
    </div>
  </div>


  {/* My Modules */}
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">My Modules</h2>
        <p className="text-gray-500">Your current modules</p>
      </div>

      <Link
        to="/my-modules"
        className="text-indigo-500 font-semibold hover:underline"
      >
        View All
      </Link>
    </div>

    <div className="mt-6 space-y-6">
      {myModules.map((m) => (
        <div
          key={m.id}
          className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-none"
        >
          <h2>
            Module:{" "}
            <span className="font-bold">{m.name}</span>
          </h2>
        </div>
      ))}
    </div>
  </div>

  {/* Upcoming Deadlines */}
<div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">

  <div className="flex items-center justify-between">

    <div>
      <h2 className="text-2xl font-bold">
        Upcoming Deadlines
      </h2>

      <p className="text-gray-500">
        Assignments you need to complete
      </p>
    </div>

    <Link
      to="/assignments"
      className="text-indigo-500 font-semibold hover:underline"
    >
      View All
    </Link>

  </div>

<div className="mt-6 space-y-4">
    {upcomingDeadlines.length > 0 ? (
        upcomingDeadlines.map((assignment) => (
            <div
                key={assignment.id}
                className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-none"
            >
                <div>
                    <p className="font-medium text-slate-800">
                        {assignment.title}
                    </p>

                    <p className="text-sm text-slate-400">
                        {assignment.module_name}
                    </p>
                </div>

                <div className="text-right">
                    <p className="font-semibold text-orange-600">
                        {new Date(
                            assignment.deadline
                        ).toLocaleDateString()}
                    </p>

                    <p className="text-sm text-slate-400">
                        Deadline
                    </p>
                </div>
            </div>
        ))
    ) : (
        <p className="text-slate-500">
            No upcoming deadlines
        </p>
    )}
</div>
</div>


</div>
</div>
     )
}
export default DashboardS;