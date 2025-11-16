import { Router } from "express";
import { deleteEvent, fetchAllEvents, newEvent, updateEvent, joinMeeting } from "../controllers/events.controller.js";
import { JWTVerify } from "../middlewares/auth.middleware.js";
import { isStudent } from "../middlewares/user.middleware.js";
import { setNotif, unSetNotif, checkNotif } from "../controllers/notify.controller.js";

const router = Router();

router.route("/").get(
    JWTVerify,
    fetchAllEvents
);
router.route("/create/new/").post(
    JWTVerify,
    isStudent,
    newEvent
);
router.route("/update/:eventId").patch(
    JWTVerify,
    isStudent,
    updateEvent
);
router.route("/delete/:eventId").delete(
    JWTVerify,
    isStudent,
    deleteEvent
);
router.route("/notify/subscribe/:eventId").post(
    JWTVerify,
    setNotif
);
router.route("/notify/unsubscribe/:eventId").post(
    JWTVerify,
    unSetNotif
);
router.route("/notify/check/:eventId").get(
    JWTVerify,
    checkNotif
);
router.route("/join/:eventId").get(
    JWTVerify,
    joinMeeting
);

export default router;