import axios from "axios";

export const setReminder = async (eventId) => {
    try {
        const res = await axios.post(`/api/events/notify/subscribe/${eventId}`, { withCredentials: true });
        if (res.status === 201) {
            return res.data;
        }

    } catch (error) {
        throw error;
    }
};

export const unsubscribe = async (eventId) => {
    if (!eventId) conslole.log("No event ID provided");
    try {
        const res = await axios.post(`/api/events/notify/unsubscribe/${eventId}`, { withCredentials: true });
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {
        throw error;
    }
};


export const joinMeeting = async (eventId) => {
    try {
        const res = await axios.get(`/api/events/join/${eventId}`, { withCredentials: true });
        if (res.status === 200) {
            return res.data.data;
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
};


export const getEventStatus = (event) => {
    const now = new Date();

    const startDateTime = new Date(`${event.eventDate}T${event.startTime}`);
    if (startDateTime > now) return "upcoming";

    const isSameDay = startDateTime.toDateString() === now.toDateString();
    if (isSameDay && startDateTime <= now) return "ongoing";

    return "ended";
};
