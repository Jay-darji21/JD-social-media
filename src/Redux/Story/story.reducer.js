import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API base URL - replace with your actual API URL
const API_BASE_URL = 'http://localhost:8080/api';

// Async thunks
export const fetchUserStories = createAsyncThunk(
  'story/fetchUserStories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/story/user`, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchFollowingStories = createAsyncThunk(
  'story/fetchFollowingStories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/story/following`, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createStory = createAsyncThunk(
  'story/createStory',
  async (storyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/story/post`, storyData, {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
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
  userStories: [],
  followingStories: [],
  loading: false,
  error: null,
  currentStory: null,
  currentStoryIndex: 0,
  viewingUserId: null
};

// Slice
const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setCurrentStory: (state, action) => {
      state.currentStory = action.payload;
    },
    setCurrentStoryIndex: (state, action) => {
      state.currentStoryIndex = action.payload;
    },
    setViewingUserId: (state, action) => {
      state.viewingUserId = action.payload;
    },
    clearStoryError: (state) => {
      state.error = null;
    },
    nextStory: (state) => {
      if (state.viewingUserId) {
        const userStories = state.followingStories.filter(
          story => story.user.id === state.viewingUserId
        );
        
        if (state.currentStoryIndex < userStories.length - 1) {
          state.currentStoryIndex += 1;
          state.currentStory = userStories[state.currentStoryIndex];
        } else {
          // Move to the next user's stories
          const userIds = [...new Set(state.followingStories.map(story => story.user.id))];
          const currentUserIndex = userIds.indexOf(state.viewingUserId);
          
          if (currentUserIndex < userIds.length - 1) {
            state.viewingUserId = userIds[currentUserIndex + 1];
            state.currentStoryIndex = 0;
            state.currentStory = state.followingStories.find(
              story => story.user.id === state.viewingUserId
            );
          }
        }
      }
    },
    prevStory: (state) => {
      if (state.viewingUserId) {
        if (state.currentStoryIndex > 0) {
          state.currentStoryIndex -= 1;
          const userStories = state.followingStories.filter(
            story => story.user.id === state.viewingUserId
          );
          state.currentStory = userStories[state.currentStoryIndex];
        } else {
          // Move to the previous user's stories
          const userIds = [...new Set(state.followingStories.map(story => story.user.id))];
          const currentUserIndex = userIds.indexOf(state.viewingUserId);
          
          if (currentUserIndex > 0) {
            state.viewingUserId = userIds[currentUserIndex - 1];
            const userStories = state.followingStories.filter(
              story => story.user.id === state.viewingUserId
            );
            state.currentStoryIndex = userStories.length - 1;
            state.currentStory = userStories[state.currentStoryIndex];
          }
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user stories
      .addCase(fetchUserStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStories.fulfilled, (state, action) => {
        state.loading = false;
        state.userStories = action.payload;
      })
      .addCase(fetchUserStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user stories';
      })
      
      // Fetch following stories
      .addCase(fetchFollowingStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowingStories.fulfilled, (state, action) => {
        state.loading = false;
        state.followingStories = action.payload;
        
        // Set initial story if available
        if (action.payload.length > 0) {
          const firstUserId = action.payload[0].user.id;
          state.viewingUserId = firstUserId;
          state.currentStoryIndex = 0;
          state.currentStory = action.payload.find(story => story.user.id === firstUserId);
        }
      })
      .addCase(fetchFollowingStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch following stories';
      })
      
      // Create story
      .addCase(createStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.loading = false;
        state.userStories = [action.payload, ...state.userStories];
      })
      .addCase(createStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create story';
      });
  }
});

export const { 
  setCurrentStory, 
  setCurrentStoryIndex, 
  setViewingUserId, 
  clearStoryError,
  nextStory,
  prevStory
} = storySlice.actions;

export default storySlice.reducer; 