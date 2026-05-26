import React from 'react'

function CustomLoading() {
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <span className="loading loading-spinner loading-lg"></span>

      <h2 className="mt-4 text-lg">
        Redesigning your room...do not refresh
      </h2>
    </div>
  )
}

export default CustomLoading