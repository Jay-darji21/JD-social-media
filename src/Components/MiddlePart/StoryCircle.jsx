import React from 'react'
import { Avatar } from '@mui/material'

const StoryCircle = ({ name, image }) => {
  return (
    <div className="cursor-pointer flex flex-col items-center">
      <div className="relative">
        <Avatar 
          src={image} 
          sx={{ width: 60, height: 60, border: '2px solid #E1306C' }}
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 -z-10" style={{ padding: '3px' }}></div>
      </div>
      <p className="text-xs mt-1 truncate w-16 text-center">{name}</p>
    </div>
  )
}

export default StoryCircle 