import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Divider, IconButton, TextField, Typography } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ShareIcon from '@mui/icons-material/Share'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { format } from 'date-fns'
import Sidebar from '../../Components/Sidebar'
import { likePost, commentOnPost } from '../../Redux/Post/post.reducer'

const PostView = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  
  // Sample post data - will be replaced with actual API call
  const samplePost = {
    id: parseInt(postId),
    image: `https://picsum.photos/800/1000?random=${postId}`,
    user: {
      id: 1,
      username: 'johndoe',
      name: 'John Doe',
      profilePic: 'https://i.pravatar.cc/100?img=1'
    },
    caption: 'Beautiful day in nature! The sun was shining and the birds were singing. #nature #outdoors #photography',
    likes: 245,
    comments: [
      { 
        id: 1, 
        user: { 
          id: 2, 
          username: 'janesmith', 
          profilePic: 'https://i.pravatar.cc/100?img=5' 
        }, 
        text: 'Amazing shot! Where was this taken?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      },
      { 
        id: 2, 
        user: { 
          id: 3, 
          username: 'alexjohnson', 
          profilePic: 'https://i.pravatar.cc/100?img=3' 
        }, 
        text: 'The colors are incredible!',
        createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      },
      { 
        id: 3, 
        user: { 
          id: 4, 
          username: 'emilydavis', 
          profilePic: 'https://i.pravatar.cc/100?img=4' 
        }, 
        text: 'I wish I was there right now!',
        createdAt: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
  }
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPost(samplePost)
      setLoading(false)
    }, 1000)
    
    // In a real app, you would fetch the post from the API
    // dispatch(fetchPost(postId))
    //   .unwrap()
    //   .then(post => {
    //     setLiked(post.likedByMe)
    //     setSaved(post.savedByMe)
    //   })
  }, [postId])
  
  const handleLike = () => {
    setLiked(!liked)
    
    // In a real app, you would dispatch an action to like/unlike the post
    // dispatch(likePost(postId))
  }
  
  const handleSave = () => {
    setSaved(!saved)
    
    // In a real app, you would dispatch an action to save/unsave the post
    // dispatch(savePost(postId))
  }
  
  const handleShare = () => {
    // Implement share functionality
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert('Link copied to clipboard!')
      })
      .catch(err => {
        console.error('Failed to copy link: ', err)
      })
  }
  
  const handleSubmitComment = (e) => {
    e.preventDefault()
    
    if (!commentText.trim()) return
    
    setSubmittingComment(true)
    
    // In a real app, you would dispatch an action to add a comment
    // dispatch(commentOnPost({ postId, content: commentText }))
    //   .unwrap()
    //   .then(() => {
    //     setCommentText('')
    //     setSubmittingComment(false)
    //   })
    //   .catch(error => {
    //     console.error('Failed to add comment:', error)
    //     setSubmittingComment(false)
    //   })
    
    // Simulate API call
    setTimeout(() => {
      const newComment = {
        id: post.comments.length + 1,
        user: {
          id: 5,
          username: 'currentuser',
          profilePic: 'https://i.pravatar.cc/100?img=10'
        },
        text: commentText,
        createdAt: new Date()
      }
      
      setPost({
        ...post,
        comments: [...post.comments, newComment]
      })
      
      setCommentText('')
      setSubmittingComment(false)
    }, 1000)
  }
  
  const formatTime = (date) => {
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)} minutes ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else {
      return format(date, 'MMM d')
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress className="loading-pulse" />
      </div>
    )
  }
  
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-4 max-w-4xl mx-auto">
        <div className="mb-4">
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            className="hover-effect"
          >
            Back
          </Button>
        </div>
        
        <Card className="shadow-lg post-card">
          <CardHeader
            avatar={
              <Avatar 
                src={post.user.profilePic}
                onClick={() => navigate(`/profile/${post.user.id}`)}
                className="cursor-pointer"
              >
                {post.user.name.charAt(0)}
              </Avatar>
            }
            action={
              <IconButton aria-label="settings" className="hover-effect">
                <MoreVertIcon />
              </IconButton>
            }
            title={
              <Typography 
                variant="subtitle1" 
                className="font-semibold cursor-pointer"
                onClick={() => navigate(`/profile/${post.user.id}`)}
              >
                {post.user.username}
              </Typography>
            }
            subheader={formatTime(post.createdAt)}
          />
          
          <CardMedia
            component="img"
            image={post.image}
            alt={post.caption}
            className="post-image"
          />
          
          <CardActions disableSpacing className="flex justify-between">
            <div className="flex space-x-2">
              <IconButton 
                aria-label="like" 
                onClick={handleLike}
                color={liked ? "error" : "default"}
                className="hover-effect"
              >
                {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton 
                aria-label="comment"
                onClick={() => document.getElementById('comment-input').focus()}
                className="hover-effect"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </IconButton>
              <IconButton aria-label="share" onClick={handleShare} className="hover-effect">
                <ShareIcon />
              </IconButton>
            </div>
            <IconButton aria-label="save" onClick={handleSave} className="hover-effect">
              {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </CardActions>
          
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="font-bold">
              {post.likes} likes
            </Typography>
            
            <Typography variant="body2" component="div" className="mt-1">
              <span className="font-bold">{post.user.username}</span> {post.caption}
            </Typography>
            
            <Divider className="my-3" />
            
            <Typography variant="subtitle2" className="mb-2">
              Comments ({post.comments.length})
            </Typography>
            
            <div className="max-h-60 overflow-y-auto mb-4">
              {post.comments.map(comment => (
                <div key={comment.id} className="mb-3">
                  <div className="flex">
                    <Avatar 
                      src={comment.user.profilePic} 
                      className="mr-2"
                      sx={{ width: 32, height: 32 }}
                      onClick={() => navigate(`/profile/${comment.user.id}`)}
                    >
                      {comment.user.username.charAt(0)}
                    </Avatar>
                    <div>
                      <Typography variant="body2" component="div">
                        <span 
                          className="font-bold cursor-pointer hover-effect"
                          onClick={() => navigate(`/profile/${comment.user.id}`)}
                        >
                          {comment.user.username}
                        </span> {comment.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(comment.createdAt)}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSubmitComment}>
              <div className="flex items-center">
                <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                  U
                </Avatar>
                <TextField 
                  id="comment-input"
                  placeholder="Add a comment..." 
                  variant="standard"
                  fullWidth
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={submittingComment}
                />
                <Button 
                  type="submit" 
                  color="primary"
                  disabled={!commentText.trim() || submittingComment}
                >
                  Post
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PostView 