// Login, Registration, Logout, Token verification code will be written here ->
import axios from 'axios';
import api from "../utils/api.js";

export async function logInUser(data) {
    // Logic for user login
    const response = await axios.post("/api/auth/users/login", data,);
    return response.data;
}

export async function registerUser(data) {
    const response = await axios.post(
        "/api/auth/users/register",
        data,
        {
            withCredentials: true
        }
    );
    return response.data;
}

export async function logout() {
    // Logic for user logout
    const response = await api.post('/auth/users/logout', { withCredentials: true });
    return response.data;
}

export async function getUser() {
    const response = await axios.get("/api/auth/users/", { withCredentials: true });
    return response.data;
}

export async function contact(data) {
    const response = await axios.post('/api/contact', { data });
    return response.data;
}

