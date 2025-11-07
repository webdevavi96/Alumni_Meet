import axios from "axios";

const createEvent = async (event) => {
    if (!event) return;
    try {
        const res = await axios.post("/api/events/create/new/", event, {
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error("Error creating event: ", error);
        throw error
    }
};


const updateEvent = async (eventId) => {
    if (!eventId) return;
    try {
        const res = await axios.patch(`/api/events/update/${eventId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.error("update error: ", error);
        throw error;
    }
};


const deleteEvent = async (eventId) => {
    if (!eventId) return;
    try {
        const res = await axios.delete(`/api/events/delete/${eventId}`, { withCredentials: true })
        return res.data;
    } catch (error) {
        console.error("error deletinf: ", error);
        throw error;
    }
};


const subscribeEvent = async (eventId) => {
    if (!eventId) return;
    try {
        const res = await axios.get(`/api/events/notify/subscribe/${eventId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.error("error notify setting: ", error);
        throw error
    }
};

const unsubscribeEvent = async (eventId) => {
    if (!eventId) return;
    try {
        const res = await axios.get(`/api/events/notify/unsubscribe/${eventId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.error("error in unsibscribing: ", error);
        throw error;
    }
};


export { createEvent, updateEvent, deleteEvent, subscribeEvent, unsubscribeEvent };