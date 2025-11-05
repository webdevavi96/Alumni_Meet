import React from 'react'
import BlueCard from '../../components/Cards/BlueCard'

function Chats() {
  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-r from-blue-900 via-indigo-900 to-black text-white flex flex-col justify-center items-center">
        <BlueCard props={{ title: "Chats", body: "This feature will be available soon." }} />
      </div>
    </>
  )
}

export default Chats