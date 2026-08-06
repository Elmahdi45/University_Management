import { Routes, Route } from "react-router-dom";
import { useState,useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Admin/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import Students from "./pages/Admin/Students";

function App() {


    return (
        <Routes>

            {/* Login has NO sidebar/navbar */}
            <Route path="/login" element={<Login />} />

            {/* Everything below uses the dashboard layout */}
            <Route element={<DashboardLayout />}>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />



                {/* Later */}
                {/* <Route path="/students" element={<Students />} /> */}
                {/* <Route path="/teachers" element={<Teachers />} /> */}
                {/* <Route path="/modules" element={<Modules />} /> */}

            </Route>

        </Routes>
    );
}

export default App;