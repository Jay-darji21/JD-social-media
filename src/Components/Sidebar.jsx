import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, IconButton, Tooltip, Drawer } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import SearchIcon from '@mui/icons-material/Search'
import MovieIcon from '@mui/icons-material/Movie'
import ChatIcon from '@mui/icons-material/Chat'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import CreateMenu from './CreateMenu'
import { logoutUserAction } from '../Redux/Auth/auth.action'
import { useTheme } from '../Theme/ThemeContext'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { currentUser } = useSelector(state => state.user)
  const { darkMode, toggleDarkMode } = useTheme()
  
  const navigationItems = [
    { icon: <HomeIcon />, label: 'Home', path: '/' },
    { icon: <SearchIcon />, label: 'Search', path: '/search' },
    { icon: <MovieIcon />, label: 'Reels', path: '/reels' },
    { icon: <ChatIcon />, label: 'Messages', path: '/message' },
    { icon: <NotificationsIcon />, label: 'Notifications', path: '/notifications' },
    { icon: <AccountCircleIcon />, label: 'Profile', path: '/profile' },
    { icon: <BookmarkIcon />, label: 'Saved', path: '/saved' }
  ]
  
  const handleNavigation = (path) => {
    navigate(path)
  }
  
  const handleLogout = () => {
    dispatch(logoutUserAction())
    navigate('/auth')
  }
  
  const sidebarContent = (
    <>
      {/* Logo and Theme Toggle */}
      <div className="px-5 mb-8 flex justify-between items-center">
        <Typography variant="h5" className="app-logo">
          JD Socials
        </Typography>
        <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <IconButton onClick={toggleDarkMode} className="hover-effect">
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </div>
      
      {/* Navigation */}
      <List>
        {navigationItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton 
              onClick={() => handleNavigation(item.path)}
              className={`rounded-full mx-2 px-3 hover-effect ${location.pathname === item.path ? 'Mui-selected' : ''}`}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* Create Menu */}
        <ListItem disablePadding>
          <div className="w-full px-3">
            <CreateMenu />
          </div>
        </ListItem>
      </List>
      
      {/* User Profile */}
      <div className="absolute bottom-5 w-full">
        <ListItem disablePadding>
          <ListItemButton 
            className="rounded-full mx-2 px-3 hover-effect"
            onClick={() => handleNavigation('/profile')}
          >
            <ListItemIcon>
              <Avatar src={currentUser?.profilePic || ''} className="border-2">
                {currentUser?.firstName?.charAt(0) || 'U'}
              </Avatar>
            </ListItemIcon>
            <ListItemText primary={currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}` : 'User Name'} />
          </ListItemButton>
        </ListItem>
        
        {/* Settings and Logout */}
        <List>
          <ListItem disablePadding>
            <ListItemButton 
              className={`rounded-full mx-2 px-3 hover-effect ${location.pathname === '/settings' ? 'Mui-selected' : ''}`}
              onClick={() => handleNavigation('/settings')}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              className="rounded-full mx-2 px-3 hover-effect"
              onClick={handleLogout}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </div>
    </>
  )
  
  return (
    <Drawer
      variant="permanent"
      className={darkMode ? 'dark-mode' : ''}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          position: 'static',
          height: '100vh',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  )
}

export default Sidebar
