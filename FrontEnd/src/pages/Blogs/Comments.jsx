import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../utils/authContext.jsx";
import { toast } from "react-toastify";
import { fetchComentsOnBlog, addCommentOnBlog } from "../../services/blogServices";

export default function Comments() {
    const { register, handleSubmit, reset } = useForm();
    const { id: blogId } = useParams();
    const { user } = useContext(AuthContext);

    const [comments, setComments] = useState([]);
    const [commentsCount, setCommentsCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Fetch all comments
    const loadComments = async () => {
        try {
            const res = await fetchComentsOnBlog(blogId);
            if (res.status === 200) {
                setComments(res.data.comments);
                setCommentsCount(res.data.totalComments);
            }
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        }
    };

    useEffect(() => {
        loadComments();
    }, [blogId]);

    // Add comment
    const onSubmit = async (data) => {
        if (!user?._id) {
            toast.error("You must be logged in to comment!");
            return;
        }

        if (!data.text.trim()) {
            toast.error("Comment cannot be empty!");
            return;
        }

        setLoading(true);

        try {
            const res = await addCommentOnBlog(blogId, data);

            if (res.status === 200) {
                toast.success("Comment added");
                reset();
                loadComments(); // refresh list
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to post comment");
        }

        setLoading(false);
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 p-6 bg-gradient-to-tr from-blue-700 to-indigo-800 
                        text-white rounded-2xl shadow-xl transform transition duration-300">

            {/* Header */}
            <header className="mb-6 border-b border-white/30 pb-3 flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                    Comments ({commentsCount})
                </h2>
            </header>

            {/* Comments List */}
            <section className="space-y-4 mb-6">
                {comments.length === 0 ? (
                    <p className="text-white/80 italic">No comments yet. Be the first!</p>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment._id}
                            className="bg-slate-300 text-gray-800 p-4 rounded-xl shadow-md flex gap-4"
                        >
                            {/* Avatar */}
                            <img
                                src={comment.author?.avatar || "/default-avatar.png"}
                                alt="avatar"
                                className="w-12 h-12 rounded-full object-cover border"
                            />

                            {/* Comment Content */}
                            <div className="flex-1">
                                <p className="font-semibold text-teal-700">
                                    {comment.author?.username || "Unknown User"}
                                </p>
                                <p className="mt-1">{comment.content}</p>
                                <p className="text-xs mt-2 opacity-60">
                                    {new Date(comment.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </section>

            {/* Add Comment */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-4 rounded-xl shadow-md space-y-3 text-gray-700"
            >
                <textarea
                    {...register("text", { required: true })}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring focus:ring-indigo-300"
                    placeholder="Write your comment..."
                    rows="3"
                ></textarea>

                <button
                    disabled={loading}
                    type="submit"
                    className="bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-indigo-800 disabled:opacity-60"
                >
                    {loading ? "Posting..." : "Add Comment"}
                </button>
            </form>
        </div>
    );
}
