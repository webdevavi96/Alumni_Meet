import React from 'react';
import { useForm } from "react-hook-form";
import { registerUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

function Register() {

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const userType = watch("userType");

    const verifyPassword = (password, confPassword) => {
        if (password !== confPassword) {
            alert("Passwords must match");
            return false;
        }
        return true;
    };

    const onSubmit = async (data) => {
        // Check if any field is empty
        const hasEmptyField = Object.values(data).some(
            (value) => value === "" || value === null || value === undefined
        );

        if (hasEmptyField) {
            alert("All fields are required");
            return;
        }

        if (!verifyPassword(data.password, data.confPassword)) return;


        console.log(data);

        try {
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                console.table(key, data[key])
                formData.append(key, data[key]);
            });

            formData.append("avatarImage", data.avatarImage[0]);

            const res = await registerUser(formData);
            console.log(res);

            navigate("/login")

        } catch (error) {
            console.error(error);
            alert("Something went wrong.");
        }
        reset();

    };


    return (
        <div className="min-h-screen pt-16 flex items-center justify-center bg-gradient-to-r from-gray-900 via-black to-gray-900 px-4">
            <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-10">

                <h1 className="text-4xl font-semibold text-cyan-400 mb-8 text-center">
                    Create Your Account
                </h1>

                <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>

                    {/* SECTION — Personal Details */}
                    <div>
                        <h2 className="text-xl font-medium text-white mb-4 border-b border-gray-600 pb-2">
                            Personal Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>
                                <label className="text-gray-300 block mb-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                    {...register("fullName", { required: true })}
                                />
                            </div>

                            <div>
                                <label className="text-gray-300 block mb-1">Username</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                    {...register("username", { required: true })}
                                />
                            </div>

                            <div>
                                <label className="text-gray-300 block mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                    {...register("email", { required: true })}
                                />
                            </div>

                            <div>
                                <label className="text-gray-300 block mb-1">Gender</label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                    {...register("gender", { required: true })}
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    {/* SECTION — User Type */}
                    <div>
                        <h2 className="text-xl font-medium text-white mb-4 border-b border-gray-600 pb-2">
                            Account Category
                        </h2>

                        <select
                            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                            {...register("userType", { required: true })}
                        >
                            <option value="">Select user type</option>
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Alumni">Alumni</option>
                        </select>
                    </div>

                    {/* EXTRA FIELDS */}
                    {userType && (
                        <div>
                            <h2 className="text-xl font-medium text-white mb-4 border-b border-gray-600 pb-2">
                                {userType} Details
                            </h2>
                            <div className="space-y-5">

                                {userType === "Student" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        <input placeholder="Enrollment Number" {...register("enrollementNumber", { required: true })} className="form-input" />

                                        {/* Branch Select */}
                                        <select {...register("branch", { required: true })} className="form-input">
                                            <option value="">Select Branch</option>
                                            <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                                            <option value="Electronics Engineering">Electronics Engineering</option>
                                            <option value="Electrical Engineering">Electrical Engineering</option>
                                        </select>

                                        <select {...register("year", { required: true })} className="form-input">
                                            <option value="">Select Year</option>
                                            <option value="1st Year">1st Year</option>
                                            <option value="2nd Year">2nd Year</option>
                                            <option value="3rd Year">3rd Year</option>
                                        </select>
                                    </div>
                                )}

                                {userType === "Teacher" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        {/* Head of Department Select */}
                                        <select {...register("headOfDepartment", { required: true })} className="form-input">
                                            <option value="">Select Department</option>
                                            <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                                            <option value="Electronics Engineering">Electronics Engineering</option>
                                            <option value="Electrical Engineering">Electrical Engineering</option>
                                        </select>

                                        <input placeholder="Subject" {...register("subject", { required: true })} className="form-input" />
                                        <input placeholder="Teacher ID" {...register("teacherId", { required: true })} className="form-input" />
                                    </div>
                                )}

                                {userType === "Alumni" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        {/* Passing Year Select */}
                                        <select {...register("passingYear", { required: true })} className="form-input">
                                            <option value="">Select Passing Year</option>
                                            {Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => {
                                                const year = 2000 + i;
                                                return <option key={year} value={year}>{year}</option>;
                                            })}
                                        </select>

                                        {/* Branch Select */}
                                        <select {...register("branch", { required: true })} className="form-input">
                                            <option value="">Select Branch</option>
                                            <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                                            <option value="Electronics Engineering">Electronics Engineering</option>
                                            <option value="Electrical Engineering">Electrical Engineering</option>
                                        </select>

                                        <input placeholder="Job Title" {...register("jobTitle", { required: true })} className="form-input" />
                                        <input placeholder="Company" {...register("company", { required: true })} className="form-input" />
                                    </div>
                                )}

                            </div>


                        </div>
                    )}

                    {/* SECTION — Security */}
                    <div>
                        <h2 className="text-xl font-medium text-white mb-4 border-b border-gray-600 pb-2">
                            Security & Profile
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="file" {...register("avatarImage", { required: true })} className="form-input" />
                            <input type="password" placeholder="Password" {...register("password", { required: true })} className="form-input" />
                            <input type="password" placeholder="Confirm Password" {...register("confPassword", { required: true })} className="form-input" />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg text-lg font-semibold transition">
                        Register Account
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
