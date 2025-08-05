import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CourseDetail from './components/CourseDetail';
import GroupDetail from './components/GroupDetail';
import Attendance from './components/Attendance';
import Report from './components/Report';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/course/:courseId" 
            element={
              <PrivateRoute>
                <CourseDetail />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/group/:groupId" 
            element={
              <PrivateRoute>
                <GroupDetail />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/attendance/:classId" 
            element={
              <PrivateRoute>
                <Attendance />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/report/:courseId" 
            element={
              <PrivateRoute>
                <Report />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Container>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 