import React, { useState, useEffect } from 'react'
import { CircularProgress, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Typography, useMediaQuery, useTheme } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import Sidebar from '../../Components/Sidebar'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Sample posts data - will be replaced with actual API call
  const samplePosts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    image: `https://picsum.photos/600/600?random=${i + 20}`,
    user: {
      id: Math.floor(Math.random() * 10) + 1,
      username: `user${Math.floor(Math.random() * 100)}`,
      profilePic: `https://i.pravatar.cc/100?img=${i + 20}`
    },
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 50),
    caption: 'Beautiful day! #explore #nature',
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
  }))
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts(samplePosts)
      setLoading(false)
    }, 1000)
    
    // In a real app, you would fetch posts from the API
    // dispatch(fetchExplorePosts())
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
        <Typography variant="h5" className="font-bold mb-4">Home</Typography>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress className="loading-pulse" />
          </div>
        ) : (
          <ImageList cols={getCols()} gap={8}>
            {posts.map((post) => (
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
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </div>
    </div>
  )
}

export default Home 