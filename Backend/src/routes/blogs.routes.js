import { Router } from "express";
import { JWTVerify } from "../middlewares/auth.middleware.js";
import { postBlog, updateBlog, deleteBlog, addCommentOnBlog, likeBlog, fecthAllBlogs, fetchSingleBlog } from '../controllers/blogs.controller.js';
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// "/" to fetch all blogs with /api/blogs/
router.route("/").get(
    JWTVerify,
    fecthAllBlogs
);
router.route("/post/").post(
    JWTVerify,
    upload.single("blogImage"), 
    postBlog
);
router.route("/update/:blogId").post(
    JWTVerify,
    upload.single("blogImage"),
    updateBlog
);
router.route("/delete/:blogId").delete(
    JWTVerify,
    deleteBlog
);
router.route("/comment/:blogId").post(
    JWTVerify,
    addCommentOnBlog
);
router.route("/like/:blogId").post(
    JWTVerify,
    likeBlog
);
router.route("/blog/:blogId").get(
    JWTVerify,
    fetchSingleBlog
);

export default router;