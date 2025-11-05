import React from 'react'
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="w-full bg-black/90 backdrop-blur-md text-gray-300 py-8 border-t border-gray-800">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-4">

        {/* Left Text */}
        <div className="text-center md:text-left space-y-2">
          <p className="font-medium">
            © {new Date().getFullYear()} Alumni Meet. All rights reserved.
          </p>
          <p className="text-sm">
            Visit MMIT official{' '}
            <a
              href="https://www.mmitgp.ac.in/"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-500 transition-colors"
            >
              website
            </a>
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
          <p className="text-sm md:mr-4">
            Developed by <span className="font-semibold text-cyan-400">Avinash Chaurasiya</span>
          </p>
          <div className="flex gap-4 text-xl">
            <a
              href="https://www.linkedin.com/in/avinash-chaurasiya-72b648247/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition-transform transform hover:scale-110"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/webdevavi96"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition-transform transform hover:scale-110"
            >
              <FaGithub />
            </a>
            <a
              href="mailto:avinashchaurasiya901@gmail.com"
              className="hover:text-cyan-400 transition-transform transform hover:scale-110"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
