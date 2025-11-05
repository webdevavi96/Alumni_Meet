// Login, Registration, Logout, Token verification code will be written here ->
import axios from 'axios';

export async function login(data) {
    // Logic for user login
    const response = await axios.post('/api/auth/login', { data });
    return response.data;
}

export async function register(data) {
    // Logic for user registration
    const response = await axios.post('/api/auth/register', { data });
    return response.data;
}

export async function logout() {
    // Logic for user logout
    const response = await axios.post('/api/auth/logout');
    return response.data;
}

export async function contact(data) {
    const response = await axios.post('/api/contact', { data });
    return response.data;
}

