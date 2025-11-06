import React from "react";

function EventCard({ title, content, date, status }) {
    // Map statuses to consistent color themes
    const statusStyles = {
        upcoming: {
            btnText: "Set Alert",
            color: "text-teal-700",
            icon: "⏰",
        },
        ongoing: {
            btnText: "Join Now",
            color: "text-blue-700",
            icon: "🔥",
        },
        ended: {
            btnText: "Event Ended",
            color: "text-red-700",
            icon: "🏁",
        },
    };

    // Fallback in case of invalid or missing status
    const current = statusStyles[status] || statusStyles.upcoming;

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-7xl mx-auto bg-[linear-gradient(to_top_right,var(--tw-gradient-stops))] from-green-600 to-teal-500 text-white rounded-2xl p-5 sm:p-6 shadow-lg shadow-green-900/30 hover:shadow-xl hover:shadow-teal-700/30 transition-all duration-300 mt-4">
            {/* Left Section */}
            <div className="flex-1 text-left">
                <h2 className="text-xl sm:text-2xl font-extrabold mb-2 tracking-tight">
                    {current.icon} {title || "Event Title"}
                </h2>
                <p className="text-sm sm:text-base font-medium text-slate-100/90 leading-relaxed">
                    {content || "Event details will appear here. Stay tuned for updates and announcements!"}
                </p>
                {date && (
                    <p className="mt-2 text-sm italic text-slate-200/80">
                        📅 {date}
                    </p>
                )}
            </div>

            {/* Right Section (Action Button) */}
            <div className="mt-4 sm:mt-0 sm:ml-4">
                <button
                    disabled={status === "ended"}
                    className={`bg-white ${current.color} font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-slate-100 hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                    {current.btnText}
                </button>
            </div>
        </div>
    );
}

export default EventCard;
