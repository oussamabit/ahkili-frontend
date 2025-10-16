import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Communities from './pages/Communities';
import CommunityDetail from './pages/CommunityDetail';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Hotlines from './pages/Hotlines';
import PostDetail from './pages/PostDetail';
import Search from './pages/Search';
import AdminDashboard from './pages/AdminDashboard';
import DoctorVerification from './pages/DoctorVerification';
import CommunityModeration from './pages/CommunityModeration';
import Settings from './pages/Settings';
import ProtectedRoute from './components/common/ProtectedRoute';
import InstallPrompt from './components/common/InstallPrompt';
import { useAuth } from './context/AuthContext';

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {currentUser && <Navbar />}
        <main className={currentUser ? "container mx-auto px-4 py-6 max-w-7xl" : ""}>
          <Routes>
            {/* Landing page for non-logged-in users */}
            {!currentUser ? (
              <>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                {/* Protected Routes for logged-in users */}
                <Route path="/" element={<Home />} />
                <Route path="/communities" element={<Communities />} />
                <Route path="/community/:id" element={<CommunityDetail />} />
                <Route path="/community/:id/moderators" element={<CommunityModeration />} />
                <Route path="/search" element={<Search />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/hotlines" element={<Hotlines />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/doctor-verification" element={<DoctorVerification />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </main>
        {currentUser && <InstallPrompt />}
      </div>
    </Router>
  );
}

export default App;