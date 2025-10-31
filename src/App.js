import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Communities from './pages/Communities';
import CommunityDetail from './pages/CommunityDetail';
import CreateCommunity from './pages/CreateCommunity';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import EditProfile from './pages/EditProfile';
import Hotlines from './pages/Hotlines';
import PostDetail from './pages/PostDetail';
import Search from './pages/Search';
import AdminDashboard from './pages/AdminDashboard';
import DoctorVerification from './pages/DoctorVerification';
import CommunityModeration from './pages/CommunityModeration';
import Settings from './pages/Settings';
import InstallPrompt from './components/common/InstallPrompt';
import { useAuth } from './context/AuthContext';
import { useUserSync } from './hooks/useUserSync';

function App() {
  const { currentUser, logout } = useAuth();
  const { backendUser } = useUserSync();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {!currentUser ? (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <div className="flex h-screen overflow-hidden">
            <Sidebar 
              currentUser={currentUser} 
              backendUser={backendUser}
              onLogout={logout}
            />
            
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar />
              
              {/* Added pb-24 for mobile bottom nav spacing */}
              <main className="flex-1 overflow-y-auto pb-24 lg:pb-6">
                <div className="container mx-auto px-4 py-6 max-w-7xl">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/communities" element={<Communities />} />
                    <Route path="/community/:id" element={<CommunityDetail />} />
                    <Route path="/create-community" element={<CreateCommunity />} />
                    <Route path="/community/:id/moderators" element={<CommunityModeration />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/post/:id" element={<PostDetail />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/edit" element={<EditProfile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/hotlines" element={<Hotlines />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/doctor-verification" element={<DoctorVerification />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </main>
            </div>
          </div>
        )}
        {currentUser && <InstallPrompt />}
      </div>
    </Router>
  );
}

export default App;