import React from "react";

function EventCard({
    title,
    description,
    meetingUrl,
    startTime,
    eventDate,
    duration,
    status,
}) {
    // Map statuses to visual themes
    const statusStyles = {
        upcoming: {
            btnText: "⏰ Set Alert",
            color: "from-teal-800 to-black",
            shadow: "shadow-green-800/40",
        },
        ongoing: {
            btnText: "🔥 Join Now",
            color: "from-blue-800 to-indigo-600",
            shadow: "shadow-blue-800/40",
        },
        ended: {
            btnText: "🏁 Event Ended",
            color: "from-red-600 to-rose-500",
            shadow: "shadow-red-800/40",
        },
    };

    const current = statusStyles[status] || statusStyles.upcoming;

    return (
        <div
            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center w-full max-w-7xl mx-auto bg-linear-to-tr ${current.color} text-white rounded-2xl p-5 sm:p-6 shadow-lg ${current.shadow} hover:shadow-xl transition-all duration-300 mt-4`}
        >
            {/* Left Section */}
            <div className="flex-1 text-left space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold mb-1 tracking-tight">
                    {title || "Untitled Event"}
                </h2>

                <p className="text-sm sm:text-base font-medium text-slate-100/90 leading-relaxed">
                    {description ||
                        "Event details will appear here. Stay tuned for updates and announcements!"}
                </p>

                {/* ⏰ Show Date + Time only for Upcoming / Ended */}
                {(status === "upcoming" || status === "ended") && (
                    <div className="mt-3 text-sm font-medium text-slate-200/80">
                        <p>
                            📅 Date:{" "}
                            <span className="font-semibold text-white/95">
                                {eventDate || "Not set"}
                            </span>
                        </p>
                        <p>
                            🕒 Time:{" "}
                            <span className="font-semibold text-white/95">
                                {startTime || "Not set"}
                            </span>
                        </p>
                        {duration && (
                            <p>
                                ⏳ Duration:{" "}
                                <span className="font-semibold text-white/95">
                                    {duration}
                                </span>
                            </p>
                        )}
                    </div>
                )}

                {/* 🔗 Show meeting link only for ongoing events */}
                {status === "ongoing" && meetingUrl && (
                    <div className="mt-3">
                        <a
                            href={meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-white underline hover:text-slate-200 transition"
                        >
                            🔗 Join Meeting
                        </a>
                    </div>
                )}
            </div>

            {/* Right Section (Action Button) */}
            <div className="mt-5 sm:mt-0 sm:ml-6 w-full sm:w-auto flex justify-start sm:justify-end">
                <button
                    disabled={status === "ended"}
                    className={`bg-white text-gray-900 font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-slate-100 hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto`}
                >
                    {current.btnText}
                </button>
            </div>
        </div>
    );
}

export default EventCard;
