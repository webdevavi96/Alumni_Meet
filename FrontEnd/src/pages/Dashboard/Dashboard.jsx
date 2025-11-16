import React, { useEffect, useState, useContext } from "react";
import BlogsCard from "../../components/Cards/BlogsCard";
import EventCard from "../../components/Cards/EventCard";
import { AuthContext } from "../../utils/authContext.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import { fetchUserDashboard } from "../../services/userDashBoardServices.js";


function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const [tab, setTab] = useState("Blogs");
  const tabs = ["Blogs", "Events", "Followers"];
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);


  const checkEventStatus = (eventDate, eventTime) => {
    const [day, month, year] = eventDate.split("/");

    // Convert to ISO format YYYY-MM-DD HH:MM
    const dateTimeString = `${year}-${month}-${day} ${eventTime}`;
    const eventDateObj = new Date(dateTimeString);

    const now = new Date();

    if (eventDateObj > now) return "upcoming";
    if (
      eventDateObj.toDateString() === now.toDateString() &&
      eventDateObj.getHours() === now.getHours()
    ) {
      return "ongoing";
    }
    return "ended";
  };

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


  useEffect(() => {
    const dashboardfn = async () => {
      if (!user) return;
      try {
        const userId = user._id
        setDashboardLoading(true)
        const res = await fetchUserDashboard(userId);
        if (res.status === 200 || res.status === "Success") {
          console.log(res.data);
          setBlogs(res.data.blogs);
          setEvents(res.data.events);
        } else {
          console.error(res.status);
        }
      } catch (error) {
        console.error("error in fetching dashboard: ", error);
        throw error;
      } finally {
        setDashboardLoading(false)
      }

    }
    dashboardfn();

  }, [])


  const handleClick = (e) => {
    setTab(e.target.innerText);
  };

  if (loading) return <Loader />

  return (
    <div className="min-h-screen w-full pt-6 px-4 bg-[linear-gradient(to_right,var(--tw-gradient-stops))] from-[#0f172a] via-[#1e293b] to-[#020617] text-white">
      {/* Header */}
      <div className="border-b border-slate-600 pb-2 mb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cyan-400">
          Your Dashboard
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-6 mb-6">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={(e) => handleClick(e)}
            className={`px-10 sm:px-10 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 
              ${tab === item
                ? "bg-cyan-400 text-black shadow-md shadow-cyan-500/30 scale-105"
                : "bg-slate-700 text-white hover:bg-cyan-600/30 hover:scale-105"
              }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="text-center mt-8 text-base sm:text-lg font-medium">
        {tab === "Blogs" &&
          (dashboardLoading ? (<Loader />) : (<div className="w-full max-w-7xl flex flex-col gap-6">
            {blogs.map((data) => {

              return (<BlogsCard
                key={data._id}
                title={data.title}
                content={data.content}
                image={{ url: data.image }}
                author={data.author.username}
                date={data.createAt}
              />)
            })}
          </div>
          ))
        }
        {tab === "Events" && (
          dashboardLoading ? (<Loader />) : (<div className="animate-fade-in">
            {events.map((event) => {
              const status = checkEventStatus(event.eventDate, event.startTime);
              return (<EventCard
                key={event._id}
                status={status}
                title={event.title}
                description={event.description}
                meetingUrl={event.meetingUrl}
                startTime={formatEventTime(event.startTime)}
                eventDate={formatDate(event.eventDate)}
                duration={event.duration}
              />)
            })}
          </div>)
        )}
        {tab === "Followers" &&
          <div>
            👥 Followers section content goes here...

            <EventCard status={"upcoming"} />
            <EventCard status={"ongoing"} />
            <EventCard status={"ended"} />

          </div>}
      </div>
    </div>
  );
}

export default Dashboard;
