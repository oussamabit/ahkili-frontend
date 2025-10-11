import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Communities from './pages/Communities';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Hotlines from './pages/Hotlines';
import PostDetail from './pages/PostDetail';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import CommunityDetail from './pages/CommunityDetail';
import Search from './pages/Search';
import InstallPrompt from './components/common/InstallPrompt';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          <Routes>
            {/* Public Route - Login */}
            <Route 
              path="/login" 
              element={currentUser ? <Navigate to="/" replace /> : <Login />} 
            />

            {/* Public Route - Hotlines (always accessible for crisis support) */}
            <Route path="/hotlines" element={<Hotlines />} />

            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/communities" 
              element={
                <ProtectedRoute>
                  <Communities />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/post/:id" 
              element={
                <ProtectedRoute>
                  <PostDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/community/:id" 
              element={
                <ProtectedRoute>
                  <CommunityDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile/edit" 
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <InstallPrompt />
    </Router>
  );
}

export default App;