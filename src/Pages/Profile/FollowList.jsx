import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  IconButton, 
  Button,
  Typography
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const FollowList = ({ open, onClose, title, users, onFollowToggle }) => {
  const navigate = useNavigate();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <div className="flex justify-between items-center">
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <List>
          {users.map((user) => (
            <ListItem
              key={user.id}
              secondaryAction={
                <Button
                  variant={user.isFollowing ? "outlined" : "contained"}
                  onClick={() => onFollowToggle(user.id)}
                  size="small"
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </Button>
              }
            >
              <ListItemAvatar>
                <Avatar 
                  src={user.profilePic}
                  onClick={() => {
                    navigate(`/profile/${user.id}`);
                    onClose();
                  }}
                  className="cursor-pointer"
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    className="cursor-pointer hover:underline"
                    onClick={() => {
                      navigate(`/profile/${user.id}`);
                      onClose();
                    }}
                  >
                    {user.username}
                  </Typography>
                }
                secondary={user.name}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default FollowList; 