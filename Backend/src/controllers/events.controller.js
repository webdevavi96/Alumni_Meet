import { User } from "../models/user.models.js";
import { Event } from "../models/events.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { sendMail } from "../utils/sendMail.js";

const newEvent = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    console.log(req.user._id)
    if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user Id");
    const user = await User.findById(userId);
    if (!user) throw new ApiError(401, "User not found");
    if (user.userType === "Student") throw new ApiError((403, "Forbiden request"));

    const { title, description, meetingUrl, startTime, eventDate, duration } = req.body;
    if ((!title || !description || !meetingUrl || !startTime || !eventDate || !duration)) throw new ApiError(400, "All fields are required");

    const event = await Event.create({
        title: title,
        description: description,
        meetingUrl: meetingUrl,
        startTime: startTime,
        eventDate: eventDate,
        duration: duration,
        createdBy: req.user?._id,
    });

    if (!event) throw new ApiError(500, "Internal server error");
    return res.status(200).json(new ApiResponse(200, {}, "success"));
});

const updateEvent = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user Id");

    const user = await User.findById(userId);
    if (!user) throw new ApiError(400, "User not found");
    if (user.userType === "Student") throw new ApiError(403, "Access denied");

    const event = await Event.create({
        title: title,
        description: description,
        meetingUrl: meetingUrl,
        startTime: startTime,
        endTime: endTime,
        eventDate: eventDate,
        createdBy: userId
    });
    if (!event) throw new ApiError(500, "Internal server error");
    return res
        .status(200)
        .json(new ApiResponse(200, "success"));
});

const deleteEvent = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user Id");
    const user = await User.findById(userId);
    if (!user) throw new ApiError(401, "User not found");

    const eventId = req.params;
    if (!eventId) throw new ApiError(400, "Invalid event Id");
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) throw new ApiError(501, "Internal server error");
    return res
        .status(200)
        .json(new ApiResponse(200, "success"))
});

const fetchAllEvents = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user Id");
    const { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = "desc" } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const match = {};
    match.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
    ];
    const events = await Event.aggregate([
        { $match: match },
        { $sort: { [sortBy]: sortType == "asc" ? 1 : -1 } },
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "author"
            }
        },
        { $unwind: "$author" },
        {
            $project: {
                title: 1,
                description: 1,
                meetingUrl: 1,
                startTime: 1,
                duration: 1,
                eventDate: 1,
                createdBy: 1,
                "author._id": 1,
                "author.fullName": 1,
                "author.avatar": 1
            }
        },
        { $skip: skip },
        { $limit: limitNum }
    ]);

    const totalEvents = await Event.countDocuments(match);
    if (!totalEvents) throw new ApiError(404, "No events found");
    const totalPages = Math.ceil(totalEvents / limitNum);
    const data = {
        events,
        pagination: {
            totalPages,
            currentPage: pageNum,
            limit: limitNum
        }
    };

    return res
        .status(200)
        .json(new ApiResponse(200, data, "success"));
});

const joinMeeting = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user Id");
    const eventId = req.params.eventId;
    if (!isValidObjectId(eventId)) throw new ApiError(400, "Invalid event Id");
    const event = await Event.findById(eventId);
    if (!event) throw new ApiError(404, "Event not found");
    const meetingUrl = event.meetingUrl;
    return res
        .status(200)
        .json(new ApiResponse(200, meetingUrl, "success"));
});


export { newEvent, updateEvent, deleteEvent, fetchAllEvents, joinMeeting };