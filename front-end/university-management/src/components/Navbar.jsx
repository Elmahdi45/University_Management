import {
  Search,
  Bell,
  ChevronDown,
  Menu,
} from "lucide-react";

function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">

      {/* Left Side */}
      <div className="flex items-center gap-5">

        {/* Mobile menu button (logic later) */}
        <button className="lg:hidden">
          <Menu size={22} />
        </button>

        {/* Search */}
        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search students, teachers..."
            className="w-80 border border-slate-300 rounded-lg py-2 pl-10 pr-4 outline-none focus:border-slate-900"
          />

        </div>

      </div>

      {/* Right Side */}
      <div className="flex items-center gap-8">

        {/* Date */}
        <div>
          <span className="text-slate-500 font-medium">
            Sunday, August 2
          </span>
        </div>

        {/* Notification */}
        <button className="relative">

          <Bell size={22} className="text-slate-600" />

          {/* Red Dot */}
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>

        </button>

        {/* User */}
        <button className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
            LP
          </div>

          <span className="font-medium">
            Lisa Park
          </span>

          <ChevronDown size={18} className="text-slate-500" />

        </button>

      </div>

    </header>
  );
}

export default Navbar;