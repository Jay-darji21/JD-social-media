import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API base URL - replace with your actual API URL
const API_BASE_URL = 'http://localhost:8080/api';

// Async thunks
export const fetchChats = createAsyncThunk(
  'message/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat`, {
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

export const fetchMessages = createAsyncThunk(
  'message/fetchMessages',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/message/${chatId}`, {
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

export const createMessage = createAsyncThunk(
  'message/createMessage',
  async ({ chatId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/message/create`, 
        { chatId, content },
        {
          headers: {
            'Authorization': localStorage.getItem('jwt')
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createChat = createAsyncThunk(
  'message/createChat',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/create/${userId}`, {}, {
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
  chats: [],
  messages: [],
  currentChat: null,
  loading: false,
  error: null
};

// Slice
const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    clearMessageError: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch chats
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch chats';
      })
      
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch messages';
      })
      
      // Create message
      .addCase(createMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
        
        // Update the last message in the chat list
        const chatIndex = state.chats.findIndex(chat => chat.id === action.payload.chat.id);
        if (chatIndex !== -1) {
          state.chats[chatIndex].lastMessage = action.payload;
        }
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send message';
      })
      
      // Create chat
      .addCase(createChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chats.unshift(action.payload);
        state.currentChat = action.payload;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create chat';
      });
  }
});

export const { setCurrentChat, clearMessageError, clearMessages } = messageSlice.actions;
export default messageSlice.reducer; 