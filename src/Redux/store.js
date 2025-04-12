import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Auth/auth.reducer';
import postReducer from './Post/post.reducer';
import userReducer from './User/user.reducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
