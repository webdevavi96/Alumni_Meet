import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../utils/authContext.jsx";
import EventCard from "../../components/Cards/EventCard";
import BlogsCard from "../../components/Cards/BlogsCard.jsx";
import { fetchAllEvents } from "../../services/eventServices.js";
import { fetchAllBlogs } from "../../services/blogServices.js";
import Loader from "../../components/Loader/Loader.jsx";
import { useNavigate } from "react-router-dom";

function Home() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [tab, setTab] = useState("Blogs");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const tabs = ["Blogs", "Events"];

  const handleClick = (e) => {
    setTab(e.target.innerText);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await fetchAllEvents();
        const fetchedBlogs = await fetchAllBlogs();

        if (fetchedEvents?.status === 200 || fetchedEvents?.message === "Success") {
          setEvents(fetchedEvents.data.events || []);
          setBlogs(fetchedBlogs?.data?.blogs || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="w-full min-h-screen bg-[linear-gradient(to_right,var(--tw-gradient-stops))] from-blue-900 via-indigo-900 to-black text-white flex flex-col items-center py-10 px-4 sm:px-8">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-cyan-400 tracking-wide text-center">
        Latest Updates
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-10">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={handleClick}
            className={`px-10 py-3 rounded-lg text-base font-semibold transition-all duration-200 
              ${tab === item
                ? "bg-cyan-400 text-black shadow-md shadow-cyan-500/30 scale-105"
                : "bg-slate-700 text-white hover:bg-cyan-600/30 hover:scale-105"
              }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Content */}
      <article 
      className="w-full max-w-6xl flex flex-col gap-6"
      
      >
        {tab === "Blogs" && (
          <>
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <BlogsCard
                  key={blog._id}
                  title={blog.title}
                  content={blog.content}
                  image={blog.image}
                  author={blog.author?.fullName || blog.author?.username}
                  date={new Date(blog.createdAt).toLocaleDateString()}
                  handlerFn={() =>
                    navigate(`/readmore/${blog._id}`, { state: blog })
                  }
                />
              ))
            ) : (
              <p className="text-center text-gray-400 py-10">
                ✨ No blogs found.
              </p>
            )}
          </>
        )}

        {tab === "Events" && (
          <div className="animate-fade-in">
            {events.length > 0 ? (
              events.map((event) => (
                <EventCard
                  key={event._id}
                  title={event.title}
                  description={event.description}
                  meetingUrl={event.meetingUrl}
                  startTime={event.startTime}
                  eventDate={event.eventDate}
                  duration={event.duration}
                  status={"upcoming"}
                />
              ))
            ) : (
              <p className="text-center text-gray-400 py-10">
                ✨ Upcoming Events will be displayed here...
              </p>
            )}
          </div>
        )}
      </article>
    </div>
  );
}

export default Home;
