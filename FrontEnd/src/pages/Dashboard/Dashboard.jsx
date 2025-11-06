import React from 'react'

function Dashboard() {
  return (
    <>
      <div className="min-h-screen w-full pt-4 mt-4">
        <div className="header border-b border-slate-300 pb-2">
          <h1>
            Your Dashboard
          </h1>
        </div>
        <div className="flex justify-between">
          <div className="blogs">
            <p>
              All blogs posted by you, will apear here..
            </p>
          </div>
          <div className="events">
            <p>
              All events created by you, will apear here..
            </p>
          </div>
          <div className="followers">
            <p>
              All of your followers will apear here...
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard