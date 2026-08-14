import { Routes, Route } from "react-router-dom";
import { useState,useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Admin/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import Students from "./pages/Admin/Students";
import Teachers from "./pages/Admin/Teachers";
import Registrars from "./pages/Admin/Registrars";
import Departments from "./pages/Admin/Departments";
import Classes from "./pages/Admin/Classes";
import Modules from "./pages/Admin/Modules";
import Enrollments from "./pages/Admin/Enrollments";
import Grades from "./pages/Admin/Grades";
import TeachingAssignment from "./pages/Admin/TeachingAssignment";
import CourseMaterials from "./pages/Admin/CourseMaterials";
import Assignments from "./pages/Admin/Assignments";
import DashboardS from "./pages/Student/DashboardS";
import MyModules from "./pages/Student/MyModules";
import MyGrades from "./pages/Student/MyGrades";
import MyAttendance from "./pages/Student/MyAttendance";
import MyCourseMaterials from "./pages/Student/MyCourseMaterials";
import MyAssignments from "./pages/Student/MyAssignments";
import StudentProfile from "./pages/Student/StudentProfile";
import DashboardT from "./pages/Teacher/DashboardT";
import AssignmentsT from "./pages/Teacher/AssignmentsT";
import AttendanceT from "./pages/Teacher/AttendanceT";
import CourseMaterialsT from "./pages/Teacher/CourseMaterialsT";
import GradesT from "./pages/Teacher/GradesT";
import MyClassesT from "./pages/Teacher/MyClassesT";
import MyModulesT from "./pages/Teacher/MyModulesT";
import TeacherProfile from "./pages/Teacher/TeacherProfile";
import MyStudentsT from "./pages/Teacher/MyStudentsT";
import MyTeachingAssignmentsT from "./pages/Teacher/MyTeachingAssignmentsT";

function App() {
    return (
        <Routes>

            {/* Login has NO sidebar/navbar */}
            <Route path="/login" element={<Login />} />

            {/* Everything below uses the dashboard layout */}
            <Route element={<DashboardLayout />}>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers></Teachers>}></Route>
            <Route path="/registrars" element={<Registrars></Registrars>}></Route>
            <Route path="/departments" element={<Departments></Departments>}></Route>
            <Route path="/classes" element={<Classes></Classes>}></Route>
            <Route path="/modules" element={<Modules></Modules>}></Route>
            <Route path="/enrollments" element={<Enrollments></Enrollments>}></Route>
            <Route path="/grades" element={<Grades></Grades>}></Route>
            <Route path="/teachingassignments" element={<TeachingAssignment></TeachingAssignment>}></Route>
            <Route path="/coursematerials" element={<CourseMaterials></CourseMaterials>}></Route>
            <Route path="/assignments" element={<Assignments></Assignments>}></Route>
            <Route path="/student-dashboard" element={<DashboardS></DashboardS>}></Route>
            <Route path="/teacher-dashboard" element={<DashboardT></DashboardT>}></Route>
            <Route path="/my-modules" element={<MyModules></MyModules>}></Route>
            <Route path="/my-grades" element={<MyGrades></MyGrades>}></Route>
            <Route path="/my-attendance" element={<MyAttendance></MyAttendance>}></Route>
            <Route path="/my-courseMaterials" element={<MyCourseMaterials></MyCourseMaterials>}></Route>
            <Route path="/my-assignments" element={<MyAssignments></MyAssignments>}></Route>
             <Route path="/student-profile" element={<StudentProfile></StudentProfile>}></Route>
             <Route path="/my-classes" element={<MyClassesT></MyClassesT>}></Route>
             <Route path="/my-students" element={<MyStudentsT></MyStudentsT>}></Route>
             <Route path="/my-teachingAssignments" element={<MyTeachingAssignmentsT></MyTeachingAssignmentsT>}></Route>
             <Route path="/my-courseMaterialsT" element={<CourseMaterialsT></CourseMaterialsT>}></Route>
             <Route path="/my-assignmentsT" element={<AssignmentsT> </AssignmentsT>}></Route>
             <Route path="/my-gradesT" element={<GradesT></GradesT>}></Route>
            </Route>

        </Routes>
    );
}

export default App;