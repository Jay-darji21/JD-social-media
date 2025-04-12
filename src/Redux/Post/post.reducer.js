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

const initialState = {
  posts: [],
  userPosts: [],
  loading: false,
  error: null,
  currentPage: 0,
  hasMore: true,
  currentPost: null
};

const updatePost = (posts, postId, updateFn) => {
  return posts.map(post => 
    post.id === postId ? updateFn(post) : post
  );
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_POST_REQUEST:
    case GET_POSTS_REQUEST:
    case GET_USER_POSTS_REQUEST:
    case LIKE_POST_REQUEST:
    case COMMENT_POST_REQUEST:
    case DELETE_POST_REQUEST:
    case SAVE_POST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case CREATE_POST_SUCCESS:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        loading: false,
        error: null
      };

    case CREATE_POST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case GET_POSTS_SUCCESS:
      return {
        ...state,
        posts: state.currentPage === 0 
          ? action.payload.content 
          : [...state.posts, ...action.payload.content],
        currentPage: action.payload.number,
        hasMore: !action.payload.last,
        loading: false,
        error: null
      };

    case GET_POSTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case GET_USER_POSTS_SUCCESS:
      return {
        ...state,
        userPosts: action.payload,
        loading: false,
        error: null
      };

    case GET_USER_POSTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case LIKE_POST_SUCCESS:
      return {
        ...state,
        posts: updatePost(state.posts, action.payload.postId, post => ({
          ...post,
          likes: action.payload.data.likes,
          isLiked: action.payload.data.isLiked
        })),
        userPosts: updatePost(state.userPosts, action.payload.postId, post => ({
          ...post,
          likes: action.payload.data.likes,
          isLiked: action.payload.data.isLiked
        })),
        currentPost: state.currentPost?.id === action.payload.postId 
          ? { ...state.currentPost, ...action.payload.data }
          : state.currentPost,
        loading: false,
        error: null
      };

    case LIKE_POST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case COMMENT_POST_SUCCESS:
      return {
        ...state,
        posts: updatePost(state.posts, action.payload.postId, post => ({
          ...post,
          comments: action.payload.data.comments
        })),
        userPosts: updatePost(state.userPosts, action.payload.postId, post => ({
          ...post,
          comments: action.payload.data.comments
        })),
        currentPost: state.currentPost?.id === action.payload.postId 
          ? { ...state.currentPost, comments: action.payload.data.comments }
          : state.currentPost,
        loading: false,
        error: null
      };

    case COMMENT_POST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case DELETE_POST_SUCCESS:
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
        userPosts: state.userPosts.filter(post => post.id !== action.payload),
        currentPost: state.currentPost?.id === action.payload ? null : state.currentPost,
        loading: false,
        error: null
      };

    case DELETE_POST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case SAVE_POST_SUCCESS:
      return {
        ...state,
        posts: updatePost(state.posts, action.payload.postId, post => ({
          ...post,
          isSaved: action.payload.data.isSaved
        })),
        userPosts: updatePost(state.userPosts, action.payload.postId, post => ({
          ...post,
          isSaved: action.payload.data.isSaved
        })),
        currentPost: state.currentPost?.id === action.payload.postId 
          ? { ...state.currentPost, isSaved: action.payload.data.isSaved }
          : state.currentPost,
        loading: false,
        error: null
      };

    case SAVE_POST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case SET_CURRENT_POST:
      return {
        ...state,
        currentPost: action.payload
      };

    case CLEAR_POST_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

export default postReducer; 