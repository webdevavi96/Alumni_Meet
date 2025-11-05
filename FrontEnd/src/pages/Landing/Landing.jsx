import React from 'react'
import { NavLink } from 'react-router-dom'
import { BlueCard, PurpleCard, GreenCard } from '../../components/Components'


function Landing() {

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-blue-900 via-indigo-900 to-black text-white flex flex-col">

      {/* Hero Section */}
      <section className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-4 py-16 md:py-24 md:mt-4 gap-8">

        {/* Left Content */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold font-serif leading-tight">
            Welcome to <span className="text-blue-400">Alumni Meet</span>
          </h1>
          <h2 className="text-lg md:text-xl text-gray-300">
            A platform to connect students with their alumni for guidance.
          </h2>
          <p className="text-gray-400">
            The Alumni Meet Web App is a dedicated platform connecting students, faculty, and alumni of Mahamaya IT Polytechnic Maharajganj. Create your profile, explore connections, and gain valuable insights for your career and studies.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-4">
            <NavLink 
            to='/home'
            className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 font-semibold text-white transition duration-300 shadow-lg">
              Explore
            </NavLink>
            <NavLink
              to="/contact"
              className="px-6 py-3 rounded-full border-2 border-blue-400 hover:bg-blue-600 transition duration-300 font-semibold text-white"
            >
              Contact Us
            </NavLink>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex justify-center md:justify-end mt-2.5 pt-4">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-xl overflow-hidden shadow-2xl">
            <img
              src="/icons/mmit_logo.png"
              alt="MMIT Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* Features / Info Cards Section */}
      <section className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-6">
        <BlueCard props={{ title: "Connect", body: "Connect with alumni and students seamlessly through your personalized profile." }} />
        <PurpleCard props={{ title: "Guide", body: "Seek guidance from experienced alumni and mentors to boost your career." }} />
        <GreenCard props={{ title: "Engage", body: " Participate in events, workshops, and discussions to enhance your learning." }} />
      </section>

    </div>
  )
}

export default Landing
