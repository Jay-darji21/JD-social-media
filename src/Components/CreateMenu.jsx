import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ImageIcon from '@mui/icons-material/Image'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'

const CreateMenu = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const anchorRef = React.useRef(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setOpen(false)
  }

  const handleCreatePost = () => {
    navigate('/create/post')
    setOpen(false)
  }

  const handleCreateStory = () => {
    navigate('/create/story')
    setOpen(false)
  }

  // Return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }
    prevOpen.current = open
  }, [open])

  return (
    <div>
      <Button
        ref={anchorRef}
        aria-controls={open ? 'create-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        startIcon={<AddCircleOutlineIcon />}
        className="rounded-full"
        fullWidth
      >
        Create
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper elevation={3} className="mt-1">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="create-menu"
                  aria-labelledby="create-button"
                >
                  <MenuItem onClick={handleCreatePost} className="py-2">
                    <ImageIcon className="mr-2" /> Post
                  </MenuItem>
                  <MenuItem onClick={handleCreateStory} className="py-2">
                    <VideoLibraryIcon className="mr-2" /> Story
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}

export default CreateMenu 