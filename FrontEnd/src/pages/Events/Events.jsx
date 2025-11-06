import React, { useState, useContext } from "react";
import {NavLink} from "react-router-dom"
import { FaCirclePlus } from "react-icons/fa6";
import { AuthContext } from "../../utils/authContext.jsx";
import EventCard from "../../components/Cards/EventCard";

function Events() {
  const { user, loading } = useContext(AuthContext);

  const [tab, setTab] = useState("Upcoming Events");

  const tabs = ["Upcoming Events", "Ongoing Events", "Ended Events"];

  const handleClick = (e) => {
    setTab(e.target.innerText);
  };

  return (
    <div className="px-2 w-full min-h-screen bg-[linear-gradient(to_right,var(--tw-gradient-stops))] from-[#0f172a] via-[#1e293b] to-[#020617] text-slate-100 flex flex-col mt-2">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-cyan-400 mb-3 sm:mb-0">
        Events
      </h1>
      <div
        className="
          header 
          flex flex-wrap sm:flex-nowrap 
          justify-center sm:justify-between 
          gap-3 sm:gap-4 
          border-b border-slate-700 
          py-3 sm:py-4 
          px-2 sm:px-8
          overflow-x-auto
        "
      >
        {tabs.map((item) => (
          <button
            key={item}
            onClick={(e) => handleClick(e)}
            className={`shrink-0
              px-6 sm:px-6
              py-2 sm:py-2 
              rounded-lg sm:rounded-xl 
              text-sm sm:text-base 
              tracking-wide font-semibold 
              transition-all duration-300 
              ${tab === item
                ? "bg-cyan-400 text-slate-900 shadow-md shadow-cyan-500/30 scale-105"
                : "bg-slate-800 text-slate-200 hover:bg-cyan-500/20 hover:scale-105"
              }
            `}
          >
            {item}
          </button>

        ))}
        {(user?.userType === "Alumni" || user?.userType === "Teacher") && (
          <NavLink
          to="/create_event"
          className="py-2 px-6 bg-white hover:bg-slate-100 text-teal-700 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
            <FaCirclePlus />
          </NavLink>
        )}
      </div>

      {/* Body */}
      <div className="body text-center mt-10 sm:mt-12 text-base sm:text-lg font-medium px-4 sm:px-0">
        {tab === "Upcoming Events" && (
          <div className="animate-fade-in">
            ✨ Upcoming Events will be displayed here...

            <EventCard status={"upcoming"} />
          </div>
        )}
        {tab === "Ongoing Events" && (
          <div className="animate-fade-in">
            🔥 Ongoing Events will be displayed here...
            <EventCard status={"ongoing"} />
          </div>
        )}
        {tab === "Ended Events" && (
          <div className="animate-fade-in">
            🏁 Ended Events will be displayed here...
            <EventCard status={"ended"} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;
