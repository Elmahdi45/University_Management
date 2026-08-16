import {
  User,
  Key,
  X,
} from "lucide-react";
import { useState } from "react";
import api from "../api/axios";

function Profile({ role, user }) {

  const [isOpen, setIsOpen] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  if (!user) {
    return <div>Loading profile...</div>;
  }

  const handleUpdate = () => {
    setIsOpen(true);
  };

  const handleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      alert("New password must be different from your current password");
      return;
    }

    try {
      setLoading(true);

      await api.put("/profile/updateProfile", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      alert("Password updated successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setIsOpen(false);

    } catch (err) {
      alert(
        err.response?.data?.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-slate-100 min-h-full">

      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="h-28 bg-indigo-400 from-indigo-600 to-purple-600" />

          <div className="p-6 -mt-12">

            <div className="flex items-end gap-4">

              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">

                    <div className="w-full h-full rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-3xl font-bold">
                      {(user.first_name?.[0] || "")}
                      {(user.last_name?.[0] || "")}
                  </div>

              </div>

              <div className="pb-1">

                <h1 className="text-2xl font-bold">
                  {user.first_name} {user.last_name}
                </h1>

                <p className="text-slate-500">
                  {user.email}
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* Personal Information */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <h2 className="text-xl font-bold mb-6">
            Personal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-slate-400">
                First Name
              </p>

              <p className="font-semibold">
                {user.first_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Last Name
              </p>

              <p className="font-semibold">
                {user.last_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Email
              </p>

              <p className="font-semibold">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Phone
              </p>

              <p className="font-semibold">
                {user.phone || "Not provided"}
              </p>
            </div>

          </div>

        </div>


        {/* Role Information */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <h2 className="text-xl font-bold mb-6">
            {role} Information
          </h2>

          {role === "Student" && (
            <div className="grid md:grid-cols-2 gap-4">

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-sm text-slate-400">
                  Student ID
                </p>

                <p className="font-semibold">
                  {user.id || "Not available"}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-sm text-slate-400">
                  Class
                </p>

                <p className="font-semibold">
                  {user.class_name || "Not assigned"}
                </p>
              </div>

            </div>
          )}

          {role === "Teacher" && (
            <div className="grid md:grid-cols-3 gap-4">

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-sm text-slate-400">
                  Teacher ID
                </p>

                <p className="font-semibold">
                  {user.teacher_profile_id || "Not available"}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-sm text-slate-400">
                  Department
                </p>

                <p className="font-semibold">
                  {user.department_name || "Not assigned"}
                </p>
              </div>
            </div>
          )}

          {role === "Registrar" && (
            <div className="grid md:grid-cols-2 gap-4">

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-sm text-slate-400">
                  Registrar ID
                </p>

                <p className="font-semibold">
                  {user.registrar_id || "Not available"}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-sm text-slate-400">
                  Department
                </p>

                <p className="font-semibold">
                  {user.department_name || "Administration"}
                </p>
              </div>

            </div>
          )}

          {role === "Admin" && (
            <div className="bg-slate-50 p-4 rounded-xl">

              <p className="text-sm text-slate-400">
                Access Level
              </p>

              <p className="font-semibold">
                Full Administration
              </p>

            </div>
          )}

        </div>


        {/* Security */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <div className="flex items-center gap-3 mb-4">

            <Key
              size={20}
              className="text-indigo-600"
            />

            <h2 className="text-xl font-bold">
              Security
            </h2>

          </div>

          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Change Password
          </button>

        </div>

      </div>


      {/* Change Password Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold">
                Change Password
              </h2>

              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={24} />
              </button>

            </div>

            <form
              onSubmit={handleSubmitPassword}
              className="space-y-5"
            >

              <div>
                <label className="text-sm font-semibold">
                  Current Password
                </label>

                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Profile;