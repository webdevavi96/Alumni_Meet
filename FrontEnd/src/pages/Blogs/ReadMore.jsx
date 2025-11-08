import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { readMore } from "../../utils/readMore";

function ReadMore() {

    const { state: blog } = useLocation();

    return (
        <div className="w-full min-h-screen bg-[linear-gradient(to_right,var(--tw-gradient-stops))] from-blue-900 via-indigo-900 to-black text-white flex flex-col items-center p-4 sm:p-8">
            {/* Blog Container */}

            <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg shadow-indigo-900/30 p-6 sm:p-10 border border-white/20">
                {/* Blog Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 text-white tracking-tight">
                        {blog.title}
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base italic">
                        ✍️ Written by <span className="font-semibold text-indigo-300">{blog.author.fullName}</span> •{" "}
                        <span className="text-slate-400">Published on {new Date(blog.createdAt).toLocaleDateString()}</span>
                    </p>
                </div>

                {/* Featured Image */}
                <div className="w-full h-64 sm:h-96 rounded-xl overflow-hidden mb-8">
                    <img
                        src={blog.image}
                        alt="Blog Banner"
                        className="w-full h-full object-contain hover:scale-101 transition-transform duration-500"
                    />
                </div>

                {/* Blog Content */}
                <article
                    className="prose prose-invert max-w-none text-gray-100 leading-relaxed text-lg sm:text-xl"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                >
                </article>

                {/* Divider */}
                <div className="w-full h-px bg-white/20 my-10"></div>

                {/* Footer Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-2 rounded-lg font-semibold text-white shadow-md hover:opacity-90 transition-all">
                        💬 View Comments
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReadMore;
