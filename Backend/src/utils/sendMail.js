import { ApiError } from "./ApiError.js";
import nodemailer from "nodemailer";

export const sendMail = async (user, data, subscribe = true) => {
    try {
        if (!user || !data) throw new ApiError(404, "User not found");
        const mailTo = user.email;
        const mailFrom = import.meta.env.MAIL_FROM;

        const transporter = nodemailer.createTransport({
            host: import.meta.env.MAIL_HOST,
            port: import.meta.env.MAIL_PORT,
            secure: true,
            auth: {
                user: mailFrom,
                pass: import.meta.env.MAIL_PASS,
            },
        });

        const subject = subscribe
            ? `Notification alerts subscribed for ${data.title}`
            : `Notification alerts un-subscribed for ${data.title}`;

        const text = `
You have ${subscribe ? "subscribed to" : "un-subscribed from"} email notification alerts for "${data.title}" on ${new Date().toLocaleString()}.

Event Details:
- Description: ${data.description}
- Meeting URL: ${data.meetingUrl}
- Start Time: ${data.startTime}
- End Time: ${data.endTime}
- Date: ${data.eventDate}
- Created By: ${data.createdBy}

Thank you,
${data.author}
`;

        await transporter.sendMail({
            from: `"Event Notifier" <${mailFrom}>`,
            to: mailTo,
            subject,
            text
        });

        return true;

    } catch (error) {
        console.log("Mail Error:", error);
        return false;
    }
};
