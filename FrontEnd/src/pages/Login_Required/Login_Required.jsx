import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login_Required() {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login'); // Redirects to login page
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-r from-blue-900 via-indigo-900 to-black text-white flex flex-col justify-center items-center">
            <div className="text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                    Login Required
                </h1>
                <p className="text-lg md:text-xl mb-8 text-gray-300">
                    You need to be logged in to access this page.
                </p>
                <button
                    onClick={handleLoginRedirect}
                    className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 font-semibold text-white transition duration-300 shadow-lg"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
}

export default Login_Required;
