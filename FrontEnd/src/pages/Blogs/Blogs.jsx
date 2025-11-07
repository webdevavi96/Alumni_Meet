import React, { useContext } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/authContext.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import BlogsCard from "../../components/Cards/BlogsCard.jsx";
import { fetchAllBlogs } from "../../services/blogServices.js";
import { useState } from "react";
import { useEffect } from "react";

function Blogs() {
  const { user, loading } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate();
  const handleClick = (blog) => {
    navigate(`readmore${blog._id}`, { state: blog });
  };

  useEffect(() => {
    const fecthBlogs = async () => {
      try {
        setIsLoading(true)
        const res = await fetchAllBlogs();
        if (res) {
          console.log(res);
          const allBlogs = res.data?.blogs
          console.log(allBlogs)
          setBlogs(allBlogs);
          console.log(blogs)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fecthBlogs()
  }, [user])


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
        {isLoading ? <Loader /> :

          blogs.map((blog) => (
            <BlogsCard
              key={blog._id}
              title={blog.title}
              content={blog.content}
              image={blog.image}
              author={blog.author?.fullName || blog.author?.username}
              date={new Date(blog.createdAt).toLocaleDateString()}
              handlerFn={() => navigate(`/readmore/${blog._id}`, { state: blog })}
            />
          ))

        }
      </div>
    </div>
  );
}

export default Blogs;
