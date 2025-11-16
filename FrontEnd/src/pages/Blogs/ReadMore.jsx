import React, { useEffect, useState, useContext } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { likeBlog, getLikesOnBlog, fetchComentsOnBlog, fetchSingleBlog } from "../../services/blogServices";
import { FaCommentDots } from "react-icons/fa";
import { TbThumbUp, TbThumbUpFilled } from "react-icons/tb";
import { IoIosShareAlt } from "react-icons/io";
import Loader from "../../components/Loader/Loader.jsx";
import { AuthContext } from "../../utils/authContext";
import { shareBlog } from "../../utils/shareBtn";
import { toast } from "react-toastify";

function ReadMore() {
    const { user } = useContext(AuthContext);
    const { state } = useLocation();
    const { blogId } = useParams();
    const navigate = useNavigate();

    const userId = user?._id;

    // The blog can come from navigation state OR API
    const [blog, setBlog] = useState(state || null);
    const [loadingBlog, setLoadingBlog] = useState(!state); // fetch only if no state

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loadingLike, setLoadingLike] = useState(false);
    const [commentsCount, setCommentsCount] = useState(0);

    // Fetch blog if loaded directly
    const loadBlog = async () => {
        try {
            const res = await fetchSingleBlog(blogId);
            setBlog(res.data);
        } catch (error) {
            console.error("Failed to fetch blog:", error);
            toast.error("Failed to load blog!");
        } finally {
            setLoadingBlog(false);
        }
    };

    useEffect(() => {
        if (!state) {
            loadBlog();
        }
    }, [blogId]);


    // Fetch likes and comments
    const fetchLikeAndComment = async () => {
        try {
            const res = await getLikesOnBlog(blogId);
            const comments = await fetchComentsOnBlog(blogId);

            if (res.status === 200) {
                const { likes, likeCount } = res.data;
                setLikeCount(likeCount);

                const userLiked = likes.some(like => like.likedBy._id === userId);
                setLiked(userLiked);
            }

            if (comments.status === 200) {
                setCommentsCount(comments.data.totalComments);
            }
        } catch (error) {
            console.error("Failed to fetch like/comment:", error);
        }
    };

    useEffect(() => {
        if (blogId) fetchLikeAndComment();
    }, [blogId, userId]);


    // Like handler
    const handleLike = async () => {
        if (!userId) {
            toast.error("You must be logged in to like!");
            return;
        }

        if (loadingLike) return;
        setLoadingLike(true);

        try {
            const res = await likeBlog(blogId);

            if (res.status === 200) {
                setLikeCount(res.data.likeCount);
                setLiked(res.data.liked);
            }
        } catch (error) {
            toast.error("Failed to like!");
            setLiked(prev => !prev);
        }

        setLoadingLike(false);
    };


    // Navigate to comment page
    const handelComment = () => {
        navigate(`/comments/${blogId}`);
    };


    // UI: Loading screen
    if (loadingBlog) {
        return <Loader />;
    }

    // UI: Blog not found
    if (!blog) {
        return (
            <div className="text-red-400 text-center py-20 text-3xl">
                Blog not found.
            </div>
        );
    }


    // Main UI
    return (
        <div className="w-full min-h-screen bg-[linear-gradient(to_right,var(--tw-gradient-stops))] from-blue-900 via-indigo-900 to-black text-white flex flex-col items-center p-4 sm:p-8">

            <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg shadow-indigo-900/30 p-6 sm:p-10 border border-white/20">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
                        {blog.title}
                    </h1>
                    <p className="text-gray-300 italic">
                        ✍️ Written by <span className="font-semibold text-indigo-300">{blog.author.fullName}</span> •{" "}
                        <span className="text-slate-400">Published on {new Date(blog.createdAt).toLocaleDateString()}</span>
                    </p>
                </div>

                {/* Image */}
                <div className="w-full h-64 sm:h-96 rounded-xl overflow-hidden mb-8">
                    <img
                        src={blog.image}
                        alt="Blog Banner"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Content */}
                <article
                    className="prose prose-invert max-w-none text-gray-100 leading-relaxed text-lg sm:text-xl"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                <div className="w-full h-px bg-white/20 my-10"></div>

                {/* Actions */}
                <div className="flex gap-3">

                    <button
                        onClick={handleLike}
                        disabled={loadingLike}
                        className="bg-white text-teal-700 font-semibold px-4 py-1.5 rounded-lg shadow-md hover:bg-slate-100 disabled:opacity-60">
                        <span className="flex items-center gap-2">
                            {liked ? <TbThumbUpFilled /> : <TbThumbUp />}
                            <span>{likeCount}</span>
                        </span>
                    </button>

                    <button
                        onClick={handelComment}
                        className="bg-white text-blue-700 px-4 py-1.5 rounded-lg shadow-md hover:bg-slate-100">
                        <span className="flex items-center gap-2">
                            <FaCommentDots />
                            <span>{commentsCount}</span>
                        </span>
                    </button>

                    <button
                        onClick={() => {
                            shareBlog(blogId);
                            toast.success("URL copied")
                        }}
                        className="bg-white text-pink-700 px-4 py-1.5 rounded-lg shadow-md hover:bg-slate-100">
                        <IoIosShareAlt />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReadMore;
