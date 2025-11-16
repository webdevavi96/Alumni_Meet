import React, { useRef, useMemo, useState } from "react";
import JoditEditor from "jodit-react";
import { useForm, Controller } from "react-hook-form";
import { postBlog } from "../../services/blogServices.js";
import { useNavigate } from "react-router-dom";

function CreateBlog() {
  const editor = useRef(null);
  const abortCtrlRef = useRef(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate()

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // Editor config
  const config = useMemo(
    () => ({
      readonly: false,
      height: 500,
      width: "100%",
      toolbarSticky: false,
      placeholder: "Start writing your blog...",
      removeButtons: ["image", "file", "video"],
      uploader: {
        insertImageAsBase64URI: false,
        url: "",
      },
      style: {
        background: "linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #000000 100%)",
        color: "#f3f4f6",
        fontSize: "16px",
        lineHeight: "1.7",
        padding: "1.2rem",
        borderRadius: "12px", // fixed typo
      },
      toolbarButtonSize: "large",
    }),
    []
  );

  // Cancel upload
  const cancelUpload = () => {
    if (abortCtrlRef.current) {
      abortCtrlRef.current.abort();
      abortCtrlRef.current = null;
      setIsUploading(false);
      setUploadPercent(0);
      toast.warn("Upload cancelled");

    }
  };

  // Form Submit Handler
  const onSubmit = async (data) => {
    if (!data) return;

    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.content) formData.append("content", data.content);

    const file = data.blogImage?.[0] ?? data.blogImage;
    if (file) formData.append("blogImage", file);

    // // debug: log entries
    // for (const [k, v] of formData.entries()) {
    //   if (v instanceof File) console.log("FD:", k, v.name, v.size, v.type);
    //   else console.log("FD:", k, v);
    // }

    // prepare abort controller and start upload
    abortCtrlRef.current = new AbortController();
    setIsUploading(true);
    setUploadPercent(0);

    try {
      const response = await postBlog(formData, {
        onProgress: (p) => setUploadPercent(p),
        signal: abortCtrlRef.current.signal,
      });

      // axios response object: response.status, response.data
      if (response?.status === 200 || response?.status === 201) {
        // success
        alert("Blog posted successfully");
        reset();
        navigate("/blogs"); // To navigate on blogs page after successfull upload
      } else {
        console.warn("Unexpected response:", response);
        alert("Something went wrong while posting the blog");
      }
    } catch (error) {
      if (error.name === "CanceledError" || error.name === "AbortError") {
        console.log("upload canceled");
      } else if (error.response) {
        console.error("Upload failed:", error.response.status, error.response.data);
        alert(error.response?.data?.message || "Upload failed");
      } else {
        console.error("Upload failed:", error);
        alert("Upload failed — check console for details");
      }
    } finally {
      setIsUploading(false);
      abortCtrlRef.current = null;
      // keep 100% visible briefly then reset
      setTimeout(() => setUploadPercent(0), 800);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[linear-gradient(to_right,var(--tw-gradient-stops))] from-blue-900 via-indigo-900 to-black text-white flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 border border-white/20">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white drop-shadow-lg">
          ✍️ Create New Blog
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="block text-gray-300 mb-1">Title</label>
            <input
              {...register("title", { required: "Title is required" })}
              type="text"
              placeholder="Enter your blog title..."
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {errors.title && <p className="text-red-400 text-sm">{errors.title.message}</p>}
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
                  <JoditEditor ref={editor} value={value} config={config} onBlur={(newContent) => onChange(newContent)} />
                </div>
              )}
            />
            {errors.content && <p className="text-red-400 text-sm">{errors.content.message}</p>}
          </div>

          {/* Image */}
          <div className="flex flex-col gap-2">
            <label className="block text-gray-300 mb-1">Blog Image</label>
            <input
              {...register("blogImage", { required: "Image is required" })}
              type="file"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {errors.blogImage && <p className="text-red-400 text-sm">{errors.blogImage.message}</p>}
          </div>

          {/* Upload progress UI */}
          {isUploading && (
            <div className="w-full">
              <progress value={uploadPercent} max="100" className="w-full h-2 bg-white/10 rounded" />
              <div className="mt-2 w-full bg-white/10 rounded-lg h-3 overflow-hidden">
                <div
                  className="h-3 rounded-lg transition-all duration-300"
                  style={{ width: `${uploadPercent}%`, background: "linear-gradient(90deg,#06b6d4,#7c3aed)" }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-sm text-white/80">
                <span>{uploadPercent}%</span>
                <button type="button" onClick={cancelUpload} className="text-xs px-2 py-1 bg-red-600/80 rounded">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            disabled={isSubmitting || isUploading}
            type="submit"
            className="mt-4 w-full py-3 rounded-lg bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-lg shadow-md hover:opacity-90 transition"
          >
            {isUploading ? "Uploading..." : "🚀 Post Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;
