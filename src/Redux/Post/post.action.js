import { postAPI, fileAPI } from '../../services/api';
import {
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE,
  GET_POSTS_REQUEST,
  GET_POSTS_SUCCESS,
  GET_POSTS_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  COMMENT_POST_REQUEST,
  COMMENT_POST_SUCCESS,
  COMMENT_POST_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,
  SAVE_POST_REQUEST,
  SAVE_POST_SUCCESS,
  SAVE_POST_FAILURE,
  GET_USER_POSTS_REQUEST,
  GET_USER_POSTS_SUCCESS,
  GET_USER_POSTS_FAILURE,
  SET_CURRENT_POST,
  CLEAR_POST_ERROR
} from './post.actionType';

// Create post action
export const createPostAction = (postData) => async (dispatch) => {
  dispatch({ type: CREATE_POST_REQUEST });
  try {
    let mediaUrl = '';
    if (postData.media) {
      const response = await fileAPI.uploadFile(postData.media, 'posts');
      mediaUrl = response.data;
    }

    const newPost = {
      ...postData,
      mediaUrl,
      mediaType: postData.media ? (postData.media.type.startsWith('image/') ? 'IMAGE' : 'VIDEO') : 'NONE',
    };

    const response = await postAPI.createPost(newPost);
    
    dispatch({
      type: CREATE_POST_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: CREATE_POST_FAILURE,
      payload: error.response?.data?.message || 'Failed to create post'
    });
    throw error;
  }
};

// Get all posts action
export const getPostsAction = (page = 0) => async (dispatch) => {
  dispatch({ type: GET_POSTS_REQUEST });
  try {
    const response = await postAPI.getPosts(page);
    dispatch({
      type: GET_POSTS_SUCCESS,
      payload: response.data
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: GET_POSTS_FAILURE,
      payload: error.response?.data?.message || 'Failed to fetch posts'
    });
    throw error;
  }
};

// Get user posts action
export const getUserPostsAction = (userId) => async (dispatch) => {
  dispatch({ type: GET_USER_POSTS_REQUEST });
  try {
    const response = await postAPI.getUserPosts(userId);
    dispatch({
      type: GET_USER_POSTS_SUCCESS,
      payload: response.data
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: GET_USER_POSTS_FAILURE,
      payload: error.response?.data?.message || 'Failed to fetch user posts'
    });
    throw error;
  }
};

// Like post action
export const likePostAction = (postId) => async (dispatch) => {
  dispatch({ type: LIKE_POST_REQUEST });
  try {
    const response = await postAPI.likePost(postId);
    dispatch({
      type: LIKE_POST_SUCCESS,
      payload: { postId, data: response.data }
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: LIKE_POST_FAILURE,
      payload: error.response?.data?.message || 'Failed to like post'
    });
    throw error;
  }
};

// Unlike post action
export const unlikePostAction = (postId) => async (dispatch) => {
  dispatch({ type: LIKE_POST_REQUEST });
  try {
    const response = await postAPI.unlikePost(postId);
    dispatch({
      type: LIKE_POST_SUCCESS,
      payload: { postId, data: response.data }
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: LIKE_POST_FAILURE,
      payload: error.response?.data?.message || 'Failed to unlike post'
    });
    throw error;
  }
};

// Comment on post action
export const commentPostAction = (postId, comment) => async (dispatch) => {
  dispatch({ type: COMMENT_POST_REQUEST });
  try {
    const response = await postAPI.commentOnPost(postId, { content: comment });
    dispatch({
      type: COMMENT_POST_SUCCESS,
      payload: { postId, data: response.data }
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: COMMENT_POST_FAILURE,
      payload: error.response?.data?.message || 'Failed to comment on post'
    });
    throw error;
  }
};

// Delete post action
export const deletePostAction = (postId) => async (dispatch) => {
  dispatch({ type: DELETE_POST_REQUEST });
  try {
    await postAPI.deletePost(postId);
    dispatch({
      type: DELETE_POST_SUCCESS,
      payload: postId
    });
  } catch (error) {
    dispatch({
      type: DELETE_POST_FAILURE,
      payload: error.response?.data?.message || 'Failed to delete post'
    });
    throw error;
  }
};

// Save post action
export const savePostAction = (postId) => async (dispatch) => {
  dispatch({ type: SAVE_POST_REQUEST });
  try {
    const response = await postAPI.savePost(postId);
    dispatch({
      type: SAVE_POST_SUCCESS,
      payload: { postId, data: response.data }
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: SAVE_POST_FAILURE,
      payload: error.response?.data?.message || 'Failed to save post'
    });
    throw error;
  }
};

// Unsave post action
export const unsavePostAction = (postId) => async (dispatch) => {
  dispatch({ type: SAVE_POST_REQUEST });
  try {
    const response = await postAPI.unsavePost(postId);
    dispatch({
      type: SAVE_POST_SUCCESS,
      payload: { postId, data: response.data }
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: SAVE_POST_FAILURE,
      payload: error.response?.data?.message || 'Failed to unsave post'
    });
    throw error;
  }
};

// Set current post
export const setCurrentPost = (post) => ({
  type: SET_CURRENT_POST,
  payload: post
});

// Clear post error
export const clearPostError = () => ({
  type: CLEAR_POST_ERROR
}); 