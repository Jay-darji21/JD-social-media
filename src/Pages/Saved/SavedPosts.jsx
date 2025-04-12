import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Typography, useMediaQuery, useTheme } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import Sidebar from '../../Components/Sidebar'

const SavedPosts = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  
  const [savedPosts, setSavedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Sample saved posts data - will be replaced with actual API call
  const sampleSavedPosts = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    image: `https://picsum.photos/600/600?random=${i}`,
    user: {
      id: Math.floor(Math.random() * 10) + 1,
      username: `user${Math.floor(Math.random() * 100)}`,
      profilePic: `https://i.pravatar.cc/100?img=${i}`
    },
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 50),
    caption: 'Amazing place! #travel #adventure',
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
  }))
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSavedPosts(sampleSavedPosts)
      setLoading(false)
    }, 1000)
    
    // In a real app, you would fetch saved posts from the API
    // dispatch(fetchSavedPosts())
  }, [])
  
  const getCols = () => {
    if (isMobile) return 2
    if (isTablet) return 3
    return 4
  }
  
  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`)
  }
  
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="flex items-center mb-4">
          <BookmarkIcon className="mr-2" />
          <Typography variant="h5" className="font-bold">Saved Posts</Typography>
        </div>
        
        <Typography variant="body2" color="text.secondary" className="mb-4">
          Only you can see what you've saved
        </Typography>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress className="loading-pulse" />
          </div>
        ) : savedPosts.length === 0 ? (
          <div className="text-center my-8">
            <Typography variant="h6" color="text.secondary">
              No saved posts yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Save posts to view them later
            </Typography>
          </div>
        ) : (
          <ImageList cols={getCols()} gap={8}>
            {savedPosts.map((post) => (
              <ImageListItem 
                key={post.id} 
                className="cursor-pointer relative group card"
                onClick={() => handlePostClick(post.id)}
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  loading="lazy"
                  className="w-full h-full object-cover image-hover"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex space-x-4 text-white">
                    <div className="flex items-center">
                      <FavoriteIcon className="mr-1" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <ChatBubbleOutlineIcon className="mr-1" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
                
                <ImageListItemBar
                  title={post.user.username}
                  subtitle={post.caption.length > 30 ? post.caption.substring(0, 30) + '...' : post.caption}
                  actionIcon={
                    <IconButton
                      sx={{ color: 'white' }}
                      aria-label={`info about ${post.user.username}`}
                    >
                      <BookmarkIcon />
                    </IconButton>
                  }
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </div>
    </div>
  )
}

export default SavedPosts 