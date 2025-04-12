import React, { useState, useRef } from 'react'
import { Button, Card, CardContent, IconButton, TextField, Typography } from '@mui/material'
import ImageIcon from '@mui/icons-material/Image'
import VideocamIcon from '@mui/icons-material/Videocam'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom'

const CreateStory = () => {
  const [caption, setCaption] = useState('')
  const [mediaFile, setMediaFile] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  
  const handleCaptionChange = (e) => {
    setCaption(e.target.value)
  }
  
  const handleMediaChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setMediaFile(file)
      
      // Create preview URL
      const isImage = file.type.startsWith('image/')
      setMediaPreview({
        type: isImage ? 'image' : 'video',
        url: URL.createObjectURL(file)
      })
    }
  }
  
  const removeMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview.url)
    }
    setMediaFile(null)
    setMediaPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!mediaFile) {
      alert('Please add a photo or video to create a story')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Here you would implement the API call to create a story
      // For example:
      // const formData = new FormData()
      // formData.append('caption', caption)
      // formData.append('media', mediaFile)
      // await api.post('/api/story/post', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Success - redirect to home
      navigate('/home')
    } catch (error) {
      console.error('Error creating story:', error)
      alert('Failed to create story. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="shadow-lg">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h5" component="h2">
              Create Story
            </Typography>
            <IconButton onClick={() => navigate('/home')}>
              <CloseIcon />
            </IconButton>
          </div>
          
          <Typography variant="body2" color="text.secondary" className="mb-4">
            Your story will be visible for 24 hours and then automatically deleted.
          </Typography>
          
          <form onSubmit={handleSubmit}>
            {/* Media preview */}
            {mediaPreview && (
              <div className="relative mb-4">
                {mediaPreview.type === 'image' ? (
                  <img 
                    src={mediaPreview.url} 
                    alt="Story preview" 
                    className="w-full h-96 object-cover rounded"
                  />
                ) : (
                  <video 
                    src={mediaPreview.url} 
                    className="w-full h-96 object-cover rounded" 
                    controls
                  />
                )}
                <IconButton 
                  size="small" 
                  className="absolute top-2 right-2 bg-white"
                  onClick={removeMedia}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            )}
            
            {/* Caption input */}
            <TextField
              label="Add a caption..."
              variant="outlined"
              fullWidth
              value={caption}
              onChange={handleCaptionChange}
              className="mb-4"
            />
            
            {/* Media upload buttons */}
            {!mediaPreview && (
              <div className="flex space-x-2 mb-4">
                <Button 
                  variant="outlined" 
                  startIcon={<ImageIcon />}
                  component="label"
                  fullWidth
                >
                  Add Photo
                  <input 
                    type="file" 
                    accept="image/*" 
                    hidden 
                    onChange={handleMediaChange}
                    ref={fileInputRef}
                  />
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<VideocamIcon />}
                  component="label"
                  fullWidth
                >
                  Add Video
                  <input 
                    type="file" 
                    accept="video/*" 
                    hidden 
                    onChange={handleMediaChange}
                    ref={fileInputRef}
                  />
                </Button>
              </div>
            )}
            
            {/* Submit button */}
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              disabled={isSubmitting || !mediaFile}
            >
              {isSubmitting ? 'Posting...' : 'Share to Story'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateStory 