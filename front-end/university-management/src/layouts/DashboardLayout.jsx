import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout() {
    return (
        <div className="flex h-screen overflow-hidden">

            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">

                <Navbar />

                <main className="flex-1 bg-slate-100 p-8 overflow-y-auto">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default DashboardLayout;