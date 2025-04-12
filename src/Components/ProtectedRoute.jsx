import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { auth } = useSelector(state => state)
  const location = useLocation()
  
  // Check if user is authenticated using both token and auth state
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token && auth.isAuthenticated
  
  if (!isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to="/auth/signin" state={{ from: location.pathname }} replace />
  }
  
  // If authenticated, render the protected content
  return children
}

export default ProtectedRoute 