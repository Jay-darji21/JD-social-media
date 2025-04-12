import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { 
  Button, 
  Card, 
  IconButton, 
  TextField, 
  Typography,
  CircularProgress
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { createPostAction } from '../../Redux/Post/post.action'

const CreatePost = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [caption, setCaption] = useState('')
  const [mediaFiles, setMediaFiles] = useState([])
  const [preview, setPreview] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleCaptionChange = (e) => {
    setCaption(e.target.value)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setMediaFiles([file])
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
    }
  }

  const handleRemoveFile = () => {
    setMediaFiles([])
    if (preview) {
      URL.revokeObjectURL(preview)
      setPreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (mediaFiles.length === 0 && !caption.trim()) {
      alert('Please add a photo, video, or caption to create a post')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      formData.append('caption', caption)
      if (mediaFiles[0]) {
        formData.append('image', mediaFiles[0])
      }

      const result = await dispatch(createPostAction(formData)).unwrap()
      if (result?.id) {
        navigate(`/post/${result.id}`)
      }
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6">Create New Post</Typography>
          <IconButton onClick={() => navigate(-1)}>
            <CloseIcon />
          </IconButton>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextField
              multiline
              rows={4}
              placeholder="Write a caption..."
              value={caption}
              onChange={handleCaptionChange}
              fullWidth
              variant="outlined"
            />
          </div>

          <div className="mb-4">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded"
                />
                <IconButton
                  className="absolute top-2 right-2 bg-white"
                  onClick={handleRemoveFile}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            ) : (
              <Button
                variant="outlined"
                component="label"
                fullWidth
                className="h-64"
              >
                Upload Photo/Video
                <input
                  type="file"
                  hidden
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                />
              </Button>
            )}
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Share'
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default CreatePost 