import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Button,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography,
  ImageList,
  ImageListItem,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import GridOnIcon from '@mui/icons-material/GridOn';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PostCard from '../../Components/MiddlePart/PostCard';
import Sidebar from '../../Components/Sidebar';
import FollowList from './FollowList';
import { fetchUserProfile, followUser } from '../../Redux/User/user.reducer';
import { getUserPostsAction } from '../../Redux/Post/post.action';
import axios from 'axios';
import { API_BASE_URL } from '../../Config/api';

const Profile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const currentUser = useSelector(state => state.auth.user);

  const [activeTab, setActiveTab] = useState(0);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const profile = useSelector(state => state.user.currentProfile);
  const posts = useSelector(state => state.post.userPosts);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const targetUserId = userId || currentUser?.id;
        if (targetUserId) {
          await Promise.all([
            dispatch(fetchUserProfile(targetUserId)).unwrap(),
            dispatch(getUserPostsAction(targetUserId)).unwrap()
          ]);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [dispatch, userId, currentUser?.id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFollowToggle = async (targetUserId) => {
    try {
      await dispatch(followUser(targetUserId)).unwrap();
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const getCols = () => {
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 4;
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('photo', file);

      const response = await axios.post(`${API_BASE_URL}/users/profile-photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': localStorage.getItem('token')
        }
      });

      if (response.data) {
        dispatch(fetchUserProfile(currentUser.id));
      }
    } catch (error) {
      console.error('Failed to upload photo:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
            <div className="relative">
              <Avatar
                src={profile?.profilePic}
                sx={{ width: 150, height: 150 }}
                className="mb-4 md:mb-0 md:mr-8 cursor-pointer"
                onClick={() => currentUser?.id === profile?.id && fileInputRef.current?.click()}
              >
                {profile?.name?.charAt(0)}
              </Avatar>
              {currentUser?.id === profile?.id && (
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <CircularProgress size={30} />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row items-center md:items-start mb-4">
                <Typography variant="h5" className="mb-2 md:mb-0 md:mr-4">
                  {profile?.username}
                </Typography>
                {currentUser?.id !== profile?.id && (
                  <Button
                    variant={profile?.isFollowing ? "outlined" : "contained"}
                    onClick={() => handleFollowToggle(profile?.id)}
                  >
                    {profile?.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>

              <div className="flex justify-center md:justify-start space-x-8 mb-4">
                <div className="text-center md:text-left">
                  <Typography variant="subtitle1" className="font-bold">
                    {posts?.length || 0}
                  </Typography>
                  <Typography variant="body2">posts</Typography>
                </div>
                <div
                  className="text-center md:text-left cursor-pointer"
                  onClick={() => setShowFollowers(true)}
                >
                  <Typography variant="subtitle1" className="font-bold">
                    {profile?.followers?.length || 0}
                  </Typography>
                  <Typography variant="body2">followers</Typography>
                </div>
                <div
                  className="text-center md:text-left cursor-pointer"
                  onClick={() => setShowFollowing(true)}
                >
                  <Typography variant="subtitle1" className="font-bold">
                    {profile?.following?.length || 0}
                  </Typography>
                  <Typography variant="body2">following</Typography>
                </div>
              </div>

              <div>
                <Typography variant="subtitle1" className="font-bold">
                  {profile?.name}
                </Typography>
                <Typography variant="body1">
                  {profile?.bio}
                </Typography>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          {posts?.length > 0 ? (
            <ImageList cols={getCols()} gap={8}>
              {posts.map((post) => (
                <ImageListItem key={post.id} className="cursor-pointer">
                  <img
                    src={post.image}
                    alt={post.caption}
                    loading="lazy"
                    className="aspect-square object-cover"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <div className="text-center py-8">
              <Typography variant="h6">No posts yet</Typography>
            </div>
          )}
        </div>

        {/* Followers Dialog */}
        <FollowList
          open={showFollowers}
          onClose={() => setShowFollowers(false)}
          title="Followers"
          users={profile?.followers || []}
          onFollowToggle={handleFollowToggle}
        />

        {/* Following Dialog */}
        <FollowList
          open={showFollowing}
          onClose={() => setShowFollowing(false)}
          title="Following"
          users={profile?.following || []}
          onFollowToggle={handleFollowToggle}
        />
      </div>
    </div>
  );
};

export default Profile; 