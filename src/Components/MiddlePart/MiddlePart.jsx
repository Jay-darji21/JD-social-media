import React from 'react'
import StoryCircle from './StoryCircle'
import { Avatar, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import PostCard from './PostCard';

const MiddlePart = () => {
  return (
    <div className="px-2 flex flex-col items-center">
      {/* Stories Section */}
      <div className="w-full">
        <div className="stories flex space-x-4 p-4 rounded-lg overflow-x-auto">
          {/* Add Story Button */}
          <div className="cursor-pointer flex flex-col items-center">
            <div className="relative">
              <Avatar sx={{ width: 60, height: 60 }}>
                <IconButton>
                  <AddIcon />
                </IconButton>
              </Avatar>
            </div>
            <p className="text-xs mt-1">Add Story</p>
          </div>
          
          {/* Sample Stories - will be replaced with actual data from API */}
          <StoryCircle name="John Doe" />
          <StoryCircle name="Jane Smith" />
          <StoryCircle name="Alex Johnson" />
          <StoryCircle name="Emily Davis" />
          <StoryCircle name="Michael Brown" />
        </div>
      </div>
      
      {/* Posts Section */}
      <div className="w-full mt-5 space-y-5">
        <PostCard />
        <PostCard />
        <PostCard />
      </div>
    </div>
  )
}

export default MiddlePart
