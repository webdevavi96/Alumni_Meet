import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../utils/authContext.jsx";
// import BlogEditor from "../../components/BlogEditor/BlogEditor.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import { NavLink } from "react-router-dom";

function Blogs() {
  const { user, loading } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  // Fetch blogs
  const fetchBlogs = async () => {
    const res = await fetch("http://localhost:5000/api/blogs");
    const data = await res.json();
    if (data.success) setBlogs(data.blogs);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handlePublish = async () => {
    if (!title || !content) return alert("Please add title and content!");
    setPosting(true);
    try {
      const blogData = {
        title,
        content,
        author: user?.fullName || "Anonymous",
      };

      const res = await fetch("http://localhost:5000/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Blog posted successfully!");
        setTitle("");
        setContent("");
        setShowEditor(false);
        fetchBlogs();
      } else {
        alert("❌ Failed to post blog");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-blue-900 via-indigo-900 to-black text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Blogs</h1>

      {/* Show create option only for non-students */}
      {user?.userType !== "Student" && (
        <div className="mb-8 text-center">
          {!showEditor ? (
            <button>
              create
            </button>
            // <NavLink
            //   to="/create-blog"
            //   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
            // >
            //   ✍️ Post a New Blog
            // </NavLink>
          ) : (
            <div className="bg-white text-black p-4 rounded-lg shadow-md max-w-2xl w-full">
              <input
                type="text"
                placeholder="Enter blog title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 mb-3 rounded-md"
              />
              <BlogEditor onChange={setContent} />
              <div className="flex justify-end mt-4 gap-3">
                <button
                  onClick={() => setShowEditor(false)}
                  className="bg-gray-300 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  disabled={posting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {posting ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Display Blogs */}
      <div className="w-full max-w-4xl space-y-6">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white/10 rounded-lg p-4 shadow-md backdrop-blur-sm"
            >
              <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: blog.content }}
                className="prose prose-invert max-w-none"
              />
              <p className="text-sm text-gray-300 mt-2">
                By {blog.author} —{" "}
                {new Date(blog.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No blogs yet.</p>
        )}
      </div>
    </div>
  );
}

export default Blogs;
