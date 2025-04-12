import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ShareIcon from '@mui/icons-material/Share'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { likePostAction, unlikePostAction } from '../../Redux/Post/post.action'

const PostCard = ({ post }) => {
  const dispatch = useDispatch()
  const [liked, setLiked] = useState(post?.isLiked || false)
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0)
  const [saved, setSaved] = useState(false)
  const [showComments, setShowComments] = useState(false)
  
  // Sample data - will be replaced with actual data from props
  const samplePost = {
    id: 1,
    user: {
      id: 1,
      username: 'johndoe',
      name: 'John Doe',
      image: 'https://source.unsplash.com/random/100x100/?portrait'
    },
    caption: 'This is a beautiful day! #sunshine #nature',
    image: 'https://source.unsplash.com/random/600x800/?nature',
    likes: 120,
    comments: [
      { id: 1, user: 'janesmith', text: 'Looks amazing!' },
      { id: 2, user: 'alexjohnson', text: 'Great shot!' }
    ],
    createdAt: '2 hours ago'
  }
  
  const handleLike = async () => {
    try {
      setLiked(!liked)
      setLikesCount(prev => liked ? prev - 1 : prev + 1)
      
      const result = await dispatch(likePostAction(post.id)).unwrap()
      // If the API call fails, revert the optimistic update
      if (!result) {
        setLiked(liked)
        setLikesCount(prev => liked ? prev + 1 : prev - 1)
      }
    } catch (error) {
      console.error('Failed to like post:', error)
      // Revert optimistic update on error
      setLiked(liked)
      setLikesCount(prev => liked ? prev + 1 : prev - 1)
    }
  }
  
  const handleSave = () => {
    setSaved(!saved)
  }
  
  const handleComment = () => {
    setShowComments(!showComments)
  }
  
  const actualPost = post || samplePost
  
  return (
    <Card className="w-full max-w-xl shadow-md rounded-lg">
      <CardHeader
        avatar={
          <Avatar 
            src={actualPost.user.image} 
            sx={{ bgcolor: red[500] }}
            aria-label="user profile"
          >
            {actualPost.user.name.charAt(0)}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={actualPost.user.name}
        subheader={actualPost.createdAt}
      />
      
      <CardMedia
        component="img"
        height="400"
        image={actualPost.image}
        alt={actualPost.caption}
        className="object-cover"
      />
      
      <CardActions disableSpacing className="flex justify-between">
        <div className="flex space-x-2">
          <IconButton aria-label="like" onClick={handleLike} color={liked ? "error" : "default"}>
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton aria-label="comment" onClick={handleComment}>
            <ChatBubbleOutlineIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </div>
        <IconButton aria-label="save" onClick={handleSave}>
          {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
      </CardActions>
      
      <CardContent className="pt-0">
        <Typography variant="body2" color="text.secondary" className="font-bold">
          {likesCount} likes
        </Typography>
        <Typography variant="body2" component="div" className="mt-1">
          <span className="font-bold">{actualPost.user.username}</span> {actualPost.caption}
        </Typography>
        
        {/* Comments section */}
        {(showComments || actualPost.comments.length < 3) && (
          <div className="mt-2">
            <Typography variant="body2" color="text.secondary" className="cursor-pointer mb-1">
              View all {actualPost.comments.length} comments
            </Typography>
            {actualPost.comments.slice(0, 2).map(comment => (
              <Typography key={comment.id} variant="body2" component="div" className="mt-1">
                <span className="font-bold">{comment.user}</span> {comment.text}
              </Typography>
            ))}
          </div>
        )}
        
        {/* Comment input */}
        <div className="mt-3 flex items-center">
          <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
            {actualPost.user.name.charAt(0)}
          </Avatar>
          <input 
            type="text" 
            placeholder="Add a comment..." 
            className="w-full bg-transparent outline-none text-sm"
          />
          <button className="text-blue-500 font-semibold text-sm">Post</button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostCard 