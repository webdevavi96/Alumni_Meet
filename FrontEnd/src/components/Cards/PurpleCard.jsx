import React from 'react'

function PurpleCard({props}) {
  return (
    <div>
        <div className="bg-gradient-to-tr from-purple-700 to-pink-700 p-6 rounded-2xl shadow-xl hover:scale-105 transform transition duration-300">
          <h3 className="text-xl font-bold mb-2">{props.title}</h3>
          <p className="text-gray-200">
            {props.body}
          </p>
        </div>
    </div>
  )
}

export default PurpleCard