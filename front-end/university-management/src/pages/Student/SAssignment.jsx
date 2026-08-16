import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

function SAssignment() {
    const { id } = useParams();

    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAssignment = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/assignment/${id}`);

                setAssignment(response.data.assignment || null);
            } catch (err) {
                console.log(err.response || err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load this assignment."
                );
            } finally {
                setLoading(false);
            }
        };

        loadAssignment();
    }, [id]);

    if (loading) {
        return (
            <div className="p-8 text-slate-500">
                Loading assignment...
            </div>
        );
    }

    if (error || !assignment) {
        return (
            <div className="p-8 space-y-5">
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    {error || "Assignment not found."}
                </div>

                <Link
                    to="/assignments"
                    className="font-semibold text-indigo-600 hover:underline"
                >
                    ← Back to assignments
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-8">
            <PageHeader
                title={assignment.title}
                description="Assignment details and instructions"
            />

            <div className="max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-slate-400">Module</p>
                        <p className="font-semibold text-slate-800">
                            {assignment.module_name || "Not available"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-400">Class</p>
                        <p className="font-semibold text-slate-800">
                            {assignment.class_name || "Not available"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-400">Teacher</p>
                        <p className="font-semibold text-slate-800">
                            {`${assignment.teacher_first_name || ""} ${assignment.teacher_last_name || ""}`.trim() ||
                                "Not available"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-400">Deadline</p>
                        <p className="font-semibold text-orange-600">
                            {assignment.deadline
                                ? new Date(assignment.deadline).toLocaleString()
                                : "No deadline"}
                        </p>
                    </div>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                    <h2 className="text-xl font-bold text-slate-800">
                        Instructions
                    </h2>

                    <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
                        {assignment.description || "No instructions provided."}
                    </p>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-5">
                    <Link
                        to="/assignments"
                        className="font-semibold text-indigo-600 hover:underline"
                    >
                        ← Back to assignments
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SAssignment;