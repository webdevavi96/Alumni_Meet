import { Notification } from "../models/notify.models.js";
import { sendMail } from "../utils/sendMail.js";
import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Event } from "../models/events.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const setNotif = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    let { eventId } = req.params;


    if (!isValidObjectId(userId)) throw new ApiError(400, "Missing user Id");
    if (!isValidObjectId(eventId)) throw new ApiError(400, "Missing event Id");

    const user = await User.findById(userId);
    const event = await Event.findById(eventId);
    if (!user) throw new ApiError(404, "User not found");
    if (!event) throw new ApiError(404, "Event not found");

    const existingNotif = await Notification.findOne({
        setBy: userId,
        setOn: eventId
    });
    if (existingNotif) return res.status(200).json(new ApiResponse(200, {isSubscribed: true}, "Notification already set for this event"));

    const saveNotif = await Notification.create({
        setBy: userId,
        setOn: eventId
    });
    if (!saveNotif) throw new ApiError(501, "Internal server error");

    // const sentMail = await sendMail(user, event);
    // if (!sentMail) throw new ApiError(501, "Error while sednig alerts");

    return res
        .status(201)
        .json(new ApiResponse(201, {isSubscribed: true}, "Success"));

});

const unSetNotif = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    let { eventId } = req.params;
    if (!isValidObjectId(userId)) throw new ApiError(400, "Missing user Id");
    if (!isValidObjectId(eventId)) throw new ApiError(400, "Missing event Id");

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const event = await Event.findById(eventId);
    if (!event) throw new ApiError(404, "Event not found");

    const updateNotif = await Notification.findOneAndDelete(
        {
            setBy: userId,
            setOn: eventId
        }
    );
    if (!updateNotif) throw new ApiError(404, "No alerts set for this event");

    // const sentMail = await sendMail(user, event, false);
    // if (!sentMail) throw new ApiError(501, "Error while sending alerts");

    return res
        .status(200)
        .json(new ApiResponse(200, {isSubscribed: false},"Success"));

});

const checkNotif = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const eventId = req.params?.eventId;
    if (!isValidObjectId(userId)) throw new ApiError(400, "Missing user Id");
    if (!isValidObjectId(eventId)) throw new ApiError(400, "Missing event Id");

    const existingNotif = await Notification.findOne({
        setBy: userId,
        setOn: eventId
    });
    return res.status(200).json(new ApiResponse(200, { isSubscribed: existingNotif ? true : false }, "Success"));
});


export { setNotif, unSetNotif, checkNotif };