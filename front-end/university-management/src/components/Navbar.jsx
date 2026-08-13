import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const navbarConfig = {
  Admin: {
    title: "University Administration",
    subtitle: "Manage the university system",
  },

  Registrar: {
    title: "Registrar Office",
    subtitle: "Manage students and academic records",
  },

  Teacher: {
    title: "Teaching Portal",
    subtitle: "Manage your classes and coursework",
  },

  Student: {
    title: "Student Portal",
    subtitle: "View your academic information",
  },
};


function Navbar({ role, user }) {
  const config = navbarConfig[role];
    const navigate=useNavigate();

  const handleLogout=()=>{
       localStorage.removeItem("token");
       navigate("/login");
  }

  if (!config) {
    return null;
  }

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">

      {/* Left side */}
      <div>
        <h1 className="text-xl font-semibold text-slate-800">
          {config.title}
        </h1>

        <p className="text-sm text-slate-500">
          {config.subtitle}
        </p>
      </div>


      {/* Right side */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <button className="p-2 rounded-lg hover:bg-slate-100 transition">
          <Search size={20} />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition">
          <Bell size={20} />

          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>


        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">

          <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center">
            <User size={18} />
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-800">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-slate-500">
              {role}
            </p>
          </div>

          <button className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition" onClick={handleLogout}>
            <LogOut size={18} />
          </button>

        </div>

      </div>

    </header>
  );
}

export default Navbar;