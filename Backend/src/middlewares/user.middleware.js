import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const isStudent = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        if (!userId) throw new ApiError(401, "Invalid user Id");
        const user = await User.findById(userId);
        if (!user) throw new ApiError(401, "User does not exist");
        if (user.userType === "Student") throw new ApiError(403, "Access denied");
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        next(new ApiError(401, error?.message || "Invalid user"));
    }
});