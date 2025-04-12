import React, { useState, useEffect, useRef } from 'react'
import { Avatar, IconButton, LinearProgress, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useDispatch, useSelector } from 'react-redux'
import { nextStory, prevStory } from '../../Redux/Story/story.reducer'
import { useNavigate } from 'react-router-dom'

const StoryViewer = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentStory, followingStories, viewingUserId } = useSelector(state => state.story)
  
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const progressInterval = useRef(null)
  
  // Get all stories for the current user being viewed
  const userStories = followingStories.filter(
    story => story.user.id === viewingUserId
  )
  
  // Calculate the current story index within the user's stories
  const currentStoryIndex = userStories.findIndex(
    story => story.id === currentStory?.id
  )
  
  // Setup progress bar
  useEffect(() => {
    if (!currentStory) return
    
    // Reset progress when story changes
    setProgress(0)
    
    // Clear any existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
    
    // Set up new interval for progress
    progressInterval.current = setInterval(() => {
      if (!isPaused) {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval.current)
            dispatch(nextStory())
            return 0
          }
          return prev + 0.5
        })
      }
    }, 30)
    
    // Cleanup
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [currentStory, isPaused, dispatch])
  
  const handleClose = () => {
    navigate(-1)
  }
  
  const handleNext = () => {
    dispatch(nextStory())
  }
  
  const handlePrev = () => {
    dispatch(prevStory())
  }
  
  const handlePause = () => {
    setIsPaused(true)
  }
  
  const handleResume = () => {
    setIsPaused(false)
  }
  
  if (!currentStory) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Typography variant="h6" className="text-white">
          No stories available
        </Typography>
      </div>
    )
  }
  
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Close button */}
      <IconButton 
        className="absolute top-4 right-4 text-white z-10"
        onClick={handleClose}
      >
        <CloseIcon />
      </IconButton>
      
      {/* Progress indicators */}
      <div className="absolute top-0 left-0 right-0 flex p-2 gap-1 z-10">
        {userStories.map((story, index) => (
          <LinearProgress
            key={story.id}
            variant="determinate"
            value={index < currentStoryIndex ? 100 : (index === currentStoryIndex ? progress : 0)}
            className="flex-1 rounded-full"
            sx={{ 
              height: 2, 
              backgroundColor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'white'
              }
            }}
          />
        ))}
      </div>
      
      {/* User info */}
      <div className="absolute top-8 left-4 flex items-center z-10">
        <Avatar src={currentStory.user?.profilePic} className="mr-2" />
        <div>
          <Typography variant="subtitle1" className="text-white font-bold">
            {currentStory.user?.username}
          </Typography>
          <Typography variant="caption" className="text-gray-300">
            {new Date(currentStory.timestamps).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1/4 z-10 flex items-center"
        onClick={handlePrev}
      >
        <IconButton className="text-white ml-2">
          <ArrowBackIosNewIcon />
        </IconButton>
      </div>
      
      <div 
        className="absolute right-0 top-0 bottom-0 w-1/4 z-10 flex items-center justify-end"
        onClick={handleNext}
      >
        <IconButton className="text-white mr-2">
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
      
      {/* Story content */}
      <div 
        className="w-full h-full flex items-center justify-center"
        onMouseDown={handlePause}
        onMouseUp={handleResume}
        onTouchStart={handlePause}
        onTouchEnd={handleResume}
      >
        {currentStory.image ? (
          <img 
            src={currentStory.image} 
            alt="Story" 
            className="max-h-full max-w-full object-contain"
          />
        ) : currentStory.video ? (
          <video 
            src={currentStory.video} 
            autoPlay 
            muted={false}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-full h-full flex items-center justify-center">
            <Typography variant="h4" className="text-white text-center p-8">
              {currentStory.caption}
            </Typography>
          </div>
        )}
      </div>
      
      {/* Caption */}
      {currentStory.caption && (currentStory.image || currentStory.video) && (
        <div className="absolute bottom-8 left-0 right-0 text-center px-4">
          <Typography variant="body1" className="text-white bg-black/50 p-2 rounded-lg inline-block">
            {currentStory.caption}
          </Typography>
        </div>
      )}
    </div>
  )
}

export default StoryViewer 