// Navbar.jsx
import React, { useState, useContext } from 'react'
import { AuthContext } from '../../utils/authContext.jsx'
import { NavLink } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'

function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { isAuthenticated } = useContext(AuthContext)
    const toggleMenu = () => setIsOpen(!isOpen)

    const linkClasses = ({ isActive }) =>
        `relative cursor-pointer transition-all duration-300 ${isActive
            ? "text-cyan-400 font-semibold after:w-full"
            : "hover:text-cyan-500 after:w-0"
        } after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-cyan-400 after:transition-all`

    return (
        <nav className="fixed top-0 left-0 w-full h-16 z-50 backdrop-blur-md bg-black/70 text-white shadow-lg">
            <div className="container mx-auto flex justify-between items-center h-full px-6">
                {/* Logo */}

                <div className="logo text-2xl font-extrabold font-serif cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                    Alumni Meet
                </div>

                {/* Desktop Links */}
                {isAuthenticated && (

                    <ul className="hidden md:flex gap-8">
                        <li><NavLink to="/home" className={linkClasses}>Home</NavLink></li>
                        <li><NavLink to="/blogs" className={linkClasses}>Blogs</NavLink></li>
                        <li><NavLink to="/events" className={linkClasses}>Events</NavLink></li>
                        <li><NavLink to="/chats" className={linkClasses}>Chats</NavLink></li>
                        <li><NavLink to="/profile" className={linkClasses}>Profile</NavLink></li>
                    </ul>
                )}

                {/* Auth Buttons */}
                {!isAuthenticated && (
                    <ul className="hidden md:flex gap-4">
                        <li>
                            <NavLink
                                to="/login"
                                className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 transition-all font-semibold"
                            >
                                Log In
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/register"
                                className="px-5 py-2 rounded-full border-2 border-cyan-400 hover:bg-cyan-500 hover:border-cyan-500 transition-all font-semibold"
                            >
                                Register
                            </NavLink>
                        </li>
                    </ul>
                )}

                {/* Mobile Hamburger */}
                <div className="md:hidden flex items-center">
                    <button onClick={toggleMenu} className="text-2xl focus:outline-none">
                        {isOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-black/90 backdrop-blur-md">
                    <ul className="flex flex-col gap-4 px-6 py-4 text-lg">
                        {/* Show these links only when authenticated */}
                        {isAuthenticated && (
                            <>
                                <li>
                                    <NavLink to="/home" className={linkClasses} onClick={toggleMenu}>
                                        Home
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/blogs" className={linkClasses} onClick={toggleMenu}>
                                        Blogs
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/events" className={linkClasses} onClick={toggleMenu}>
                                        Events
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/chats" className={linkClasses} onClick={toggleMenu}>
                                        Chats
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/profile" className={linkClasses} onClick={toggleMenu}>
                                        Profile
                                    </NavLink>
                                </li>

                            </>
                        )}

                        {/* Show login/register only when NOT authenticated */}
                        {!isAuthenticated && (
                            <>
                                <li>
                                    <NavLink
                                        to="/login"
                                        className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 transition-all font-semibold"
                                        onClick={toggleMenu}
                                    >
                                        Log In
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/register"
                                        className="px-5 py-2 rounded-full border-2 border-cyan-400 hover:bg-cyan-500 hover:border-cyan-500 transition-all font-semibold"
                                        onClick={toggleMenu}
                                    >
                                        Register
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}

        </nav >
    )
}

export default Navbar
