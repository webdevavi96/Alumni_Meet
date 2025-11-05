// Contact.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form"
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";
import { contact } from "../../services/authService";

function Contact() {

  const [message, setMessage] = useState("")
  const [status, setStatus] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()



  const onSubmit = async (data) => {
    let response = await contact(data)

    if (response.message === "success") {
      setMessage("We have recived your quary and we'll reach you soon.")
      setStatus("success")
    }
    else {
      setMessage("Something went wrong, please try after some time.")
      setStatus("error")
    }
    reset()

  }

  return (
    <>
      <div className="pt-16 min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white flex justify-center items-center px-4">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">

          {/* Left - Contact Info */}
          <div className="space-y-6">
            <h1 className="text-4xl md:mt-10 font-bold font-serif text-cyan-400">
              Get in Touch
            </h1>
            <p className="text-gray-300">
              Have questions or want to connect? Feel free to reach out to us using the form or contact details below.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-cyan-400 text-xl" />
                <span>Mahamaya IT Polytechnic, Maharajganj</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-cyan-400 text-xl" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-cyan-400 text-xl" />
                <span>contact@mmitgp.ac.in</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 text-2xl mt-4">
              <a href="https://www.linkedin.com/in/avinash-chaurasiya" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-transform transform hover:scale-110">
                <FaLinkedin />
              </a>
              <a href="https://github.com/webdevavi96" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-transform transform hover:scale-110">
                <FaGithub />
              </a>
              <a href="mailto:avinashchaurasiya901@gmail.com" className="hover:text-cyan-400 transition-transform transform hover:scale-110">
                <FaEnvelope />
              </a>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Send a Message</h2>

            {status === "success" ? <h3 className="text-green-600">{message}</h3> : <h3 className="text-red-600">{message}</h3>}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block mb-1 text-gray-300">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                  {...register("name", { required: { value: true, message: "This is a required feid." } })}
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                  {...register("email", { required: { value: true, message: "This is a required feid." } })}

                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Message</label>
                <textarea
                  rows="4"
                  placeholder="Write your message..."
                  className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                  {...register("message", { required: { value: true, message: "This is a required feid." } })}

                ></textarea>
              </div>
              <input
                disabled={isSubmitting}
                type="submit"
                value=" Send Message"
                className={`w-full py-2 rounded-md font-semibold transition duration-300 
  ${isSubmitting ? "bg-cyan-200 text-black" : "bg-cyan-500 hover:bg-cyan-600 text-white"}`}

              />

            </form>
          </div>

        </div>
      </div>
    </>
  );
}

export default Contact;
