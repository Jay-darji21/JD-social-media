import React, { useState, useEffect } from 'react'
import { Avatar, Badge, Button, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Tab, Tabs, Typography } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/Comment'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Sidebar from '../../Components/Sidebar'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

const Notifications = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Sample notifications data - will be replaced with actual API call
  const sampleNotifications = [
    {
      id: 1,
      type: 'like',
      user: {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        profilePic: 'https://source.unsplash.com/random/100x100/?portrait,1'
      },
      post: {
        id: 101,
        image: 'https://source.unsplash.com/random/300x300/?nature,1'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false
    },
    {
      id: 2,
      type: 'comment',
      user: {
        id: 3,
        firstName: 'Alex',
        lastName: 'Johnson',
        profilePic: 'https://source.unsplash.com/random/100x100/?portrait,2'
      },
      post: {
        id: 102,
        image: 'https://source.unsplash.com/random/300x300/?nature,2'
      },
      comment: 'Great photo! Where was this taken?',
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: true
    },
    {
      id: 3,
      type: 'follow',
      user: {
        id: 4,
        firstName: 'Emily',
        lastName: 'Davis',
        profilePic: 'https://source.unsplash.com/random/100x100/?portrait,3'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false
    },
    {
      id: 4,
      type: 'like',
      user: {
        id: 5,
        firstName: 'Michael',
        lastName: 'Brown',
        profilePic: 'https://source.unsplash.com/random/100x100/?portrait,4'
      },
      post: {
        id: 103,
        image: 'https://source.unsplash.com/random/300x300/?nature,3'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      read: true
    }
  ]
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNotifications(sampleNotifications)
      setLoading(false)
    }, 1000)
    
    // In a real app, you would fetch notifications from the API
    // dispatch(fetchNotifications())
  }, [])
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }
  
  const handleNotificationClick = (notification) => {
    // Mark notification as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    )
    
    // Navigate based on notification type
    if (notification.type === 'follow') {
      navigate(`/profile/${notification.user.id}`)
    } else {
      navigate(`/post/${notification.post.id}`)
    }
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
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <FavoriteIcon color="error" />
      case 'comment':
        return <CommentIcon color="primary" />
      case 'follow':
        return <PersonAddIcon color="success" />
      default:
        return null
    }
  }
  
  const getNotificationText = (notification) => {
    const { type, user, comment } = notification
    const userName = `${user.firstName} ${user.lastName}`
    
    switch (type) {
      case 'like':
        return `${userName} liked your post`
      case 'comment':
        return `${userName} commented: "${comment}"`
      case 'follow':
        return `${userName} started following you`
      default:
        return ''
    }
  }
  
  const filteredNotifications = activeTab === 0 
    ? notifications 
    : notifications.filter(n => !n.read)
  
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-4 max-w-3xl mx-auto">
        <Paper className="mb-4">
          <div className="p-4 border-b">
            <Typography variant="h5" className="font-bold">Notifications</Typography>
          </div>
          
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <Tab label="All" />
            <Tab 
              label={
                <div className="flex items-center">
                  Unread
                  {notifications.filter(n => !n.read).length > 0 && (
                    <Badge 
                      badgeContent={notifications.filter(n => !n.read).length} 
                      color="primary"
                      className="ml-2"
                    />
                  )}
                </div>
              } 
            />
          </Tabs>
          
          {loading ? (
            <div className="p-8 text-center">
              <Typography>Loading notifications...</Typography>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Typography variant="body1" color="text.secondary">
                {activeTab === 0 ? 'No notifications yet' : 'No unread notifications'}
              </Typography>
            </div>
          ) : (
            <List>
              {filteredNotifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem 
                    button 
                    onClick={() => handleNotificationClick(notification)}
                    className={notification.read ? '' : 'bg-blue-50'}
                  >
                    <ListItemAvatar>
                      <Avatar src={notification.user.profilePic}>
                        {notification.user.firstName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <div className="flex items-center">
                          <Typography 
                            variant="body1" 
                            component="span"
                            className={notification.read ? '' : 'font-bold'}
                          >
                            {getNotificationText(notification)}
                          </Typography>
                          <div className="ml-2">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                      }
                      secondary={formatTime(notification.createdAt)}
                    />
                    
                    {notification.post && (
                      <div className="ml-2">
                        <img 
                          src={notification.post.image} 
                          alt="Post" 
                          className="w-12 h-12 object-cover rounded"
                        />
                      </div>
                    )}
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
          
          {filteredNotifications.length > 0 && (
            <div className="p-4 text-center">
              <Button 
                variant="text" 
                color="primary"
                onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
              >
                Mark all as read
              </Button>
            </div>
          )}
        </Paper>
      </div>
    </div>
  )
}

export default Notifications 