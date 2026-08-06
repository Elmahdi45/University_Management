import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCog,
  Building2,
  BookOpen,
  Layers,
  ClipboardList,
  Award,
  Briefcase,
  FileText,
  FileCheck2,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";






const linkClass = ({ isActive }) =>
  `flex items-center gap-3 w-full px-3 py-2 rounded-lg transition ${
    isActive ? "bg-slate-800" : "hover:bg-slate-800"
  }`;

function Sidebar() {
  return (
    <aside className="w-70 min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 overflow-y-auto">

      {/* Header */}
      <div>

        <div className="flex items-center gap-4">

          <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
            <span className="font-bold">A</span>
          </div>

          <div>
            <h1 className="font-bold text-lg">Admin</h1>
            <p className="text-sm text-slate-400">
              University Admin
            </p>
          </div>

        </div>

        <hr className="border-slate-700 my-6" />

        {/* Dashboard */}
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </NavLink>

        {/* People */}
        <div className="mt-8">

          <h2 className="text-xs uppercase tracking-wider text-slate-400 mb-4">
            People
          </h2>

          <div className="space-y-2">

            <NavLink to="/students" className={linkClass}>
              <GraduationCap size={20} />
              Students
            </NavLink>

            <NavLink to="/teachers" className={linkClass}>
              <Users size={20} />
              Teachers
            </NavLink>

            <NavLink to="/registrars" className={linkClass}>
              <UserCog size={20} />
              Registrars
            </NavLink>

          </div>

        </div>

        {/* Academics */}
        <div className="mt-8">

          <h2 className="text-xs uppercase tracking-wider text-slate-400 mb-4">
            Academics
          </h2>

          <div className="space-y-2">

            <NavLink to="/departments" className={linkClass}>
              <Building2 size={20} />
              Departments
            </NavLink>

            <NavLink to="/classes" className={linkClass}>
              <BookOpen size={20} />
              Classes
            </NavLink>

            <NavLink to="/modules" className={linkClass}>
              <Layers size={20} />
              Modules
            </NavLink>

            <NavLink to="/enrollments" className={linkClass}>
              <ClipboardList size={20} />
              Enrollments
            </NavLink>

            <NavLink to="/grades" className={linkClass}>
              <Award size={20} />
              Grades
            </NavLink>

            <NavLink to="/teachingassignments" className={linkClass}>
              <Briefcase size={20} />
              Teaching Assignments
            </NavLink>

          </div>

        </div>

        {/* Coursework */}
        <div className="mt-8">

          <h2 className="text-xs uppercase tracking-wider text-slate-400 mb-4">
            Coursework
          </h2>

          <div className="space-y-2">

            <NavLink to="/coursematerials" className={linkClass}>
              <FileText size={20} />
              Course Materials
            </NavLink>

            <NavLink to="/assignments" className={linkClass}>
              <ClipboardList size={20} />
              Assignments
            </NavLink>

            <NavLink to="/submissions" className={linkClass}>
              <FileCheck2 size={20} />
              Submissions
            </NavLink>

          </div>

        </div>

      </div>

      {/* Footer */}
      <div>

        <hr className="border-slate-700 mb-6" />

        <div className="space-y-2">

          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-slate-800 transition">
            <Settings size={20} />
            Settings
          </button>

          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-900 transition">
            <LogOut size={20} />
            Logout
          </button>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;