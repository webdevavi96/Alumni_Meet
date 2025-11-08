import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import { useForm } from "react-hook-form";
import { createEvent } from "../../services/eventServices";

function CreateEvents() {
  const [duration, setDuration] = useState(60);
  const navigate = useNavigate()

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const finalData = { ...data, duration: duration };
    console.log("Event Data:", finalData);
    const res = await createEvent(finalData);
    if (res.status === 200 || res.status === "Success") {
      reset();
      navigate("/events");
    }
  };

  // Convert minutes → hours & mins
  const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs} hr${hrs > 1 ? "s" : ""}` : ""}${mins > 0 ? ` ${mins} min${mins > 1 ? "s" : ""}` : hrs === 0 ? "0 min" : ""
      }`;
  };

  const handleChange = (e) => {
    setDuration(Number(e.target.value));
  };

  return (
    <div className="w-full min-h-screen bg-[linear-gradient(to_right,var(--tw-gradient-stops))] from-blue-900 via-indigo-900 to-black text-white flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mb-2">
          🎉 Create a New Event
        </h1>
        <p className="text-center text-gray-300 mb-6">
          Fill out the details below to schedule your event.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
          {/* Title */}
          <div>
            <label className="block text-gray-300 mb-1 font-medium">
              Event Title
            </label>
            <input
              type="text"
              placeholder="Enter event title"
              className="w-full px-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-400 outline-none"
              {...register("title", { required: "Title is required." })}
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 mb-1 font-medium">Description</label>
            <textarea
              rows="3"
              placeholder="Enter event description"
              className="w-full px-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
              {...register("description", { required: "Description is required." })}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Meeting URL */}
          <div>
            <label className="block text-gray-300 mb-1 font-medium">Meeting URL</label>
            <input
              type="url"
              placeholder="https://example.com/meeting"
              className="w-full px-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-400 outline-none"
              {...register("meetingUrl", { required: "Meeting URL is required." })}
            />
            {errors.meetingUrl && (
              <p className="text-red-400 text-sm mt-1">{errors.meetingUrl.message}</p>
            )}
          </div>

          {/* Date & Time */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-gray-300 mb-1 font-medium">Start Time: (24H Formate)</label>
              <input
                type="time"
                className="w-full px-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-400 outline-none"
                {...register("startTime", { required: "Start time is required." })}
              />
              {errors.startTime && (
                <p className="text-red-400 text-sm mt-1">{errors.startTime.message}</p>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-gray-300 mb-1 font-medium">Event Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-400 outline-none"
                {...register("eventDate", { required: "Date is required." })}
              />
              {errors.eventDate && (
                <p className="text-red-400 text-sm mt-1">{errors.eventDate.message}</p>
              )}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Event Duration:{" "}
              <span className="text-indigo-400 font-semibold">
                {formatDuration(duration)}
              </span>
            </label>
            <input
              type="range"
              min="5"
              max="480"
              step="5"
              value={duration}
              onChange={handleChange}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5m</span>
              <span>4h</span>
              <span>8h</span>
            </div>
          </div>

          {/* Submit */}
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full py-3 mt-4 rounded-lg bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-lg shadow-md hover:opacity-90 transition"
          >
            {isSubmitting ? "Submitting..." : "🚀 Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvents;
