import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blogs.routes.js";
import eventRouter from "./routes/event.routes.js";


// routes declaration
app.use("/api/auth/users", userRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/events", eventRouter);

export { app };