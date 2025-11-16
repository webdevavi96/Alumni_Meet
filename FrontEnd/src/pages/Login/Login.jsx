import { React, useContext, useState } from 'react';
import { useForm } from "react-hook-form"
import { logInUser } from '../../services/authService'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/authContext.jsx';
import Loader from "../../components/Loader/Loader.jsx";
import { toast } from "react-toastify";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";


function Login() {
  const { login } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    try {

      if (!data.email || !data.password) {
        toast.warn("All fields are required");
        return;
      }



      const response = await logInUser(data);
      console.log(response)

      if (response.status === 200) {
        const user = await response.data.user;
        const accessToken = response.data.accessToken;
        login(user, accessToken);
        toast.success("Login successful!");
        reset()
        navigate('/home');
      }

    } catch (error) {
      if (error.status === 401) toast.error("Invalid credentials");
      else if (error.status === 400) toast.warning("All fields are required");
      else toast.error("Something went wrong! Please try again later.");
    }
  };

  if (isSubmitting) return <Loader />

  return (
    <>
      <div className="min-h-screen pt-16 flex items-center justify-center bg-linear-to-r from-gray-900 via-black to-gray-900 px-4">
        <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-6 text-center">Log In</h1>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-300 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                {...register("email", { required: { value: true, message: "This is a required feid." } })}
              />
            </div>
            <div className="relative">
              <label className="block text-gray-300 mb-1">Password</label>
              <input
                type={visible ? "text" : "password"} // 👈 toggle input type
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-400 outline-none pr-10"
                {...register("password", {
                  required: { value: true, message: "This field is required." },
                })}
              />

              {/* 👁️ Toggle Icon */}
              <button
                type="button"
                onClick={() => setVisible((prev) => !prev)}
                className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                {visible ? <IoEyeOutline size={22} /> : <IoEyeOffOutline size={22} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-md font-semibold transition duration-300"
              disabled={isSubmitting}
            >
              Log In
            </button>
          </form>
          <p className="text-gray-400 mt-4 text-center">
            Don't have an account?{' '}
            <a href="/register" className="text-cyan-400 hover:text-cyan-500 transition-colors">
              Register
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
