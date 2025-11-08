import axios from "axios";
import api from "../utils/api";

const postBlog = async (formData, { onProgress, signal } = {}) => {
    if (!formData) return;
    try {
        const response = await axios.post("/api/blogs/post-blog/", formData, {
            withCredentials: true,
            timeout: 5 * 60 * 1000,
            onUploadProgress: (evt) => {
                // evt.total may be undefined in some browsers, in that case fall back to lengthComputable
                if (evt.lengthComputable || evt.total) {
                    const percent = Math.round((evt.loaded * 100) / (evt.total || evt.lengthComputable));
                    onProgress?.(percent);
                } else {
                    // fallback: give bytes sent
                    onProgress?.(Math.round((evt.loaded / 1024))); // KB sent (optional)
                }
            },
            signal, // optional AbortController signal for cancel
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


const fetchAllBlogs = async () => {
    try {
        const query = { page: 1, limit: 20, query: "", sortBy: "createdAt", sortType: "desc" };
        const res = await api.get("/blogs/", { params: query });
        return res.data;
    } catch (error) {
        console.log("Error in fetchAllBlogs service:", error);
        throw error;
    }
};

const fetchSingleBlog = async (blogId) => {
    if (!blogId) return;
    try {
        const res = await axios.get(`/api/blogs/blog/${blogId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.log("Error in fetchSingleBlog service:", error);
        throw error;
    }
};

const updateBlog = async (blogId, blog) => {
    if (!blogId || !blog) return;
    try {
        const response = await axios.post(`/api/blogs/update/${blogId}`, blog, {
            withCredentials: true, headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return response.data;
    } catch (error) {
        console.log("Error in updateBlog service:", error);
        throw error;
    }
};

const deleteBlog = async (blogId) => {
    if (!blogId) return;
    try {
        const response = await axios.delete(`/api/blogs/delete/${blogId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log("Error in deleteBlog service:", error);
        throw error;
    }
};

const addCommentOnBlog = async (blogId, comment) => {
    if (!blogId || !comment) return;
    try {
        const response = await axios.post(`/api/blogs/comment/${blogId}`, { comment }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log("Error in addCommentOnBlog service:", error);
        throw error;
    }
};

const likeBlog = async (blogId) => {
    if (!blogId) return;
    try {
        const response = await axios.post(`/api/blogs/like/${blogId}`, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log("Error in likeBlog service:", error);
        throw error;
    }
};


export { postBlog, fetchAllBlogs, fetchSingleBlog, updateBlog, deleteBlog, addCommentOnBlog, likeBlog };