import React from "react";

function Loader() {
  return (
    <div className="h-screen w-full bg-black flex flex-col justify-center items-center">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white mt-4 text-lg font-medium">Loading...</p>
    </div>
  );
}

export default Loader;
