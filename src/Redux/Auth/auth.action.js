import { authAPI } from '../../services/api';
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./auth.actionType";


// Login user
export const loginUserAction = (loginData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await authAPI.login({
      email: loginData.email.trim().toLowerCase(),
      password: loginData.password
    });

    const { token, user } = response.data;
    
    if (!token || !user) {
      throw new Error('Invalid response from server');
    }

    localStorage.setItem('token', token);
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user, token }
    });
    
    return Promise.resolve({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    let errorMessage = 'Login failed';
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = 'Invalid email or password';
          break;
        case 401:
          errorMessage = 'Invalid credentials';
          break;
        case 404:
          errorMessage = 'User not found';
          break;
        default:
          errorMessage = error.response.data?.message || 'Login failed';
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection.';
    }
    
    dispatch({
      type: LOGIN_FAILURE,
      payload: errorMessage
    });
    
    const enhancedError = new Error(errorMessage);
    return Promise.reject(enhancedError);
  }
};

// Register user
export const registerUserAction = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const formattedData = {
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      gender: userData.gender.toLowerCase()
    };

    const response = await authAPI.register(formattedData);
    
    if (!response?.data) {
      throw new Error('Invalid response from server');
    }
    
    dispatch({
      type: REGISTER_SUCCESS,
      payload: response.data
    });
    
    return Promise.resolve(response.data);
  } catch (error) {
    console.error('Registration error:', error);
    let errorMessage = 'Registration failed';
    let fieldError = null;
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = error.response.data?.message || 'Invalid registration data';
          if (error.response.data?.field) {
            fieldError = {
              field: error.response.data.field,
              message: error.response.data.message
            };
          }
          break;
        case 409:
          errorMessage = 'Email already registered';
          fieldError = { field: 'email', message: 'This email is already registered' };
          break;
        default:
          errorMessage = error.response.data?.message || 'Registration failed';
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection.';
    }
    
    dispatch({
      type: REGISTER_FAILURE,
      payload: { message: errorMessage, fieldError }
    });
    
    const enhancedError = new Error(errorMessage);
    enhancedError.fieldError = fieldError;
    return Promise.reject(enhancedError);
  }
};

// Logout user
export const logoutUserAction = () => async (dispatch) => {
  try {
    await authAPI.logout();
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    localStorage.removeItem('token');
    dispatch({ type: LOGOUT });
    return '/auth';
  }
};