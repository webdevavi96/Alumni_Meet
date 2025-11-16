import React, { useState, useEffect, useContext } from "react";
import { TbThumbUpFilled, TbThumbUp } from "react-icons/tb";
import { FaCommentDots } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import DOMPurify from "dompurify";
import { likeBlog, getLikesOnBlog, fetchComentsOnBlog } from "../../services/blogServices";
import { toast } from "react-toastify";
import { AuthContext } from "../../utils/authContext.jsx";
import { useNavigate } from "react-router-dom"
import { shareBlog } from "../../utils/shareBtn.js";

function BlogsCard({
    id,
    title,
    content,
    image,
    author,
    date,
    handlerFn = () => { },
}) {
    const { user } = useContext(AuthContext);
    const userId = user?._id;
    const navigate = useNavigate()
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [commentsCount, setCommentsCount] = useState(0);

    const imageSrc = typeof image === "string" ? image : image?.url;

    const fetchLikeAndComment = async () => {
        try {
            const res = await getLikesOnBlog(id);
            const comments = await fetchComentsOnBlog(id)

            if (res.status === 200) {
                const { likes, likeCount } = res.data;

                setLikeCount(likeCount);

                // Check if logged user liked this blog
                const userLiked = likes.some(like => like.likedBy._id === userId);
                setLiked(userLiked);
            }

            if (comments.status === 200) {
                setCommentsCount(comments.data.totalComments);
            }
        } catch (error) {
            console.error("Failed to fetch like status:", error);
        }
    };

    useEffect(() => {
        if (id) fetchLikeAndComment();
    }, [id, userId]);

    // Like / Unlike Handler
    const handleLike = async () => {
        if (!userId) {
            toast.error("You must be logged in to like!");
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            const res = await likeBlog(id);

            if (res.status === 200) {
                // Use server value for accuracy
                setLikeCount(res.data.likeCount);
                setLiked(res.data.liked);
            }
        } catch (error) {
            toast.error("Failed to like!");
            // Rollback icon
            setLiked(prev => !prev);
        }

        setLoading(false);
    };

    const handelComment = async () => {
        navigate(`/comments/${id}`);
    }

    // HTML Sanitize & Truncate
    const sanitizedHTML = DOMPurify.sanitize(content || "");
    const truncatedHTML =
        sanitizedHTML.length > 300 ? sanitizedHTML.slice(0, 300) + "..." : sanitizedHTML;

    return (
        <div className="flex flex-col sm:flex-row w-full max-w-6xl mx-auto bg-[linear-gradient(to_top_right,var(--tw-gradient-stops))] from-green-600 to-teal-500 text-white rounded-2xl p-5 sm:p-6 shadow-lg shadow-green-900/30 hover:shadow-xl hover:shadow-teal-700/30 transition-all duration-300 mt-5">

            {/* Image */}
            <div className="w-full sm:w-1/3 mb-4 sm:mb-0 sm:mr-6">
                {image ? (
                    <img src={imageSrc} className="rounded-xl w-full h-56 sm:h-full object-cover shadow-md" />
                ) : (
                    <div className="w-full h-56 sm:h-full bg-slate-200/30 flex items-center justify-center text-slate-100 italic rounded-xl">
                        Image will be shown here
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold mb-2">{title}</h2>
                    <div
                        className="prose prose-invert max-w-none text-gray-200 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: truncatedHTML }}
                    />

                    {content && (
                        <button onClick={handlerFn} className="text-cyan-300 font-semibold underline hover:text-white mt-1">
                            Read more →
                        </button>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">

                    <div className="flex flex-col sm:flex-row gap-2 text-sm text-slate-200/80">
                        <span>✍️ {author || "Anonymous"}</span>
                        {date && <span>📅 {date}</span>}
                    </div>

                    <div className="flex gap-3 mt-3 sm:mt-0">
                        <button
                            onClick={handleLike}
                            disabled={loading}
                            aria-pressed={liked}
                            className="bg-white text-teal-700 font-semibold px-4 py-1.5 rounded-lg shadow-md hover:bg-slate-100 transition-all disabled:opacity-60"
                        >
                            <span className="flex items-center gap-2">
                                {liked ? <TbThumbUpFilled /> : <TbThumbUp />}
                                <span>{likeCount}</span>
                            </span>
                        </button>

                        <button
                            onClick={() => handelComment(id)}
                            className="bg-white text-blue-700 px-4 py-1.5 rounded-lg shadow-md hover:bg-slate-100">
                            <span className="flex items-center gap-2">
                                <FaCommentDots />
                                <span>
                                    {commentsCount}
                                </span>
                            </span>
                        </button>

                        <button
                            onClick={() => {
                                shareBlog(id);
                                toast.success("URL copied")
                            }}
                            className="bg-white text-pink-700 px-4 py-1.5 rounded-lg shadow-md hover:bg-slate-100">
                            <IoIosShareAlt />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogsCard;
