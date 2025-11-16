import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AuthContext } from "../../utils/authContext.jsx";
import { updatePassword, updateAvatar, updateCover } from "../../services/updateProfile.js";

function EditProfile() {
    const { user } = useContext(AuthContext);

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPasswordForm,
    } = useForm();

    const {
        register: registerAvatar,
        handleSubmit: handleAvatarSubmit,
        reset: resetAvatarForm,
    } = useForm();

    const {
        register: registerCover,
        handleSubmit: handleCoverSubmit,
        reset: resetCoverForm,
    } = useForm();

    const onPasswordSubmit = async (data) => {
        const res = await updatePassword(data);
        if (res?.status === 200) {
            toast.success("Password updated successfully");
            resetPasswordForm();
        }
    };

    const onAvatarSubmit = async (data) => {
        const formData = new FormData();
        formData.append("avatar", data.avatar[0]);
        const res = await updateAvatar(formData);
        if (res?.status === 200) {
            toast.success("Avatar image updated");
            resetAvatarForm();
        }
    };

    const onCoverSubmit = async (data) => {
        const formData = new FormData();
        formData.append("coverImage", data.coverImage[0]);
        const res = await updateCover(formData);
        if (res?.status === 200) {
            toast.success("Cover image updated");
            resetCoverForm();
        }
    };

    return (
        <div className="min-h-screen w-full px-4 py-8 bg-[linear-gradient(to_right,var(--tw-gradient-stops))] from-[#0f172a] via-[#1e293b] to-[#020617] text-white">
            <h1 className="text-3xl font-extrabold text-cyan-400 tracking-tight border-b border-slate-600 pb-4">
                Edit Profile
            </h1>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* CHANGE PASSWORD */}
                <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl shadow-md border border-slate-700">
                    <h2 className="text-xl font-bold mb-4 text-cyan-300">Change Password</h2>

                    <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
                        <div>
                            <label className="block mb-2 text-sm text-gray-300">Old Password</label>
                            <input
                                type="password"
                                {...registerPassword("oldPassword", { required: true })}
                                className="w-full px-4 py-2 bg-slate-900 rounded-lg border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-gray-300">New Password</label>
                            <input
                                type="password"
                                {...registerPassword("newPassword", { required: true })}
                                className="w-full px-4 py-2 bg-slate-900 rounded-lg border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-cyan-400 text-black font-semibold rounded-lg hover:bg-cyan-300 transition-all"
                        >
                            Update Password
                        </button>
                    </form>
                </div>

                {/* UPDATE AVATAR */}
                <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl shadow-md border border-slate-700">
                    <h2 className="text-xl font-bold mb-4 text-cyan-300">Update Avatar Image</h2>

                    <form onSubmit={handleAvatarSubmit(onAvatarSubmit)} className="space-y-5">
                        <div>
                            <label className="block mb-2 text-sm text-gray-300">Select New Avatar</label>
                            <input
                                type="file"
                                accept="image/*"
                                {...registerAvatar("avatar", { required: true })}
                                className="w-full text-gray-300"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-cyan-400 text-black font-semibold rounded-lg hover:bg-cyan-300 transition-all"
                        >
                            Update Avatar
                        </button>
                    </form>
                </div>

                {/* UPDATE COVER IMAGE */}
                <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl shadow-md border border-slate-700">
                    <h2 className="text-xl font-bold mb-4 text-cyan-300">Update Cover Image</h2>

                    <form onSubmit={handleCoverSubmit(onCoverSubmit)} className="space-y-5">
                        <div>
                            <label className="block mb-2 text-sm text-gray-300">Upload New Cover</label>
                            <input
                                type="file"
                                accept="image/*"
                                {...registerCover("coverImage", { required: true })}
                                className="w-full text-gray-300"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-cyan-400 text-black font-semibold rounded-lg hover:bg-cyan-300 transition-all"
                        >
                            Update Cover
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default EditProfile;
