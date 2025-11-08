import React, { useState } from "react";
import { TbThumbUpFilled, TbThumbUp } from "react-icons/tb";
import { FaCommentDots } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import DOMPurify from "dompurify";

function BlogsCard({ title, content, image, author, date, handlerFn = () => { } }) {
    const [liked, setLiked] = useState(false);
    const imageSrc = typeof image === "string" ? image : image?.url;

    const handleLike = () => setLiked(!liked);

    // 🧼 Sanitize the HTML and truncate safely
    const sanitizedHTML = DOMPurify.sanitize(content || "");
    const truncatedHTML = sanitizedHTML.length > 300
        ? sanitizedHTML.slice(0, 300) + "..."
        : sanitizedHTML;

    return (
        <div className="flex flex-col sm:flex-row w-full max-w-6xl mx-auto bg-[linear-gradient(to_top_right,var(--tw-gradient-stops))] from-green-600 to-teal-500 text-white rounded-2xl p-5 sm:p-6 shadow-lg shadow-green-900/30 hover:shadow-xl hover:shadow-teal-700/30 transition-all duration-300 mt-5">
            {/* Image Section */}
            <div className="w-full sm:w-1/3 mb-4 sm:mb-0 sm:mr-6">
                {image ? (
                    <img
                        src={imageSrc}
                        alt={title || "Blog Image"}
                        className="rounded-xl w-full h-56 sm:h-full object-cover shadow-md"
                    />
                ) : (
                    <div className="w-full h-56 sm:h-full bg-slate-200/30 flex items-center justify-center text-slate-100 italic rounded-xl">
                        Image will be shown here
                    </div>
                )}
            </div>

            {/* Text Section */}
            <div className="flex-1 flex flex-col justify-between">
                {/* Blog Info */}
                <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold mb-2">
                        {title || "Blog Title"}
                    </h2>

                    {/* Render HTML safely */}
                    <div
                        className="prose prose-invert max-w-none text-gray-200 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: truncatedHTML }}
                    />

                    {/* Read More Button */}
                    {content && (
                        <button
                            onClick={handlerFn}
                            className="text-cyan-300 font-semibold underline hover:text-white mt-1"
                        >
                            Read more →
                        </button>
                    )}
                </div>

                {/* Author + Actions */}
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex flex-col sm:flex-row gap-2 text-sm text-slate-200/80">
                        <span>✍️ {author || "Anonymous"}</span>
                        {date && <span>📅 {date}</span>}
                    </div>

                    <div className="flex gap-3 mt-3 sm:mt-0">
                        <button
                            onClick={handleLike}
                            className="bg-white text-teal-700 font-semibold px-4 py-1.5 rounded-lg shadow-md hover:bg-slate-100 transition-all duration-100"
                        >
                            {liked ? <TbThumbUpFilled /> : <TbThumbUp />}
                        </button>
                        <button className="bg-white text-blue-700 font-semibold px-4 py-1.5 rounded-lg shadow-md hover:bg-slate-100 transition-all duration-100">
                            <FaCommentDots />
                        </button>
                        <button className="bg-white text-pink-700 font-semibold px-4 py-1.5 rounded-lg shadow-md hover:bg-slate-100 transition-all duration-100">
                            <IoIosShareAlt />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogsCard;
