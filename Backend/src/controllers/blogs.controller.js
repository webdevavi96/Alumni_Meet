import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.models.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Blog } from "../models/blogs.models.js";
import { User } from "../models/user.models.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose, { isValidObjectId } from "mongoose";

// Utility function to check user type
const checkUserType = async (userId) => {
    if (!isValidObjectId(userId)) return;
    const user = await User.findById(userId);
    if (!user) return;
    return user
};

const postBlog = asyncHandler(async (req, res) => {
    // Getting the blog data from front - end

    // Checking user type for ALUMNI || STUDENT || TEACHER
    const userId = req.user?._id;
    const user = await checkUserType(userId);
    if (!user) return new ApiError(400, "Invalid user Id");
    if (user.userType === "Student") return res.status(402).json(new ApiError(402, "Access denied"));
    const author = user._id;

    const { title, content } = req.body

    // Optional blog Image
    const blogImage = req?.file?.path;
    // Validating the data
    if (!userId) return res.status(400).json(new ApiError(400, "Invalid user Id"));
    if (!(title || content)) return res.status(400).json(new ApiError(400, "ALl fields are required"));

    // Optionaly uploaduing the image on cloud
    let imagePath;
    if (blogImage) {
        imagePath = await uploadToCloudinary(blogImage)
    }
    if (!imagePath) return res.status(501).json(new ApiError(501, "Something went wrong while uploading your image on cloud"));


    const blog = await Blog.create({
        title: title,
        content: content,
        image: imagePath.url,
        createdBy: author
    });

    if (!blog) return res.status(501).json(new ApiError(501, "Internal server error"));
    return res.status(200).json(new ApiResponse(200, "success"));
});

const updateBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) return res.status(400).json(new ApiError(400, "Invalid blog Id"));

    const { title, content } = req.body;
    const blogImage = req.blogImage?.files?.path[0];
    const userId = req.user?._id

    if (!title || !content) return res.status(400).json(new ApiError(400, "All fields are required"));
    if (!userId) return res.status(400).json(new ApiError(400, "Invalid user Id"));

    const user = await checkUserType(userId);
    if (!user) return res.status(404).json(new ApiError(404, "User not found"));
    if (user.userType === "Student") return res.status(402).json(new ApiError(402, "Access deneid"));

    let imagePath;
    if (blogImage) {
        imagePath = await uploadToCloudinary(blogImage)
    };
    if (!imagePath) return res.status(500).json(new ApiError(500, "Something went wrong while uploading your image on cloud"));

    const blog = {
        title: title,
        content: content,
        image: imagePath.url,
        createdBy: user.username
    };
    const updatedBlog = await Blog.findByIdAndUpdate("blogId", blog);
    if (!updatedBlog) return res.status(501).json(new ApiError(501, "Something went wrong while updating your blog"));
    return res.status(200).json(new ApiResponse(200, "success"));
});

const deleteBlog = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!isValidObjectId(userId)) return res.status(400).json(new ApiError(400, "Invalid user Id"));

    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) return res.status(400).json(new ApiError(400, "Invaliid blog Id"));

    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) return res.status(404).json(new ApiError(404, "Blog not found"));
    return res.status(200).json(new ApiResponse(200, "success"));
});

const addCommentOnBlog = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) return res.status(400).json(new ApiError(400, "Invalid user Id"));

    const user = await checkUserType(userId);
    if (!user) return res.status(404).json(new ApiError(404, "User not found"));

    const { content } = req.body;
    const blogId = req.params;
    if (!isValidObjectId(blogId)) return res.status(400).json(new ApiError(400, "Invalid blog Id"));
    if (!content) return res.status(400).json(new ApiError(400, "Comments cant be empty"));

    const comment = await Comment.create({
        author: user.username,
        content: content,
        onBlog: blogId
    });

    if (!comment) return res.status(501).json(new ApiError(501, "Internal server error"));
    return res.status(200).json(new ApiResponse(200, "success"));

});

const likeBlog = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) return res.status(400).json(new ApiError(400, "Invalid user Id"))
    const user = await checkUserType(userId);
    if (!user) return res.status(404).json(new ApiError(404, "User not found"));

    const blogId = req.params;
    if (!blogId) return res.status(400).json(new ApiError(400, "Invalid blog Id"));

    const liked = await Like.create({
        likedOn: blogId,
        likedBy: user.username
    });

    if (!liked) return res.status(500).json(new ApiError(500, "Something went wrong, please try again later"));
    return res.status(200).json(new ApiResponse(200, "success"));

});

const fecthAllBlogs = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const userId = req.user?._id;
    if (!isValidObjectId(userId)) return res.status(400).json(new ApiError(400, "Invalid user Id"));
    const user = await checkUserType(userId);
    if (!user) return res.status(402).json(new ApiError(402, "Access denied"));

    const match = {};
    match.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } }
    ];

    const blogs = await Blog.aggregate([
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
                content: 1,
                image: 1,
                createdBy: 1,
                createdAt: 1,
                "author._id": 1,
                "author.username": 1,
                "author.fullName": 1,
                "author.avatar": 1,
            }
        },
        { $skip: skip },
        { $limit: limitNum }
    ]);

    const totalBlogs = await Blog.countDocuments(match);
    if (!totalBlogs) return res.status(404).json(new ApiError(404, {}, "No blogs found at this time"));

    const totalPages = Math.ceil(totalBlogs / limitNum);

    const data = {
        blogs,
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

const fetchSingleBlog = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!isValidObjectId(userId)) return new ApiError(400, "Invali user Id");
    const user = await checkUserType(userId);
    if (!user) return new ApiError(402, "Access denie");

    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) return new ApiError(400, "Invalid blog Id");

    await Blog.findById(blogId);
    const blog = await Blog.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(blogId) } },
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "author",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                            _id: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                author: { $first: "$author" }
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "likedTo",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "likes.likedBy",
                foreignField: "_id",
                as: "likedByUsers",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                            _id: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                isLikedByCurrentUser: userId
                    ? { $in: [new mongoose.Types.ObjectId(userId), "$likes.likedBy"] }
                    : false,
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "onBlog",
                as: "comments"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "comments.author",
                foreignField: "_id",
                as: "commentByUsers",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatr: 1,
                            _id: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                commentsCount: { $size: "$comments" },
                isCommentedByCurrentUser: userId
                    ? { $in: [new mongoose.Types.ObjectId(userId), "$comments.author"] }
                    : false,
            }
        },
        {
            $project: {
                title: 1,
                content: 1,
                image: 1,
                author: 1,
                likesCount: 1,
                isLikedByCurrentUser: 1,
                commentsCount: 1,
                comments: 1,
                isCommentedByCurrentUser: 1,
                createdAt: 1,
            }
        }
    ]);

    if (!blog) return new ApiError(404, "Page not found");

    return res
        .status(200)
        .json(new ApiResponse(200, blog, "success"));

});

export { postBlog, updateBlog, deleteBlog, addCommentOnBlog, likeBlog, fecthAllBlogs, fetchSingleBlog }