import React, { useEffect, useState, useContext } from "react";
import BlogsCard from "../../components/Cards/BlogsCard";
import EventCard from "../../components/Cards/EventCard";
import { AuthContext } from "../../utils/authContext.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import { fetchUserDashboard } from "../../services/userDashBoardServices.js";
import { getEventStatus } from "../../utils/eventActions.js";

function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const [tab, setTab] = useState("Blogs");
  const tabs = ["Blogs", "Events", "Followers"];
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");

  const formatEventTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const filteredEvents = events.filter((event) => {
    const status = getEventStatus(event);

    if (filter === "all") return true;
    return status === filter;
  });


  useEffect(() => {
    const dashboardfn = async () => {
      if (!user) return;
      try {
        setDashboardLoading(true);
        const res = await fetchUserDashboard(user._id);
        if (res.status === 200 || res.status === "Success") {
          setBlogs(res.data.blogs);
          setEvents(res.data.events);
        }
      } catch (error) {
        console.error("error in fetching dashboard:", error);
      } finally {
        setDashboardLoading(false);
      }
    };
    dashboardfn();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen w-full pt-6 px-4 bg-[linear-gradient(to_right,var(--tw-gradient-stops))] from-[#0f172a] via-[#1e293b] to-[#020617] text-white">
      <div className="border-b border-slate-600 pb-2 mb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cyan-400">
          Your Dashboard
        </h1>
      </div>

      <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-6 mb-6">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={(e) => setTab(e.target.innerText)}
            className={`px-10 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 
              ${tab === item
                ? "bg-cyan-400 text-black shadow-md shadow-cyan-500/30 scale-105"
                : "bg-slate-700 text-white hover:bg-cyan-600/30 hover:scale-105"
              }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="text-center mt-8 text-base sm:text-lg font-medium">
        {tab === "Blogs" &&
          (dashboardLoading ? (
            <Loader />
          ) : (
            <div className="w-full max-w-7xl flex flex-col gap-6">
              {blogs.map((data) => (
                <BlogsCard
                  key={data._id}
                  id={data._id}
                  title={data.title}
                  content={data.content}
                  image={{ url: data.image }}
                  author={data.author.username}
                  date={data.createAt}
                />
              ))}
            </div>
          ))}

        {tab === "Events" &&
          (dashboardLoading ? (
            <Loader />
          ) : (
            <div className="animate-fade-in w-full max-w-7xl mx-auto">

              <div className="flex justify-end mb-6">
                <select
                  className="
            bg-slate-800 text-white border border-slate-600 
            px-4 py-2 rounded-lg cursor-pointer 
            focus:outline-none focus:ring-2 focus:ring-cyan-500
            shadow-md hover:shadow-lg transition-all
          "
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming Events</option>
                  <option value="ongoing">Ongoing Events</option>
                  <option value="ended">Ended Events</option>
                </select>
              </div>

              {filteredEvents.length === 0 ? (
                <p className="text-gray-300 mt-10">No events found.</p>
              ) : (
                filteredEvents.map((event) => {
                  const status = getEventStatus(event);
                  return (
                    <EventCard
                      key={event._id}
                      eventId={event._id}
                      status={status}
                      title={event.title}
                      description={event.description}
                      meetingUrl={event.meetingUrl}
                      startTime={formatEventTime(event.startTime)}
                      eventDate={formatDate(event.eventDate)}
                      duration={event.duration}
                    />
                  );
                })
              )}
            </div>
          ))}

        {tab === "Followers" && (
          <div>
            <p className="text-3xl text-blue-600">This feature is comming soon...</p>
            <p>👥 Followers section content goes here...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
