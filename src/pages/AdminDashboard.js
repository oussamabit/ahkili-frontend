import React, { useState, useEffect } from 'react';
import { Shield, Users, Flag, Trash2, CheckCircle, AlertTriangle, Award, FileText, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUserSync } from '../hooks/useUserSync';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const { backendUser } = useUserSync();
  const { showSuccess, showError } = useToast();
  
  const [activeTab, setActiveTab] = useState('verifications');
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    console.log('🔧 ADMIN DEBUG - Backend User:', backendUser);
    
    if (backendUser && (backendUser.role === 'admin' || backendUser.role === 'moderator')) {
      fetchData();
    }
  }, [backendUser]);

  const fetchData = async () => {
    try {
      console.log('🔄 Fetching admin data...');
      console.log('📝 API URLs:', {
        reports: `${API_URL}/admin/reports?admin_id=${backendUser.id}`,
        users: `${API_URL}/admin/users?admin_id=${backendUser.id}`,
        verifications: `${API_URL}/admin/doctor-verifications?admin_id=${backendUser.id}&status=pending`
      });

      const [reportsRes, usersRes, verificationsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/reports?admin_id=${backendUser.id}`),
        axios.get(`${API_URL}/admin/users?admin_id=${backendUser.id}`),
        backendUser.role === 'admin' 
          ? axios.get(`${API_URL}/admin/doctor-verifications?admin_id=${backendUser.id}&status=pending`)
          : Promise.resolve({ data: [] })
      ]);
      
      console.log('✅ API Responses:', {
        reports: reportsRes.data,
        users: usersRes.data,
        verifications: verificationsRes.data
      });

      setReports(reportsRes.data);
      setUsers(usersRes.data);
      setVerifications(verificationsRes.data);
    } catch (error) {
      console.error('❌ Error fetching admin data:', error);
      console.error('🔍 Error details:', error.response?.data);
      console.error('🚨 Error status:', error.response?.status);
      showError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDoctor = async (verificationId) => {
    if (!window.confirm('Approve this doctor verification?')) return;

    try {
      await axios.post(`${API_URL}/admin/doctor-verifications/${verificationId}/approve?admin_id=${backendUser.id}`);
      showSuccess('Doctor verification approved! User is now a verified doctor.');
      fetchData();
    } catch (error) {
      console.error('❌ Approve error:', error.response?.data);
      showError('Failed to approve verification');
    }
  };

  const handleRejectDoctor = async (verificationId) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;

    try {
      await axios.post(`${API_URL}/admin/doctor-verifications/${verificationId}/reject?admin_id=${backendUser.id}&reason=${encodeURIComponent(reason)}`);
      showSuccess('Doctor verification rejected');
      fetchData();
    } catch (error) {
      console.error('❌ Reject error:', error.response?.data);
      showError('Failed to reject verification');
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
        <div className="flex border-b overflow-x-auto">
          {backendUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('verifications')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition whitespace-nowrap ${
                activeTab === 'verifications'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Award className="w-5 h-5 inline mr-2" />
              Doctor Verifications ({verifications.length})
            </button>
          )}
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition whitespace-nowrap ${
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
            className={`flex-1 py-4 px-6 text-center font-semibold transition whitespace-nowrap ${
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

      {/* Verifications */}
      {activeTab === 'verifications' && backendUser.role === 'admin' && (
        <div className="space-y-4">
          {verifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">No pending verifications!</p>
            </div>
          ) : (
            verifications.map(v => (
              <div key={v.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-4">
                      <Award className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-bold text-gray-800">{v.full_name}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {v.specialization}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">License Number</p>
                        <p className="font-semibold text-gray-800">{v.license_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-semibold text-gray-800">{v.phone_number}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Clinic Address</p>
                        <p className="font-semibold text-gray-800">{v.clinic_address}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Bio</p>
                        <p className="text-gray-700">{v.bio}</p>
                      </div>
                    </div>

                    {v.license_document_url && (
                      <button
                        onClick={() => setSelectedDoc(v.license_document_url)}
                        className="flex items-center space-x-2 text-primary hover:text-green-600 transition"
                      >
                        <FileText className="w-5 h-5" />
                        <span>View License Document</span>
                      </button>
                    )}

                    <p className="text-sm text-gray-500 mt-4">
                      Submitted: {new Date(v.submitted_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                    <button
                      onClick={() => handleApproveDoctor(v.id)}
                      className="flex-1 lg:flex-none px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleRejectDoctor(v.id)}
                      className="flex-1 lg:flex-none px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2"
                    >
                      <X className="w-5 h-5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Document Viewer */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold">License Document</h3>
              <button onClick={() => setSelectedDoc(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <img src={selectedDoc} alt="License Document" className="w-full" />
            </div>
          </div>
        </div>
      )}

      {/* Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.filter(r => r.status === 'pending').length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">No pending reports!</p>
            </div>
          ) : (
            reports.filter(r => r.status === 'pending').map(r => (
              <div key={r.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                        {r.target_type}
                      </span>
                      <span className="text-gray-500 text-sm">ID: {r.target_id}</span>
                    </div>
                    <p className="text-gray-700 mb-4"><strong>Reason:</strong> {r.reason}</p>
                    <p className="text-sm text-gray-500">Reported: {new Date(r.created_at).toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col space-y-2">
                    {r.target_type === 'post' && (
                      <button
                        onClick={() => handleDeletePost(r.id, r.target_id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Post</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleResolveReport(r.id)}
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

      {/* Users */}
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
              {users.map(u => (
                <tr key={u.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'moderator'
                          ? 'bg-blue-100 text-blue-800'
                          : u.role === 'doctor'
                          ? 'bg-green-100 text-green-800'
                          : u.role === 'banned'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {backendUser.role === 'admin' && u.role !== 'admin' && (
                      <div className="flex space-x-2">
                        {u.role !== 'moderator' && (
                          <button
                            onClick={() => handlePromoteUser(u.id, u.username, 'moderator')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Make Mod
                          </button>
                        )}
                        {u.role !== 'banned' && (
                          <button
                            onClick={() => handleBanUser(u.id, u.username)}
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
