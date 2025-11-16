import axios from "axios";
export const fetchUserDashboard = async (userId) => {
    if (!userId) return;
    try {
        const query = { page: 1, limit: 20, query: "", sortBy: "createdAt", sortType: "desc", userId: userId };
        const response = await axios.get("/api/auth/users/dashboard/", { params: query });
        return response.data;
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
};