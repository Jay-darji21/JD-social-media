import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChats, fetchMessages, createMessage, setCurrentChat } from '../../Redux/Message/message.reducer'
import { Avatar, Badge, Button, CircularProgress, Divider, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, TextField, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Sidebar from '../../Components/Sidebar'
import { format } from 'date-fns'

const Message = () => {
  const dispatch = useDispatch()
  const { chats, messages, currentChat, loading } = useSelector(state => state.message)
  const { currentUser } = useSelector(state => state.user)
  
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef(null)
  
  // Fetch chats on component mount
  useEffect(() => {
    dispatch(fetchChats())
  }, [dispatch])
  
  // Fetch messages when current chat changes
  useEffect(() => {
    if (currentChat) {
      dispatch(fetchMessages(currentChat.id))
    }
  }, [currentChat, dispatch])
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])
  
  const handleChatSelect = (chat) => {
    dispatch(setCurrentChat(chat))
  }
  
  const handleSendMessage = (e) => {
    e.preventDefault()
    
    if (!messageText.trim() || !currentChat) return
    
    dispatch(createMessage({
      chatId: currentChat.id,
      content: messageText
    }))
    
    setMessageText('')
  }
  
  const filteredChats = chats.filter(chat => {
    const otherUser = chat.users.find(user => user.id !== currentUser?.id)
    return otherUser?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           otherUser?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  })
  
  // Get the other user in the chat (not the current user)
  const getOtherUser = (chat) => {
    return chat?.users?.find(user => user.id !== currentUser?.id)
  }
  
  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    return format(new Date(timestamp), 'h:mm a')
  }
  
  return (
    <div className="message-section h-screen">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat List */}
        <div className="w-full md:w-1/3 border-r">
          <div className="p-4 border-b">
            <Typography variant="h6" className="font-bold mb-2">Messages</Typography>
            <TextField
              placeholder="Search messages"
              variant="outlined"
              fullWidth
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </div>
          
          {loading && !chats.length ? (
            <div className="flex justify-center items-center h-64">
              <CircularProgress />
            </div>
          ) : (
            <List className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
              {filteredChats.map(chat => {
                const otherUser = getOtherUser(chat)
                const isSelected = currentChat?.id === chat.id
                
                return (
                  <ListItem 
                    key={chat.id} 
                    disablePadding 
                    secondaryAction={
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(chat.lastMessage?.timestamp)}
                      </Typography>
                    }
                  >
                    <ListItemButton 
                      onClick={() => handleChatSelect(chat)}
                      selected={isSelected}
                      className={isSelected ? 'bg-blue-50' : ''}
                    >
                      <ListItemAvatar>
                        <Badge
                          color="success"
                          variant="dot"
                          invisible={!otherUser?.online}
                          overlap="circular"
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                        >
                          <Avatar src={otherUser?.profilePic}>
                            {otherUser?.firstName?.charAt(0)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={`${otherUser?.firstName} ${otherUser?.lastName}`}
                        secondary={chat.lastMessage?.content || 'Start a conversation'}
                        primaryTypographyProps={{
                          fontWeight: chat.unreadCount > 0 ? 'bold' : 'normal'
                        }}
                        secondaryTypographyProps={{
                          noWrap: true,
                          fontWeight: chat.unreadCount > 0 ? 'bold' : 'normal'
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                )
              })}
              
              {filteredChats.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No conversations found
                </div>
              )}
            </List>
          )}
        </div>
        
        {/* Chat Area */}
        <div className="hidden md:flex flex-col w-2/3 h-full">
          {currentChat ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="mr-2" src={getOtherUser(currentChat)?.profilePic}>
                    {getOtherUser(currentChat)?.firstName?.charAt(0)}
                  </Avatar>
                  <div>
                    <Typography variant="subtitle1" className="font-semibold">
                      {`${getOtherUser(currentChat)?.firstName} ${getOtherUser(currentChat)?.lastName}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getOtherUser(currentChat)?.online ? 'Online' : 'Offline'}
                    </Typography>
                  </div>
                </div>
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </div>
              
              {/* Messages */}
              <div 
                className="flex-1 p-4 overflow-y-auto"
                style={{ maxHeight: 'calc(100vh - 200px)' }}
              >
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <CircularProgress />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isCurrentUser = message.sender?.id === currentUser?.id
                      
                      return (
                        <div 
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="flex items-end">
                            {!isCurrentUser && (
                              <Avatar 
                                src={message.sender?.profilePic} 
                                className="mr-2"
                                sx={{ width: 28, height: 28 }}
                              >
                                {message.sender?.firstName?.charAt(0)}
                              </Avatar>
                            )}
                            
                            <div 
                              className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                                isCurrentUser 
                                  ? 'bg-blue-500 text-white rounded-br-none' 
                                  : 'bg-gray-200 rounded-bl-none'
                              }`}
                            >
                              <Typography variant="body2">{message.content}</Typography>
                              <Typography 
                                variant="caption" 
                                className={isCurrentUser ? 'text-blue-100' : 'text-gray-500'}
                                align="right"
                                display="block"
                              >
                                {formatTime(message.timestamp)}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              <div className="p-3 border-t">
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <TextField
                    placeholder="Type a message..."
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <IconButton 
                    color="primary" 
                    type="submit" 
                    disabled={!messageText.trim()}
                    className="ml-2"
                  >
                    <SendIcon />
                  </IconButton>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <img 
                src="/images/message-placeholder.svg" 
                alt="Select a conversation" 
                className="w-48 h-48 mb-4 opacity-50"
              />
              <Typography variant="h6" color="text.secondary">
                Select a conversation
              </Typography>
              <Typography variant="body2" color="text.secondary" className="max-w-md mt-2">
                Choose from your existing conversations or start a new one with someone from your connections.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                className="mt-4"
              >
                New Message
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Message
