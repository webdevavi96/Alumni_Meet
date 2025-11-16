import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import uploadToCloudinary from "../utils/cloudinary.js";

// generating Refresh and Access Token ->
const generateAccessandRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "User not found");

        // make sure these methods return tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // store refresh token in DB
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        console.error("Error generating tokens:", error);
        throw new ApiError(500, "Internal server error. Please try again later.");
    }
};

// Options for cookies security ->
const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
};


// Register controller ->
const registerUser = asyncHandler(async (req, res) => {
    const { userType, fullName, username, email, gender, password } = req.body;
    if ((!userType || !fullName || !username || !email || !gender || !password)) throw new ApiError(400, "All fields are required");

    let userData = {};
    userData.fullName = fullName;
    userData.username = username;
    userData.email = email;
    userData.gender = gender;
    userData.userType = userType;
    userData.password = password;

    if (userType === "Student") {
        const { enrollementNumber, branch, year } = req.body;
        if (!enrollementNumber || !branch || !year) throw new ApiError(400, "All fields are required");
        userData.enrollementNumber = enrollementNumber;
        userData.branch = branch;
        userData.year = year;
    };

    if (userType === "Teacher") {
        const { headOfDepartment, subject, teacherId } = req.body;
        if ((!headOfDepartment || !subject || !teacherId)) throw new ApiError(400, "All fields are required");
        userData.headOfDepartment = headOfDepartment;
        userData.subject = subject;
        userData.teacherId = teacherId;
    };

    if (userType === "Alumni") {
        const { passingYear, branch, jobTitle, company } = req.body;
        if ((!passingYear || !branch || !jobTitle || !company)) throw new ApiError(400, "All Alumni fields are required");
        userData.passingYear = passingYear;
        userData.branch = branch;
        userData.jobTitle = jobTitle;
        userData.company = company;
    };

    const avatarLocalPath = req.files?.avatarImage[0]?.path;
    if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");
    const avatar = await uploadToCloudinary(avatarLocalPath);
    if (!avatar) throw new ApiError(501, "Something went wrong while uploading your avatar image");
    userData.avatar = avatar.url;

    const user = await User.create(userData);
    if (!user) throw new ApiError(500, "Internal server error");
    return res.status(201).json(new ApiResponse(201, "success"));
});


// Login Contrller ->
const logInUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json(new ApiError(400, "Email is required"));
    }
    if (!password) {
        return res.status(400).json(new ApiError(400, "Password is required"));
    }

    // Fetch user and include password if schema hides it
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return res
            .status(404)
            .json(new ApiError(404, "User not found, check your credentials"));
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return res.status(401).json(new ApiError(401, "Incorrect password"));
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);

    // Sanitize user object
    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;
    delete sanitizedUser.refreshToken;

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200,
            { user: sanitizedUser, accessToken, refreshToken },
            "Login success"
        ));
});


// Log out controller ->
const logOutUser = asyncHandler(async (req, res) => {
    // Remove the stored refresh token from DB
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: "" } },
        { new: true }
    );

    // Define cookie clearing options
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true only in production
        sameSite: "None",
    };

    // Clear both access and refresh tokens from cookies
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Logout successful"));
});



//change password ->
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { newPassword, oldPassword } = req.body;
    if (!(newPassword || oldPassword)) throw new ApiError(400, "All fields are required");

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) throw new ApiError(400, "Invalid password");

    await user.save({ validateBeforeSave: false });
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Paaword changed successfully"));
});


// Update Details ->
// const updateUserDetails = asyncHandler(async (req, res) => {
//     const { fullName, email } = req.body;
//     if (!fullName && !email) throw new ApiError(400, "All fields are required");

//     const user = await User.findByIdAndUpdate(
//         req.user?._id,
//         {
//             $set: { fullName, email }
//         },
//         { new: true }).select("-password");

//     return res
//         .status(200)
//         .json(new ApiResponse(200, user, "Account details updated successfully"));

// });


const updateAvatarImage = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) throw new ApiError(400, "Avatar image file is required");

    const avatar = await uploadToCloudinary(avatarLocalPath);
    if (!avatar) throw new ApiError(400, "Error while uploading avatar image");

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { avatar: avatar.url }
        }, { new: true }).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});


// Updating Cover image ->
const updateCrrentCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) throw new ApiError(400, "Cover image file required");

    const coverImage = await uploadToCloudinary(coverImageLocalPath);
    if (!coverImage) throw new ApiError(400, "Error while uploading cover image0");

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { coverImage: coverImage.url }
        }, { new: true }).select("-passowrd");

    return res
        .status(200)
        .json(200, user, "Cover image updated successfully");
});


// Get current user details ->
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Success"))
});

export {
    registerUser,
    logInUser,
    logOutUser,
    changeCurrentPassword,
    // updateUserDetails,
    updateAvatarImage,
    updateCrrentCoverImage,
    getCurrentUser
}