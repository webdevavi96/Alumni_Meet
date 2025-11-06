import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import { useForm, Controller } from "react-hook-form";

function CreateBlog() {
  const editor = useRef(null);

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const config = useMemo(
    () => ({
      readonly: false,
      height: 500,
      width: "100%",
      toolbarSticky: false,
      placeholder: "Start writing your blog...",
      style: {
        background: "linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #000000 100%)",
        color: "#f3f4f6",
        fontSize: "16px",
        lineHeight: "1.7",
        padding: "1.2rem",
        borderRadius: "12px",
      },
      toolbarButtonSize: "large",
    }),
    []
  );


  // Form Submit Handler
  const onSubmit = (data) => {
    console.log("Blog Submitted:", data);
    alert("✅ Blog Submitted! Check console for output.");
  };

  return (
    <div className="w-full min-h-screen bg-[linear-gradient(to_right,var(--tw-gradient-stops))] from-blue-900 via-indigo-900 to-black text-white flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 border border-white/20">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white drop-shadow-lg">
          ✍️ Create New Blog
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full"
        >
          {/* Blog Title Field */}
          <div className="flex flex-col gap-2">
            <label className="block text-gray-300 mb-1">Title</label>
            <input
              {...register("title", { required: "Title is required" })}
              type="text"
              placeholder="Enter your blog title..."
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {errors.title && (
              <p className="text-red-400 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Jodit Editor */}
          <div className="flex flex-col gap-2">
            <label className="block text-gray-300 mb-1">Blog Content</label>

            <Controller
              name="content"
              control={control}
              rules={{ required: "Content cannot be empty" }}
              render={({ field: { onChange, value } }) => (
                <div className="rounded-lg overflow-hidden border border-white/20">
                  <JoditEditor
                    ref={editor}
                    value={value}
                    config={config}
                    onBlur={(newContent) => onChange(newContent)}
                  />
                </div>
              )}
            />
            {errors.content && (
              <p className="text-red-400 text-sm">{errors.content.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 w-full py-3 rounded-lg bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-lg shadow-md hover:opacity-90 transition"
          >
            🚀 Post Blog
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;
