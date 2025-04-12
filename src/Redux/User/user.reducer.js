import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API base URL - replace with your actual API URL
const API_BASE_URL = 'http://localhost:8080/api';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId || 'profile'}`, {
        headers: {
          'Authorization': localStorage.getItem('jwt')
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/update`, userData, {
        headers: {
          'Authorization': localStorage.getItem('jwt')
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const followUser = createAsyncThunk(
  'user/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/follow/${userId}`, {}, {
        headers: {
          'Authorization': localStorage.getItem('jwt')
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'user/unfollowUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/unfollow/${userId}`, {}, {
        headers: {
          'Authorization': localStorage.getItem('jwt')
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchUsers = createAsyncThunk(
  'user/searchUsers',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/search?q=${query}`, {
        headers: {
          'Authorization': localStorage.getItem('jwt')
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  currentUser: null,
  profileUser: null,
  searchResults: [],
  loading: false,
  error: null
};

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearUserError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.meta.arg) {
          // If no userId was provided, this is the current user's profile
          state.currentUser = action.payload;
        } else {
          state.profileUser = action.payload;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user profile';
      })
      
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update user profile';
      })
      
      // Follow user
      .addCase(followUser.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.followings = action.payload.currentUserFollowings;
        }
        if (state.profileUser && state.profileUser.id === action.meta.arg) {
          state.profileUser.followers = action.payload.targetUserFollowers;
        }
      })
      
      // Unfollow user
      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.followings = action.payload.currentUserFollowings;
        }
        if (state.profileUser && state.profileUser.id === action.meta.arg) {
          state.profileUser.followers = action.payload.targetUserFollowers;
        }
      })
      
      // Search users
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to search users';
      });
  }
});

export const { setCurrentUser, clearUserError, clearSearchResults } = userSlice.actions;
export default userSlice.reducer; 