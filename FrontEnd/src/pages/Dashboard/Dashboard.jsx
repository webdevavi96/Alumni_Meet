import React, { useState } from "react";
import BlogsCard from "../../components/Cards/BlogsCard";
import EventCard from "../../components/Cards/EventCard";

function Dashboard() {
  const [tab, setTab] = useState("Blogs");

  const tabs = ["Blogs", "Events", "Followers"];

  const handleClick = (e) => {
    setTab(e.target.innerText);
  };

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
          <div className="w-full max-w-7xl flex flex-col gap-6">
            <BlogsCard
              title="AI Revolution in 2025"
              content="Artificial intelligence continues to evolve, transforming industries through automation, creativity, and data analysis. Here's what the next phase looks like..."
              image={{ url: "https://source.unsplash.com/800x600/?ai,technology" }}
              author="Avinash Chaurasiya"
              date="Nov 6, 2025"
            />

            <BlogsCard
              title="Cybersecurity in a Connected World"
              content="As our devices grow smarter, so do threats. Learn how cybersecurity experts are adapting to safeguard user privacy in the IoT era."
              image={{ url: "https://source.unsplash.com/800x600/?cybersecurity,network" }}
              author="Tech Community"
              date="Oct 31, 2025"
            />
          </div>
        }
        {tab === "Events" &&
          <div className="animate-fade-in">
            ✨ Upcoming Events will be displayed here...

            <EventCard status={"upcoming"} />
            <EventCard status={"ongoing"} />
            <EventCard status={"ended"} />
          </div>
        }
        {tab === "Followers" &&
          <div>
            👥 Followers section content goes here...
          </div>}
      </div>
    </div>
  );
}

export default Dashboard;
