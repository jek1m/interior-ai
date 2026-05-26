"use client"

import React, { useState } from 'react'

function DesignType({ selectedDesignType }) {
  const [selectedOption, setSelectedOption] = useState(null)

  const designs = [
    {
      name: 'Americana',
      image: '/americana.jpg',
    },
    {
      name: 'Farmhouse',
      image: '/farmhouse.jpg',
    },
    {
      name: 'Bohemian',
      image: '/bohemian.jpg',
    },
    {
      name: 'Maximalist',
      image: '/maximalist.jpg',
    },
    {
      name: 'Neo-industrial',
      image: '/neo-industrial.jpg',
    },
    {
      name: 'Scandinavian',
      image: '/scandinavian.jpg',
    },
    {
      name: 'Minimalist',
      image: '/minimalist.jpg',
    },
  ]

  return (
    <div className="mt-5">
      <label>Select Interior Design Type</label>

      <div className="grid grid-cols-4 gap-4 mt-2">
        {designs.map((design, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedOption(design.name)
              selectedDesignType(design.name)
            }}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div
              className={`aspect-square w-full relative overflow-hidden rounded-lg ${
                selectedOption === design.name ? 'ring-4 ring-blue-500' : ''
              }`}
            >
              <img
                src={design.image}
                alt={design.name}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>

            <h2 className="text-center mt-2 font-medium">
              {design.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DesignType