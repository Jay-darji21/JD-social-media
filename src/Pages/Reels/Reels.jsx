import React, { useState } from 'react'
import { Avatar, IconButton, Typography } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import SendIcon from '@mui/icons-material/Send'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import MusicNoteIcon from '@mui/icons-material/MusicNote'

const Reels = () => {
  // Sample reels data - will be replaced with actual data from API
  const reelsData = [
    {
      id: 1,
      user: {
        id: 1,
        username: 'johndoe',
        profilePic: 'https://source.unsplash.com/random/100x100/?portrait,1'
      },
      video: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
      likes: 1245,
      comments: 89,
      caption: 'Beautiful day in nature! 🌿 #nature #outdoors',
      music: 'Original Audio - johndoe'
    },
    {
      id: 2,
      user: {
        id: 2,
        username: 'janesmith',
        profilePic: 'https://source.unsplash.com/random/100x100/?portrait,2'
      },
      video: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
      likes: 2567,
      comments: 124,
      caption: 'Ocean vibes 🌊 #beach #summer',
      music: 'Summer Hits - Popular Track'
    },
    {
      id: 3,
      user: {
        id: 3,
        username: 'alexjohnson',
        profilePic: 'https://source.unsplash.com/random/100x100/?portrait,3'
      },
      video: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-taking-a-selfie-710-large.mp4',
      likes: 3421,
      comments: 201,
      caption: 'Just another day! 😊 #selfie #fun',
      music: 'Trending Sound - viral'
    }
  ]
  
  const [currentReelIndex, setCurrentReelIndex] = useState(0)
  const [likedReels, setLikedReels] = useState({})
  
  const handleLike = (reelId) => {
    setLikedReels(prev => ({
      ...prev,
      [reelId]: !prev[reelId]
    }))
  }
  
  const handleScroll = (e) => {
    const container = e.currentTarget
    const scrollPosition = container.scrollTop
    const reelHeight = container.clientHeight
    
    const newIndex = Math.round(scrollPosition / reelHeight)
    if (newIndex !== currentReelIndex) {
      setCurrentReelIndex(newIndex)
    }
  }
  
  return (
    <div 
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
      onScroll={handleScroll}
    >
      {reelsData.map((reel, index) => (
        <div 
          key={reel.id} 
          className="h-screen relative snap-start flex items-center justify-center bg-black"
        >
          {/* Video */}
          <video
            src={reel.video}
            className="h-full w-full object-cover"
            autoPlay={index === currentReelIndex}
            loop
            muted={index !== currentReelIndex}
            playsInline
          />
          
          {/* Overlay content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/70 to-transparent">
            {/* User info and caption */}
            <div className="flex items-center mb-3">
              <Avatar src={reel.user.profilePic} className="mr-2" />
              <Typography variant="subtitle1" className="font-bold mr-2">
                {reel.user.username}
              </Typography>
              <IconButton size="small" className="text-white ml-2">
                <MoreHorizIcon />
              </IconButton>
            </div>
            
            <Typography variant="body2" className="mb-3">
              {reel.caption}
            </Typography>
            
            {/* Music */}
            <div className="flex items-center mb-4">
              <MusicNoteIcon fontSize="small" className="mr-2" />
              <Typography variant="caption" className="marquee">
                {reel.music}
              </Typography>
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-4">
            <div className="flex flex-col items-center">
              <IconButton 
                onClick={() => handleLike(reel.id)} 
                className="text-white"
              >
                {likedReels[reel.id] ? (
                  <FavoriteIcon fontSize="large" color="error" />
                ) : (
                  <FavoriteBorderIcon fontSize="large" />
                )}
              </IconButton>
              <Typography variant="caption" className="text-white">
                {reel.likes}
              </Typography>
            </div>
            
            <div className="flex flex-col items-center">
              <IconButton className="text-white">
                <ChatBubbleOutlineIcon fontSize="large" />
              </IconButton>
              <Typography variant="caption" className="text-white">
                {reel.comments}
              </Typography>
            </div>
            
            <div className="flex flex-col items-center">
              <IconButton className="text-white">
                <SendIcon fontSize="large" />
              </IconButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Reels 