import { BookA, BookCopyIcon, User2,BookOpen,GraduationCap,ClipboardList,CalendarCheck, Heading1} from "lucide-react";
import { Link } from "react-router-dom";
function DashboardS(){

const stats = [
  {
    title: "Enrolled Modules",
    value: 4,
    icon: BookOpen,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },

  {
    title: "Current Average",
    value: "14.8",
    icon: GraduationCap,
    bg: "bg-emerald-100",
    color: "text-emerald-600",
  },

  {
    title: "Pending Assignments",
    value: 3,
    icon: ClipboardList,
    bg: "bg-orange-100",
    color: "text-orange-600",
  },

  {
    title: "Attendance Rate",
    value: "92%",
    icon: CalendarCheck,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
];

const recentGrades = [
  {
    module: "Web Development",
    grade: 16,
  },
  {
    module: "Database Systems",
    grade: 14,
  },
  {
    module: "Computer Networks",
    grade: 13,
  },
  {
    module: "Algorithms",
    grade: 15,
  },
];

const myModules = [
  { name: "Web Development" ,id:1 },
  { name: "Database Systems",id:2 },
  { name: "Computer Networks",id:3 },
  { name: "Algorithms & Data Structures" ,id:4 },
];

const upcomingDeadlines = [
  {
    id: 1,
    title: "React Assignment",
    module: "Web Development",
    deadline: "2026-08-18T23:59:00"
  },
  {
    id: 2,
    title: "Database Project",
    module: "Database Systems",
    deadline: "2026-08-22T23:59:00"
  },
  {
    id: 3,
    title: "Network Report",
    module: "Computer Networks",
    deadline: "2026-08-27T23:59:00"
  }
];
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

    {upcomingDeadlines.map((assignment) => (

      <div
        key={assignment.id}
        className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-none"
      >

        <div>
          <p className="font-medium text-slate-800">
            {assignment.title}
          </p>

          <p className="text-sm text-slate-400">
            {assignment.module}
          </p>
        </div>


        <div className="text-right">

          <p className="font-semibold text-orange-600">
            {new Date(assignment.deadline).toLocaleDateString()}
          </p>

          <p className="text-sm text-slate-400">
            Deadline
          </p>

        </div>

      </div>

    ))}
</div>
</div>


</div>
</div>
     )
}
export default DashboardS;