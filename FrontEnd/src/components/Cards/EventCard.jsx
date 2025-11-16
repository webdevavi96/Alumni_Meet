import React, { useEffect, useState } from "react";
import { setReminder, unsubscribe, joinMeeting } from "../../utils/eventActions";
import { toast } from "react-toastify";
import axios from "axios";

function EventCard({
    title,
    description,
    startTime,
    eventDate,
    duration,
    status,
    eventId
}) {

    const statusStyles = {
        upcoming: {
            btnText: "⏰ Set Alert",
            actionType: "reminder",
            color: "from-teal-800 to-black",
            shadow: "shadow-green-800/40",
        },
        ongoing: {
            btnText: "🔥 Join Now",
            actionType: "join",
            color: "from-blue-800 to-indigo-600",
            shadow: "shadow-blue-800/40",
        },
        ended: {
            btnText: "🏁 Event Ended",
            actionType: "none",
            color: "from-red-600 to-rose-500",
            shadow: "shadow-red-800/40",
        },
    };

    const current = statusStyles[status] || statusStyles.upcoming;
    const [isSubscribed, setIsSubscribed] = useState(false);

    // HANDLE ACTION CLICK
    const handleClick = async () => {
        if (current.actionType === "reminder") {
            const res = await setReminder(eventId);
            if (res.status === 201) {
                setIsSubscribed(res.data.isSubscribed);
                toast.success("Reminder set successfully for this event!");
            }
        }
        else if (current.actionType === "join") {
            const url = await joinMeeting(eventId);
            window.open(url, "_blank");
        }
    };

    // CHECK SUBSCRIPTION STATUS
    const checkIsSubs = async () => {
        try {
            const res = await axios.get(`/api/events/notify/check/${eventId}`, {
                withCredentials: true
            });
            if (res.data.status === 200 || res.data.status === 200) {
                setIsSubscribed(res.data.data.isSubscribed);
            }
        } catch (error) {
            toast.error("Failed to set reminder");
        }
    };

    const handleSubs = async () => {
        try {
            const res = await unsubscribe(eventId);
            if (res.status === 200) {
                setIsSubscribed(res.data.isSubscribed);
                toast.success("Reminder removed successfully from this event!");
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (eventId) checkIsSubs();
    }, [eventId]);

    return (
        <div
            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center w-full max-w-7xl mx-auto bg-linear-to-tr ${current.color} text-white rounded-2xl p-5 sm:p-6 shadow-lg ${current.shadow} hover:shadow-xl transition-all duration-300 mt-4`}
        >
            <div className="flex-1 text-left space-y-2">

                <h2 className="text-xl sm:text-2xl font-extrabold mb-1">{title}</h2>

                <p className="text-sm sm:text-base">
                    {description}
                </p>

                {(status === "upcoming" || status === "ended") && (
                    <div className="mt-3 text-sm">
                        <p>📅 Date: <strong>{eventDate}</strong></p>
                        <p>🕒 Time: <strong>{startTime}</strong></p>
                        {duration && <p>⏳ Duration: <strong>{duration}</strong></p>}
                    </div>
                )}

                {status === "ongoing" && (
                    <div className="mt-3 text-sm">
                        <p>📅 Event is live now!</p>
                    </div>
                )}
            </div>

            {/* ACTION BUTTON */}
            <div className="mt-5 sm:mt-0 sm:ml-6 w-full sm:w-auto flex justify-start sm:justify-end">

                {isSubscribed && status === "upcoming" ? (
                    <button
                        onClick={handleSubs}
                        className="bg-white text-gray-900 font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-slate-100"
                    >
                        Unsubscribe
                    </button>
                ) : (
                    <button
                        onClick={handleClick}
                        disabled={status === "ended"}
                        className="bg-white text-gray-900 font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-slate-100 disabled:opacity-70"
                    >
                        {current.btnText}
                    </button>
                )}

            </div>
        </div>
    );
}

export default EventCard;
