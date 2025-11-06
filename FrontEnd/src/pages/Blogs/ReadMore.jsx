import React from "react";
import { useParams } from "react-router-dom";

function ReadMore() {

    const { blogId } = useParams();

    return (
        <div className="w-full min-h-screen bg-[linear-gradient(to_right,var(--tw-gradient-stops))] from-blue-900 via-indigo-900 to-black text-white flex flex-col items-center p-4 sm:p-8">
            {/* Blog Container */}

            <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg shadow-indigo-900/30 p-6 sm:p-10 border border-white/20">
                {/* Blog Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 text-white tracking-tight">
                        Blog Title Placeholder {blogId}
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base italic">
                        ✍️ Written by <span className="font-semibold text-indigo-300">Author Name</span> •{" "}
                        <span className="text-slate-400">Published on Nov 06, 2025</span>
                    </p>
                </div>

                {/* Featured Image */}
                <div className="w-full h-64 sm:h-96 rounded-xl overflow-hidden mb-8">
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                        alt="Blog Banner"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Blog Content */}
                <article className="prose prose-invert max-w-none text-gray-100 leading-relaxed text-lg sm:text-xl">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
                        vel lorem sit amet nulla ullamcorper fermentum. Cras euismod
                        tristique sapien, vitae gravida orci fermentum vitae. Suspendisse
                        potenti.
                    </p>

                    <p>
                        Nulla facilisi. Donec at lorem nec neque ultricies feugiat. Vivamus
                        commodo, libero ut efficitur laoreet, massa nunc fringilla elit, sit
                        amet faucibus lorem justo at velit. Duis sed mattis risus.
                    </p>

                    <h2>Subheading Example</h2>
                    <p>
                        Donec luctus, justo vel fringilla tincidunt, sapien justo suscipit
                        lorem, ut sagittis erat libero in justo. Suspendisse rutrum, erat in
                        commodo congue, sem nulla aliquet odio, a luctus massa ante at
                        justo.
                    </p>

                    <ul>
                        <li>🚀 Key insight 1</li>
                        <li>💡 Key insight 2</li>
                        <li>🔥 Key insight 3</li>
                    </ul>
                </article>

                {/* Divider */}
                <div className="w-full h-px bg-white/20 my-10"></div>

                {/* Footer Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-gray-300 text-sm">
                        🕒 Estimated reading time: <span className="text-indigo-300">6 min</span>
                    </div>
                    <button className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-2 rounded-lg font-semibold text-white shadow-md hover:opacity-90 transition-all">
                        💬 View Comments
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReadMore;
