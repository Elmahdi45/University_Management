import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import api from "../api/axios";

function DashboardLayout() {

  const [user, setUser] = useState(null);

  async function loadUser() {
    try {
      const response = await api.get("/profile");

      setUser(response.data.user);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">

      <Sidebar role={user.role} />

      <div className="flex-1 flex flex-col overflow-hidden">

        <Navbar
         role={user.role}
         user={user}
       />

        <main className="flex-1 bg-slate-100 p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;