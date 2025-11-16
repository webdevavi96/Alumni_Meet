import { getDashboard } from "../controllers/dashboard.controller.js";
import {
    logInUser,
    logOutUser,
    registerUser,
    changeCurrentPassword,
    // updateUserDetails,
    updateAvatarImage,
    updateCrrentCoverImage,
    getCurrentUser
} from "../controllers/registerUser.controller.js";
import { JWTVerify } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/register")
    .post(
        upload.fields([{ name: "avatarImage", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }]), // Injecting middlewere to handel files
        registerUser   // Calling the controller
    );

// Protected routes ->
router.route("/login")
    .post(
        logInUser
    );
router.route("/logout")
    .post(
        JWTVerify,
        logOutUser
    );
// router.route("/update-user-detils")
//     .post(
//         JWTVerify,
//         updateUserDetails

//     );
router.route("/chnage-password")
    .post(
        JWTVerify,
        changeCurrentPassword

    );
router.route("/update-avatar-image")
    .patch(
        JWTVerify,
        upload.fields({ name: "avatar", maxCount: 1 }),
        updateAvatarImage
    );
router.route("/update-cover-image")
    .patch(
        JWTVerify,
        upload.fields({ name: "coverImage", maxCount: 1 }),
        updateCrrentCoverImage
    );

router.route("/")
    .get(
        JWTVerify,
        getCurrentUser
    );

router.route("/dashboard").get(
    JWTVerify,
    getDashboard
)

export default router;