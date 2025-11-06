import React, { useContext } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../utils/authContext.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import BlogsCard from "../../components/Cards/BlogsCard.jsx";

function Blogs() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loader />;

  return (
    <div className="w-full min-h-screen bg-[linear-gradient(to_right,var(--tw-gradient-stops))] from-blue-900 via-indigo-900 to-black text-white flex flex-col items-center p-4 sm:p-8">

      {/* Header */}
      <div className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-slate-600 pb-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-cyan-400 mb-3 sm:mb-0">
          Blogs
        </h1>

        {(user?.userType === "Alumni" || user?.userType === "Teacher") && (
          <NavLink to="/create_blog"
            className="py-2 px-6 bg-white hover:bg-slate-100 text-teal-700 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
            <FaCirclePlus />
          </NavLink>
        )}
      </div>

      {/* Body / Cards Section */}
      <div className="w-full max-w-7xl flex flex-col gap-6">
        <BlogsCard
          title="AI Revolution in 2025"
          content="Artificial intelligence continues to evolve, transforming industries through automation, creativity, and data analysis. Here's what the next phase looks like..."
          image={{ url: "https://source.unsplash.com/800x600/?ai,technology" }}
          author="Avinash Chaurasiya"
          date="Nov 6, 2025"
          blogId="1"
        />

        <BlogsCard
          title="Cybersecurity in a Connected World"
          content="As our devices grow smarter, so do threats. Learn how cybersecurity experts are adapting to safeguard user privacy in the IoT era."
          image={{ url: "https://source.unsplash.com/800x600/?cybersecurity,network" }}
          author="Tech Community"
          date="Oct 31, 2025"
          blogId="2"
        />
      </div>
    </div>
  );
}

export default Blogs;
