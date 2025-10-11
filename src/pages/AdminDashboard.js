import React, { useState, useEffect } from 'react';
import { Shield, Users, Flag, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUserSync } from '../hooks/useUserSync';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const { backendUser } = useUserSync();
  const { showSuccess, showError } = useToast();
  
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (backendUser && (backendUser.role === 'admin' || backendUser.role === 'moderator')) {
      fetchData();
    }
  }, [backendUser]);

  const fetchData = async () => {
    try {
      const [reportsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/admin/reports?admin_id=${backendUser.id}`),
        axios.get(`${API_URL}/admin/users?admin_id=${backendUser.id}`)
      ]);
      setReports(reportsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      showError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      await axios.post(`${API_URL}/admin/reports/${reportId}/resolve?admin_id=${backendUser.id}`);
      showSuccess('Report resolved');
      fetchData();
    } catch (error) {
      showError('Failed to resolve report');
    }
  };

  const handleBanUser = async (userId, username) => {
    if (!window.confirm(`Ban user ${username}?`)) return;
    
    const reason = prompt('Reason for ban:');
    if (!reason) return;

    try {
      await axios.post(`${API_URL}/admin/ban-user?admin_id=${backendUser.id}&user_id=${userId}&reason=${reason}`);
      showSuccess('User banned');
      fetchData();
    } catch (error) {
      showError('Failed to ban user');
    }
  };

  const handlePromoteUser = async (userId, username, newRole) => {
    if (!window.confirm(`Promote ${username} to ${newRole}?`)) return;

    try {
      await axios.post(`${API_URL}/admin/promote-user?admin_id=${backendUser.id}&user_id=${userId}&role=${newRole}`);
      showSuccess(`User promoted to ${newRole}`);
      fetchData();
    } catch (error) {
      showError('Failed to promote user');
    }
  };

  const handleDeletePost = async (reportId, postId) => {
    if (!window.confirm('Delete this post?')) return;
    
    const reason = prompt('Reason for deletion:');
    if (!reason) return;

    try {
      await axios.delete(`${API_URL}/admin/posts/${postId}/moderate?admin_id=${backendUser.id}&reason=${reason}`);
      await handleResolveReport(reportId);
      showSuccess('Post deleted');
    } catch (error) {
      showError('Failed to delete post');
    }
  };

  // Check if user is admin/moderator
  if (!backendUser || (backendUser.role !== 'admin' && backendUser.role !== 'moderator')) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-semibold">
          {backendUser.role}
        </span>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition ${
              activeTab === 'reports'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Flag className="w-5 h-5 inline mr-2" />
            Reports ({reports.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition ${
              activeTab === 'users'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Users ({users.length})
          </button>
        </div>
      </div>

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.filter(r => r.status === 'pending').length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">No pending reports!</p>
            </div>
          ) : (
            reports.filter(r => r.status === 'pending').map(report => (
              <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                        {report.target_type}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ID: {report.target_id}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4"><strong>Reason:</strong> {report.reason}</p>
                    <p className="text-sm text-gray-500">
                      Reported: {new Date(report.created_at).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {report.target_type === 'post' && (
                      <button
                        onClick={() => handleDeletePost(report.id, report.target_id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Post</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleResolveReport(report.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Resolve</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'doctor' ? 'bg-green-100 text-green-800' :
                      user.role === 'banned' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {backendUser.role === 'admin' && user.role !== 'admin' && (
                      <div className="flex space-x-2">
                        {user.role !== 'moderator' && (
                          <button
                            onClick={() => handlePromoteUser(user.id, user.username, 'moderator')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Make Mod
                          </button>
                        )}
                        {user.role !== 'banned' && (
                          <button
                            onClick={() => handleBanUser(user.id, user.username)}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            Ban
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;