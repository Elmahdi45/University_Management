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
  Settings,
  LogOut,
  UserCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const sidebarConfig = {
  Admin: {
    title: "Admin",
    subtitle: "University Admin",

    dashboard: {
      path: "/dashboard",
      label: "Dashboard",
    },

    sections: [
      {
        title: "People",
        links: [
          {
            label: "Students",
            path: "/students",
            icon: GraduationCap,
          },
          {
            label: "Teachers",
            path: "/teachers",
            icon: Users,
          },
          {
            label: "Registrars",
            path: "/registrars",
            icon: UserCog,
          },
        ],
      },

      {
        title: "Academics",
        links: [
          {
            label: "Departments",
            path: "/departments",
            icon: Building2,
          },
          {
            label: "Classes",
            path: "/classes",
            icon: BookOpen,
          },
          {
            label: "Modules",
            path: "/modules",
            icon: Layers,
          },
          {
            label: "Enrollments",
            path: "/enrollments",
            icon: ClipboardList,
          },
          {
            label: "Grades",
            path: "/grades",
            icon: Award,
          },
          {
            label: "Teaching Assignments",
            path: "/teachingassignments",
            icon: Briefcase,
          },
        ],
      },

      {
        title: "Coursework",
        links: [
          {
            label: "Course Materials",
            path: "/coursematerials",
            icon: FileText,
          },
          {
            label: "Assignments",
            path: "/assignments",
            icon: ClipboardList,
          },
        ],
      },
    ],
  },

  Registrar: {
    title: "Registrar",
    subtitle: "Academic Administration",

    dashboard: {
      path: "/registrar-dashboard",
      label: "Dashboard",
    },

    sections: [
      {
        title: "People",
        links: [
          {
            label: "Students",
            path: "/students",
            icon: GraduationCap,
          },
          {
            label: "Teachers",
            path: "/teachers",
            icon: Users,
          },
        ],
      },

      {
        title: "Academics",
        links: [
          {
            label: "Classes",
            path: "/classes",
            icon: BookOpen,
          },
          {
            label: "Modules",
            path: "/modules",
            icon: Layers,
          },
          {
            label: "Enrollments",
            path: "/enrollments",
            icon: ClipboardList,
          },
        ],
      },
    ],
  },

  Teacher: {
    title: "Teacher",
    subtitle: "University Faculty",

    dashboard: {
      path: "/teacher-dashboard",
      label: "Dashboard",
    },

    sections: [
      {
        title: "Teaching",
        links: [
          {
            label: "My Classes",
            path: "/my-classes",
            icon: BookOpen,
          },
          {
            label: "My Students",
            path: "/my-students",
            icon: Users,
          },
          {
            label: "Teaching Assignments",
            path: "/my-teachingAssignments",
            icon: Briefcase,
          },
        ],
      },

      {
        title: "Coursework",
        links: [
          {
            label: "Course Materials",
            path: "/my-courseMaterialsT ",
            icon: FileText,
          },
          {
            label: "Assignments",
            path: "/my-assignmentsT",
            icon: ClipboardList,
          },
          {
            label: "Grades",
            path: "/my-gradesT",
            icon: Award,
          },
          
        ],
      },
    ],
  },

  Student: {
    title: "Student",
    subtitle: "University Student",

    dashboard: {
      path: "/student-dashboard",
      label: "Dashboard",
    },

    sections: [
      {
        title: "Academic",
        links: [
          {
            label: "My Modules",
            path: "/my-modules",
            icon: Layers,
          },
        
          {
            label: "Grades",
            path: "/my-grades",
            icon: Award,
          },
          {
            label: "Attendance",
            path: "/my-attendance",
            icon: ClipboardList,
          },

          {
            label:"Profile",
            path:"/student-profile",
            icon:UserCircle
          }
        ],
      },

      {
        title: "Coursework",
        links: [
          {
            label: "Course Materials",
            path: "/my-courseMaterials",
            icon: FileText,
          },
          {
            label: "Assignments",
            path: "/my-assignments",
            icon: ClipboardList,
          },
        ],
      },
    ],
  },
};

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 w-full px-3 py-2 rounded-lg transition ${
    isActive ? "bg-slate-800" : "hover:bg-slate-800"
  }`;




function Sidebar({ role }) {
  const config = sidebarConfig[role];
  const navigate=useNavigate();

  const handleLogout=()=>{
       localStorage.removeItem("token");
       navigate("/login");
  }

  if (!config) {
    return null;
  }

  return (
    <aside className="w-70 min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 overflow-y-auto">

      {/* Header */}
      <div>

        <div className="flex items-center gap-4">

          <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
            <span className="font-bold">
              {config.title.charAt(0)}
            </span>
          </div>

          <div>
            <h1 className="font-bold text-lg">
              {config.title}
            </h1>

            <p className="text-sm text-slate-400">
              {config.subtitle}
            </p>
          </div>

        </div>

        <hr className="border-slate-700 my-6" />

        {/* Dashboard */}
        <NavLink
          to={config.dashboard.path}
          className={linkClass}
        >
          <LayoutDashboard size={20} />

          <span className="font-medium">
            {config.dashboard.label}
          </span>
        </NavLink>

        {/* Sections */}
        {config.sections.map((section) => (

          <div
            key={section.title}
            className="mt-8"
          >

            <h2 className="text-xs uppercase tracking-wider text-slate-400 mb-4">
              {section.title}
            </h2>

            <div className="space-y-2">

              {section.links.map((link) => {

                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={linkClass}
                  >
                    <Icon size={20} />
                    {link.label}
                  </NavLink>
                );

              })}

            </div>

          </div>

        ))}

      </div>

      {/* Footer */}
      <div>

        <hr className="border-slate-700 mb-6" />

        <div className="space-y-2">

          

          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-900 transition" onClick={handleLogout}>
            <LogOut size={20} />
            Logout
            
          </button>

        </div>

      </div>

    </aside>
  );
}
export default Sidebar;