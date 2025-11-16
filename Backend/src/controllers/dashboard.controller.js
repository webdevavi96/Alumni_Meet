import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Blog } from "../models/blogs.models.js";
import { Event } from "../models/events.models.js";
import { isValidObjectId } from "mongoose";

export const getDashboard = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, query = "", sortBy = "createdAt", sortType = "desc", userId } = req.query;

    if (!isValidObjectId(userId)) {
        return res.status(404).json(new ApiError(404, "Invalid user Id"));
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json(new ApiError(404, "User not found"));

    const matchForBlogs = {
        $or: [
            { title: { $regex: query, $options: "i" } },
            { content: { $regex: query, $options: "i" } }
        ]
    };

    const matchForEvents = {
        $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    };

    const lookup = {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "author",
    };

    const blogs = await Blog.aggregate([
        { $match: matchForBlogs },
        { $sort: { [sortBy]: sortType === "asc" ? 1 : -1 } },
        { $lookup: lookup },
        { $unwind: "$author" },
        {
            $project: {
                title: 1,
                content: 1,
                image: 1,
                createdBy: 1,
                createdAt: 1,
                "author._id": 1,
                "author.username": 1,
                "author.fullName": 1,
                "author.avatar": 1
            }
        },
        { $skip: skip },
        { $limit: limitNum }
    ]);

    const events = await Event.aggregate([
        { $match: matchForEvents },
        { $sort: { [sortBy]: sortType === "asc" ? 1 : -1 } },
        { $lookup: lookup },
        {
            $project: {
                title: 1,
                description: 1,
                meetingUrl: 1,
                createdBy: 1,
                startTime: 1,
                duration: 1,
                eventTime: 1,
                eventDate: 1
            }
        },
        { $skip: skip },
        { $limit: limitNum }
    ]);

    const totalBlogs = await Blog.countDocuments(matchForBlogs);
    const totalEvents = await Event.countDocuments(matchForEvents);

    const data = {
        blogs: blogs || [],
        events: events || [],
        pagination: {
            totalBlogs,
            totalEvents,
            totalBlogPages: Math.ceil(totalBlogs / limitNum),
            currentPage: pageNum,
            limit: limitNum
        }
    };

    return res.status(200).json(new ApiResponse(200, data, "Success"));
});
