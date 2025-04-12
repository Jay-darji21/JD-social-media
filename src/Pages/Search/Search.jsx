import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchUsers, clearSearchResults } from '../../Redux/User/user.reducer'
import { createChat } from '../../Redux/Message/message.reducer'
import { Avatar, Button, CircularProgress, Divider, Grid, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import ChatIcon from '@mui/icons-material/Chat'
import Sidebar from '../../Components/Sidebar'
import { useNavigate } from 'react-router-dom'
import { followUser, unfollowUser } from '../../Redux/User/user.reducer'

const Search = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { searchResults, loading, currentUser } = useSelector(state => state.user)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  
  // Debounce search query
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 500)
    
    return () => {
      clearTimeout(timerId)
    }
  }, [searchQuery])
  
  // Search users when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      dispatch(searchUsers(debouncedQuery))
    } else {
      dispatch(clearSearchResults())
    }
  }, [debouncedQuery, dispatch])
  
  // Clear search results when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearSearchResults())
    }
  }, [dispatch])
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }
  
  const handleFollowToggle = (userId, isFollowing) => {
    if (isFollowing) {
      dispatch(unfollowUser(userId))
    } else {
      dispatch(followUser(userId))
    }
  }
  
  const handleStartChat = (userId) => {
    dispatch(createChat(userId))
      .unwrap()
      .then(() => {
        navigate('/message')
      })
      .catch(error => {
        console.error('Failed to create chat:', error)
      })
  }
  
  const isFollowing = (userId) => {
    return currentUser?.followings?.includes(userId)
  }
  
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-4">
        <Paper className="p-4 mb-4">
          <Typography variant="h5" className="mb-4">Search Users</Typography>
          
          <TextField
            placeholder="Search by name, username, or email"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Paper>
        
        {loading ? (
          <div className="flex justify-center my-8">
            <CircularProgress />
          </div>
        ) : searchResults.length > 0 ? (
          <Paper>
            <List>
              {searchResults.map((user) => (
                <React.Fragment key={user.id}>
                  <ListItem
                    secondaryAction={
                      <div className="flex space-x-2">
                        <IconButton 
                          edge="end" 
                          color="primary"
                          onClick={() => handleStartChat(user.id)}
                        >
                          <ChatIcon />
                        </IconButton>
                        
                        <Button
                          variant={isFollowing(user.id) ? "outlined" : "contained"}
                          color="primary"
                          size="small"
                          startIcon={isFollowing(user.id) ? <PersonRemoveIcon /> : <PersonAddIcon />}
                          onClick={() => handleFollowToggle(user.id, isFollowing(user.id))}
                        >
                          {isFollowing(user.id) ? 'Unfollow' : 'Follow'}
                        </Button>
                      </div>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={user.profilePic}>
                        {user.firstName?.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${user.firstName} ${user.lastName}`}
                      secondary={`@${user.username || user.email}`}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        ) : debouncedQuery ? (
          <div className="text-center my-8">
            <Typography variant="h6" color="text.secondary">
              No users found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try a different search term
            </Typography>
          </div>
        ) : (
          <div className="text-center my-8">
            <Typography variant="h6" color="text.secondary">
              Search for users
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Find people to follow and connect with
            </Typography>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search 