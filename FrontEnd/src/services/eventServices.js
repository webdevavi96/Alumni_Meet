import api from "../utils/api.js";

const createEvent = async (event) => {
    if (!event) return;
    try {
        const res = await api.post("/events/create/new/", event);
        return res.data;
    } catch (error) {
        console.error("Error creating event: ", error);
        throw error
    }
};


const updateEvent = async (eventId) => {
    if (!eventId) return;
    try {
        const res = await api.patch(`/events/update/${eventId}`);
        return res.data;
    } catch (error) {
        console.error("update error: ", error);
        throw error;
    }
};


const deleteEvent = async (eventId) => {
    if (!eventId) return;
    try {
        const res = await api.delete(`/events/delete/${eventId}`)
        return res.data;
    } catch (error) {
        console.error("error deletinf: ", error);
        throw error;
    }
};


const subscribeEvent = async (eventId) => {
    if (!eventId) return;
    try {
        const res = await api.get(`/events/notify/subscribe/${eventId}`);
        return res.data;
    } catch (error) {
        console.error("error notify setting: ", error);
        throw error;
    }
};

const unsubscribeEvent = async (eventId) => {
    if (!eventId) return;
    try {
        const res = await api.get(`/events/notify/unsubscribe/${eventId}`);
        return res.data;
    } catch (error) {
        console.error("error in unsibscribing: ", error);
        throw error;
    }
};


const fetchAllEvents = async () => {
    try {
        const queryParams = {
            page: 1,
            limit: 10,
            query: "",
            sortBy: "createdAt",
            sortType: "desc"
        };
        const res = await api.get("/events/", { params: queryParams });
        return res.data;
    } catch (error) {
        console.error("Error fetching events: ", error);
        throw error;
    }
};

export { createEvent, updateEvent, deleteEvent, subscribeEvent, unsubscribeEvent, fetchAllEvents };