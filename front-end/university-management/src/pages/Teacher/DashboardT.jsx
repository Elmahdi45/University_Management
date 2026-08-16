import { useEffect, useMemo, useState } from "react";
import {
    BookOpen,
    CalendarDays,
    ClipboardList,
    FileText,
    GraduationCap,
    Users,
} from "lucide-react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";

function DashboardT() {
    const [grades, setGrades] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [courseMaterials, setCourseMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadDashboard = async () => {
            setLoading(true);
            setError("");

            const results = await Promise.allSettled([
                api.get("/grades/get-my-students"),
                api.get("/assignment"),
                api.get("/courseMaterial"),
            ]);

            if (!isMounted) return;

            const [gradesResult, assignmentsResult, materialsResult] = results;
            const failedRequest = results.find(
                (result) =>
                    result.status === "rejected" &&
                    result.reason?.response?.status !== 404
            );

            setGrades(
                gradesResult.status === "fulfilled"
                    ? gradesResult.value.data.grades || []
                    : []
            );

            setAssignments(
                assignmentsResult.status === "fulfilled"
                    ? assignmentsResult.value.data.assignments || []
                    : []
            );

            setCourseMaterials(
                materialsResult.status === "fulfilled"
                    ? materialsResult.value.data.courseMaterials || []
                    : []
            );

            if (failedRequest) {
                setError(
                    failedRequest.reason?.response?.data?.message ||
                        "Some dashboard information could not be loaded."
                );
            }

            setLoading(false);
        };

        loadDashboard();

        return () => {
            isMounted = false;
        };
    }, []);

    const dashboardData = useMemo(() => {
        const uniqueStudents = new Map();
        const uniqueModules = new Map();
        const uniqueClasses = new Map();

        grades.forEach((row) => {
            if (row.student_id) {
                uniqueStudents.set(row.student_id, row);
            }

            if (row.module_id) {
                uniqueModules.set(row.module_id, row);
            }

            if (row.class_id) {
                uniqueClasses.set(row.class_id, row);
            }
        });

        const ungradedStudents = grades
            .filter((row) => row.grade === null || row.grade === undefined)
            .slice(0, 5);

        const upcomingAssignments = assignments
            .filter((assignment) => {
                if (!assignment.deadline) return false;
                return new Date(assignment.deadline) > new Date();
            })
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .slice(0, 5);

        return {
            students: uniqueStudents.size,
            modules: uniqueModules.size,
            classes: uniqueClasses.size,
            ungradedStudents,
            upcomingAssignments,
        };
    }, [assignments, grades]);

    const stats = [
        {
            title: "My Students",
            value: dashboardData.students,
            icon: GraduationCap,
            bg: "bg-blue-100",
            color: "text-blue-600",
        },
        {
            title: "Assigned Modules",
            value: dashboardData.modules,
            icon: BookOpen,
            bg: "bg-indigo-100",
            color: "text-indigo-600",
        },
        {
            title: "Assigned Classes",
            value: dashboardData.classes,
            icon: Users,
            bg: "bg-violet-100",
            color: "text-violet-600",
        },
        {
            title: "Course Materials",
            value: courseMaterials.length,
            icon: FileText,
            bg: "bg-emerald-100",
            color: "text-emerald-600",
        },
    ];

    const studentName = (row) =>
        `${row.student_first_name || ""} ${row.student_last_name || ""}`.trim() ||
        "Unknown student";

    return (
        <div className="p-4 md:p-8 space-y-8">
            <PageHeader
                title="Teacher Dashboard"
                description="An overview of your classes, students, and teaching activity"
            />

            {error && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}
                            >
                                <Icon size={24} className={stat.color} />
                            </div>

                            <p className="mt-6 text-3xl font-bold text-slate-900">
                                {loading ? "—" : stat.value}
                            </p>
                            <p className="mt-1 text-slate-500">{stat.title}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                            <ClipboardList size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Students to Grade
                            </h2>
                            <p className="text-sm text-slate-500">
                                Students in your classes without a recorded grade
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        {loading ? (
                            <p className="text-slate-500">Loading students...</p>
                        ) : dashboardData.ungradedStudents.length > 0 ? (
                            dashboardData.ungradedStudents.map((row) => (
                                <div
                                    key={`${row.student_id}-${row.module_id}`}
                                    className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                                >
                                    <div>
                                        <p className="font-semibold text-slate-800">
                                            {studentName(row)}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {row.module_name || "Unknown module"} · {row.class_name || "Unknown class"}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
                                        Not graded
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500">
                                Every listed student has a recorded grade.
                            </p>
                        )}
                    </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                            <CalendarDays size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Upcoming Deadlines
                            </h2>
                            <p className="text-sm text-slate-500">
                                Your next assignment deadlines
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        {loading ? (
                            <p className="text-slate-500">Loading assignments...</p>
                        ) : dashboardData.upcomingAssignments.length > 0 ? (
                            dashboardData.upcomingAssignments.map((assignment) => (
                                <div
                                    key={assignment.id}
                                    className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                                >
                                    <div>
                                        <p className="font-semibold text-slate-800">
                                            {assignment.title || "Untitled assignment"}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {assignment.module_name || "Unknown module"}
                                            {assignment.class_name ? ` · ${assignment.class_name}` : ""}
                                        </p>
                                    </div>
                                    <p className="text-right text-sm font-semibold text-purple-700">
                                        {new Date(assignment.deadline).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500">No upcoming assignment deadlines.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default DashboardT;
