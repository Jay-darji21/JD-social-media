import { Route, Routes } from 'react-router-dom';
import './App.css';
import Authentication from './Pages/Authentication/Authentication';
import Message from './Pages/Messages/Message';
import Profile from './Pages/Profile/Profile';
import Reels from './Pages/Reels/Reels';
import CreatePost from './Pages/Create/CreatePost';
import CreateStory from './Pages/Create/CreateStory';
import StoryViewer from './Components/Story/StoryViewer';
import Search from './Pages/Search/Search';
import Notifications from './Pages/Notifications/Notifications';
import PostView from './Pages/Post/PostView';
import SavedPosts from './Pages/Saved/SavedPosts';
import Settings from './Pages/Settings/Settings';
import Home from './Pages/Home/Home';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchUserProfile } from './Redux/User/user.reducer';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();
  
  // Check if user is authenticated and fetch user profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !auth.user) {
      dispatch(fetchUserProfile());
    }
  }, [auth.user, dispatch]);
  
  return (
    <div className="App">
      <Routes>
        {/* Protected Routes */}
        <Route path='/' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path='/message' element={<ProtectedRoute><Message /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/profile/:userId' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/reels' element={<ProtectedRoute><Reels /></ProtectedRoute>} />
        <Route path='/search' element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path='/notifications' element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path='/post/:postId' element={<ProtectedRoute><PostView /></ProtectedRoute>} />
        <Route path='/saved' element={<ProtectedRoute><SavedPosts /></ProtectedRoute>} />
        <Route path='/settings' element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path='/create/post' element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path='/create/story' element={<ProtectedRoute><CreateStory /></ProtectedRoute>} />
        <Route path='/stories' element={<ProtectedRoute><StoryViewer /></ProtectedRoute>} />
        
        {/* Public Routes */}
        <Route path='/auth/*' element={<Authentication />} />
      </Routes>
    </div>
  );
}

export default App;
