import axios from "axios";

export const updatePassword = async (data) => {
    try {
        return await axios.post(
            "/api/auth/users/chnage-password",
            data,
            { withCredentials: true }
        );
    } catch (error) {
        return error.response;
    }
};

export const updateAvatar = async (formData) => {
    try {
        return await axios.patch(
            "/api/auth/users/update-avatar-image",
            formData,
            {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            }
        );
    } catch (error) {
        return error.response;
    }
};

export const updateCover = async (formData) => {
    try {
        return await axios.patch(
            "/api/auth/users/update-cover-image",
            formData,
            {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            }
        );
    } catch (error) {
        return error.response;
    }
};
