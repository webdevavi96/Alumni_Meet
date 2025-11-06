import { React, useContext } from 'react';
import { useForm } from "react-hook-form"
import { logInUser } from '../../services/authService'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/authContext.jsx';

function Login() {
  const { login } = useContext(AuthContext);
  const Navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {

      if (!data.email || !data.password) {
        alert("All fields are required");
        return;
      }



      const response = await logInUser(data);
      console.log(response)

      if (response.status === 200) {
        const user = await response.data.user;
        const accessToken = response.data.accessToken;
        login(user, accessToken);
        navigate('/home');
      } else {
        console.log(response.status);
      }

    } catch (error) {
      console.error("Login failed:", error);
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
            <div>
              <label className="block text-gray-300 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                {...register("password", { required: { value: true, message: "This is a required feid." } })}

              />
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
