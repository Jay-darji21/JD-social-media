import React, { useState } from 'react'
import { Avatar, Box, Button, Card, CardContent, Divider, FormControlLabel, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch, TextField, Typography } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LockIcon from '@mui/icons-material/Lock'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'
import SecurityIcon from '@mui/icons-material/Security'
import HelpIcon from '@mui/icons-material/Help'
import InfoIcon from '@mui/icons-material/Info'
import Sidebar from '../../Components/Sidebar'
import { useTheme } from '../../Theme/ThemeContext'

const Settings = () => {
  const [activeSection, setActiveSection] = useState('account')
  const [formData, setFormData] = useState({
    name: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    bio: 'Software developer and photography enthusiast',
    website: 'https://johndoe.com',
    phone: '+1 (555) 123-4567',
    gender: 'Male',
    darkMode: true,
    emailNotifications: true,
    pushNotifications: true,
    messageNotifications: true,
    postNotifications: true,
    accountPrivate: false
  })

  const { darkMode, toggleDarkMode } = useTheme()

  const handleChange = (e) => {
    const { name, value, checked } = e.target
    setFormData({
      ...formData,
      [name]: e.target.type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would send the updated data to the server
    console.log('Updated settings:', formData)
    // Show success message
    alert('Settings updated successfully!')
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'account':
        return (
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" className="mb-4">Account Information</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} className="flex flex-col items-center">
                <Avatar
                  src="https://source.unsplash.com/random/100x100/?portrait"
                  alt={formData.name}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Button variant="outlined" className="mb-2">Change Photo</Button>
                <Button variant="text" color="error" size="small">Remove</Button>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      multiline
                      rows={3}
                      value={formData.bio}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            
            <Box className="mt-4 flex justify-end">
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </Box>
          </form>
        )
      
      case 'password':
        return (
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" className="mb-4">Change Password</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                />
              </Grid>
            </Grid>
            
            <Box className="mt-4 flex justify-end">
              <Button type="submit" variant="contained" color="primary">
                Update Password
              </Button>
            </Box>
          </form>
        )
      
      case 'notifications':
        return (
          <div>
            <Typography variant="h6" className="mb-4">Notification Settings</Typography>
            
            <Card variant="outlined" className="mb-4">
              <CardContent>
                <Typography variant="subtitle1" className="mb-2">Email Notifications</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.emailNotifications}
                      onChange={handleChange}
                      name="emailNotifications"
                    />
                  }
                  label="Receive email notifications"
                />
              </CardContent>
            </Card>
            
            <Card variant="outlined" className="mb-4">
              <CardContent>
                <Typography variant="subtitle1" className="mb-2">Push Notifications</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.pushNotifications}
                      onChange={handleChange}
                      name="pushNotifications"
                    />
                  }
                  label="Receive push notifications"
                />
                
                <Divider className="my-3" />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.messageNotifications}
                      onChange={handleChange}
                      name="messageNotifications"
                    />
                  }
                  label="Messages"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.postNotifications}
                      onChange={handleChange}
                      name="postNotifications"
                    />
                  }
                  label="Posts, Stories and Comments"
                />
              </CardContent>
            </Card>
            
            <Box className="mt-4 flex justify-end">
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Save Changes
              </Button>
            </Box>
          </div>
        )
      
      case 'privacy':
        return (
          <div>
            <Typography variant="h6" className="mb-4">Privacy Settings</Typography>
            
            <Card variant="outlined" className="mb-4">
              <CardContent>
                <Typography variant="subtitle1" className="mb-2">Account Privacy</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.accountPrivate}
                      onChange={handleChange}
                      name="accountPrivate"
                    />
                  }
                  label="Private Account"
                />
                <Typography variant="body2" color="text.secondary" className="mt-1">
                  When your account is private, only people you approve can see your photos and videos.
                </Typography>
              </CardContent>
            </Card>
            
            <Card variant="outlined" className="mb-4">
              <CardContent>
                <Typography variant="subtitle1" className="mb-2">Activity Status</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={true}
                      onChange={handleChange}
                      name="activityStatus"
                    />
                  }
                  label="Show Activity Status"
                />
                <Typography variant="body2" color="text.secondary" className="mt-1">
                  Allow accounts you follow and anyone you message to see when you were last active.
                </Typography>
              </CardContent>
            </Card>
            
            <Box className="mt-4 flex justify-end">
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Save Changes
              </Button>
            </Box>
          </div>
        )
      
      case 'security':
        return (
          <div>
            <Typography variant="h6" className="mb-4">Security Settings</Typography>
            
            <Card variant="outlined" className="mb-4">
              <CardContent>
                <Typography variant="subtitle1" className="mb-2">Two-Factor Authentication</Typography>
                <Typography variant="body2" color="text.secondary" className="mb-3">
                  Add an extra layer of security to your account by requiring a verification code in addition to your password.
                </Typography>
                <Button variant="outlined">Enable Two-Factor Authentication</Button>
              </CardContent>
            </Card>
            
            <Card variant="outlined" className="mb-4">
              <CardContent>
                <Typography variant="subtitle1" className="mb-2">Login Activity</Typography>
                <Typography variant="body2" color="text.secondary" className="mb-3">
                  Review where you're logged in and log out if needed.
                </Typography>
                <Button variant="outlined">View Login Activity</Button>
              </CardContent>
            </Card>
            
            <Card variant="outlined" className="mb-4">
              <CardContent>
                <Typography variant="subtitle1" className="mb-2">Saved Login Info</Typography>
                <Typography variant="body2" color="text.secondary" className="mb-3">
                  Remove browsers and apps that can log in without a code.
                </Typography>
                <Button variant="outlined">Manage Saved Logins</Button>
              </CardContent>
            </Card>
          </div>
        )
      
      case 'help':
        return (
          <div>
            <Typography variant="h6" className="mb-4">Help Center</Typography>
            
            <Card variant="outlined" className="mb-4">
              <CardContent>
                <Typography variant="subtitle1" className="mb-2">Frequently Asked Questions</Typography>
                <Typography variant="body2" color="text.secondary" className="mb-3">
                  Find answers to common questions about JD Socials.
                </Typography>
                <Button variant="outlined">View FAQs</Button>
              </CardContent>
            </Card>
            
            <Card variant="outlined" className="mb-4">
              <CardContent>
                <Typography variant="subtitle1" className="mb-2">Report a Problem</Typography>
                <Typography variant="body2" color="text.secondary" className="mb-3">
                  Let us know if something isn't working as expected.
                </Typography>
                <Button variant="outlined">Report Problem</Button>
              </CardContent>
            </Card>
            
            <Card variant="outlined" className="mb-4">
              <CardContent>
                <Typography variant="subtitle1" className="mb-2">Contact Support</Typography>
                <Typography variant="body2" color="text.secondary" className="mb-3">
                  Get in touch with our support team for assistance.
                </Typography>
                <Button variant="outlined">Contact Support</Button>
              </CardContent>
            </Card>
          </div>
        )
      
      case 'about':
        return (
          <div>
            <Typography variant="h6" className="mb-4">About JD Socials</Typography>
            
            <Card variant="outlined" className="mb-4">
              <CardContent>
                <Typography variant="subtitle1" className="mb-2">Version</Typography>
                <Typography variant="body2" color="text.secondary">
                  1.0.0
                </Typography>
              </CardContent>
            </Card>
            
            <Card variant="outlined" className="mb-4">
              <CardContent>
                <Typography variant="subtitle1" className="mb-2">Terms of Service</Typography>
                <Typography variant="body2" color="text.secondary" className="mb-3">
                  Read our terms of service to understand the rules of using JD Socials.
                </Typography>
                <Button variant="outlined">View Terms</Button>
              </CardContent>
            </Card>
            
            <Card variant="outlined" className="mb-4">
              <CardContent>
                <Typography variant="subtitle1" className="mb-2">Privacy Policy</Typography>
                <Typography variant="body2" color="text.secondary" className="mb-3">
                  Learn how we collect, use, and share your data.
                </Typography>
                <Button variant="outlined">View Privacy Policy</Button>
              </CardContent>
            </Card>
            
            <Card variant="outlined" className="mb-4">
              <CardContent>
                <Typography variant="subtitle1" className="mb-2">Licenses</Typography>
                <Typography variant="body2" color="text.secondary" className="mb-3">
                  View open source licenses used in JD Socials.
                </Typography>
                <Button variant="outlined">View Licenses</Button>
              </CardContent>
            </Card>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-4">
        <Typography variant="h5" className="font-bold mb-6">Settings</Typography>
        
        <Grid container spacing={4}>
          {/* Settings Navigation */}
          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <List component="nav">
                <ListItemButton 
                  selected={activeSection === 'account'} 
                  onClick={() => setActiveSection('account')}
                >
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Account" />
                </ListItemButton>
                
                <ListItemButton 
                  selected={activeSection === 'password'} 
                  onClick={() => setActiveSection('password')}
                >
                  <ListItemIcon>
                    <LockIcon />
                  </ListItemIcon>
                  <ListItemText primary="Password" />
                </ListItemButton>
                
                <ListItemButton 
                  selected={activeSection === 'notifications'} 
                  onClick={() => setActiveSection('notifications')}
                >
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Notifications" />
                </ListItemButton>
                
                <ListItemButton 
                  selected={activeSection === 'privacy'} 
                  onClick={() => setActiveSection('privacy')}
                >
                  <ListItemIcon>
                    <PrivacyTipIcon />
                  </ListItemIcon>
                  <ListItemText primary="Privacy" />
                </ListItemButton>
                
                <ListItemButton 
                  selected={activeSection === 'security'} 
                  onClick={() => setActiveSection('security')}
                >
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText primary="Security" />
                </ListItemButton>
                
                <ListItemButton 
                  selected={activeSection === 'help'} 
                  onClick={() => setActiveSection('help')}
                >
                  <ListItemIcon>
                    <HelpIcon />
                  </ListItemIcon>
                  <ListItemText primary="Help" />
                </ListItemButton>
                
                <ListItemButton 
                  selected={activeSection === 'about'} 
                  onClick={() => setActiveSection('about')}
                >
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText primary="About" />
                </ListItemButton>
              </List>
            </Card>
          </Grid>
          
          {/* Settings Content */}
          <Grid item xs={12} md={9}>
            <Card variant="outlined">
              <CardContent>
                {renderSection()}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Settings 