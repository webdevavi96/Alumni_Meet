import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../utils/authContext.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx"
import Loader from "../../components/Loader/Loader.jsx";
import { logout } from "../../services/authService.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function Profile() {
  const { user, isAuthenticated, loading, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const res = await logout();

      if (res.status === 200) {
        await logOut();
        toast.success("Logged out successfully 👋", {
          style: {
            background: "linear-gradient(to right, #006d5b, #00b09b)",
            color: "#fff",
            borderRadius: "8px",
          },
        });
        navigate("/");
      } else {
        toast.error("Logout failed. Please try again.", {
          style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
            color: "#fff",
            borderRadius: "8px",
          },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong during logout!", {
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
          color: "#fff",
          borderRadius: "8px",
        },
      });
    }
  };

  useEffect(() => {
    if (user && !sessionStorage.getItem("toastShown")) {
      toast.info(`Welcome! ${user.fullName}`, { toastId: "welcome-toast" });
      sessionStorage.setItem("toastShown", "true");
    }
    if (user) toast.info(`Welcome! ${user.fullName}`);
  }, [])


  if (loading) return <div className="flex justify-center items-center"><Loader /></div>;
  if (!isAuthenticated || !user) return <div className="flex justify-center items-center text-white text-center pt-20">You are not logged in.</div>;

  return (
    <div className="min-h-auto bg-linear-to-r from-gray-900 via-black to-gray-900 p-6 text-white">

      {/* Welcome Message */}
      <h1 className="text-3xl font-semibold mb-6">
        Welcome, <span className="text-cyan-400">{user.fullName}</span> 👋
      </h1>

      {/* User Info Card */}
      <div className="bg-gray-800 p-5 rounded-xl shadow-lg flex items-center gap-4 border border-gray-700">
        <img
          src={user.avatar}
          alt="Profile"
          className="w-16 h-16 rounded-full border-2 border-cyan-500 object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold">{user.fullName}</h2>
          <p className="text-gray-400 text-sm">@{user.username}</p>
          <p className="text-sm text-cyan-400">{user.userType}</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 text-center">
          <p className="text-gray-400 text-sm">Email</p>
          <p className="text-lg font-medium">{user.email}</p>
        </div>
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 text-center">
          <p className="text-gray-400 text-sm">Gender</p>
          <p className="text-lg font-medium">{user.gender}</p>
        </div>
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 text-center">
          <p className="text-gray-400 text-sm">Joined</p>
          <p className="text-lg font-medium">{new Date(user.createdAt).toDateString()}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4">
        <button className="px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition font-medium">
          Edit Profile
        </button>
        <button
          onClick={handleClick}
          className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition font-medium">
          Logout
        </button>
      </div>

      {user.userType !== "Student" && (
        <Dashboard />
      )}

    </div>
  );
}

export default Profile;
