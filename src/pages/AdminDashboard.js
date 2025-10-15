import React, { useState, useEffect } from 'react';
import { Shield, Users, Flag, Trash2, CheckCircle, AlertTriangle, Award, FileText, X, Sparkles } from 'lucide-react';
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
    if (backendUser && (backendUser.role === 'admin' || backendUser.role === 'moderator')) {
      fetchData();
    }
  }, [backendUser]);

  const fetchData = async () => {
    try {
      const requests = [
        axios.get(`${API_URL}/admin/reports?admin_id=${backendUser.id}`),
        axios.get(`${API_URL}/admin/users?admin_id=${backendUser.id}`)
      ];

      if (backendUser.role === 'admin') {
        requests.push(axios.get(`${API_URL}/admin/doctor-verifications?admin_id=${backendUser.id}&status=pending`));
      }

      const responses = await Promise.all(requests);
      
      setReports(responses[0].data);
      setUsers(responses[1].data);
      if (backendUser.role === 'admin') {
        setVerifications(responses[2].data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
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
      console.error('Error:', error);
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
      console.error('Error:', error);
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
      await axios.post(`${API_URL}/admin/ban-user?admin_id=${backendUser.id}&user_id=${userId}&reason=${encodeURIComponent(reason)}`);
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
      await axios.delete(`${API_URL}/admin/posts/${postId}/moderate?admin_id=${backendUser.id}&reason=${encodeURIComponent(reason)}`);
      await handleResolveReport(reportId);
      showSuccess('Post deleted');
    } catch (error) {
      showError('Failed to delete post');
    }
  };

  if (!backendUser || (backendUser.role !== 'admin' && backendUser.role !== 'moderator')) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl blur-2xl" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-gray-100">
            <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Access Denied</h2>
            <p className="text-gray-600 text-lg">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <Shield className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingReports = reports.filter(r => r.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      {/* Decorative Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Header */}
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-primary/10 to-purple-500/10 rounded-3xl blur-2xl" />
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <Sparkles className="w-5 h-5 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Manage and moderate your community</p>
              </div>
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-primary/20 rounded-2xl border border-purple-200">
              <span className="text-purple-700 font-bold text-lg capitalize">{backendUser.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-2xl blur-xl" />
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex overflow-x-auto">
            {backendUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('verifications')}
                className={`flex-1 py-5 px-6 text-center font-bold transition-all relative whitespace-nowrap ${
                  activeTab === 'verifications'
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>Doctor Verifications</span>
                  {verifications.length > 0 && (
                    <span className="px-2.5 py-0.5 bg-primary text-white rounded-full text-xs font-bold">
                      {verifications.length}
                    </span>
                  )}
                </div>
                {activeTab === 'verifications' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-500" />
                )}
              </button>
            )}
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 py-5 px-6 text-center font-bold transition-all relative whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Flag className="w-5 h-5" />
                <span>Reports</span>
                {pendingReports > 0 && (
                  <span className="px-2.5 py-0.5 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">
                    {pendingReports}
                  </span>
                )}
              </div>
              {activeTab === 'reports' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-5 px-6 text-center font-bold transition-all relative whitespace-nowrap ${
                activeTab === 'users'
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                <span>Users</span>
                <span className="px-2.5 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-bold">
                  {users.length}
                </span>
              </div>
              {activeTab === 'users' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Doctor Verifications Tab */}
      {activeTab === 'verifications' && backendUser.role === 'admin' && (
        <div className="space-y-6">
          {verifications.length === 0 ? (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-primary/10 rounded-3xl blur-2xl" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-12 text-center border border-gray-100">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">All Caught Up!</h3>
                <p className="text-gray-600">No pending verifications at the moment.</p>
              </div>
            </div>
          ) : (
            verifications.map((verification, index) => (
              <div 
                key={verification.id}
                className="group relative"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.5s ease-out forwards',
                  opacity: 0
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-primary rounded-2xl flex items-center justify-center">
                          <Award className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-800">{verification.full_name}</h3>
                          <span className="inline-block mt-1 px-4 py-1.5 bg-gradient-to-r from-blue-500/20 to-primary/20 text-blue-800 rounded-full text-sm font-bold border border-blue-200">
                            {verification.specialization}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-sm text-gray-500 mb-1 font-medium">License Number</p>
                          <p className="font-bold text-gray-800">{verification.license_number}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-sm text-gray-500 mb-1 font-medium">Phone</p>
                          <p className="font-bold text-gray-800">{verification.phone_number}</p>
                        </div>
                        <div className="md:col-span-2 bg-gray-50 rounded-2xl p-4">
                          <p className="text-sm text-gray-500 mb-1 font-medium">Clinic Address</p>
                          <p className="font-bold text-gray-800">{verification.clinic_address}</p>
                        </div>
                        <div className="md:col-span-2 bg-gray-50 rounded-2xl p-4">
                          <p className="text-sm text-gray-500 mb-1 font-medium">Bio</p>
                          <p className="text-gray-700 leading-relaxed">{verification.bio}</p>
                        </div>
                      </div>

                      {verification.license_document_url && (
                        <button
                          onClick={() => setSelectedDoc(verification.license_document_url)}
                          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold mb-4 group/btn"
                        >
                          <FileText className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                          <span>View License Document</span>
                        </button>
                      )}

                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        Submitted: {new Date(verification.submitted_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex lg:flex-col gap-3">
                      <button
                        onClick={() => handleApproveDoctor(verification.id)}
                        className="flex-1 lg:flex-none px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl hover:shadow-xl transition-all font-bold flex items-center justify-center gap-2 group/btn"
                      >
                        <CheckCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectDoctor(verification.id)}
                        className="flex-1 lg:flex-none px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl hover:shadow-xl transition-all font-bold flex items-center justify-center gap-2 group/btn"
                      >
                        <X className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedDoc(null)}>
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-purple-500/5">
              <h3 className="text-2xl font-bold text-gray-800">License Document</h3>
              <button
                onClick={() => setSelectedDoc(null)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-100px)]">
              <img src={selectedDoc} alt="License Document" className="w-full rounded-2xl shadow-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {pendingReports === 0 ? (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-primary/10 rounded-3xl blur-2xl" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-12 text-center border border-gray-100">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">All Clear!</h3>
                <p className="text-gray-600">No pending reports to review.</p>
              </div>
            </div>
          ) : (
            reports.filter(r => r.status === 'pending').map((report, index) => (
              <div 
                key={report.id}
                className="group relative"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.5s ease-out forwards',
                  opacity: 0
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-800 rounded-full text-sm font-bold border border-red-200">
                          {report.target_type}
                        </span>
                        <span className="text-gray-500 text-sm font-mono">
                          ID: {report.target_id}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                        <p className="text-gray-700 leading-relaxed"><strong className="text-gray-900">Reason:</strong> {report.reason}</p>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        Reported: {new Date(report.created_at).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {report.target_type === 'post' && (
                        <button
                          onClick={() => handleDeletePost(report.id, report.target_id)}
                          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl hover:shadow-xl transition-all font-bold flex items-center gap-2 whitespace-nowrap group/btn"
                        >
                          <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          <span>Delete Post</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleResolveReport(report.id)}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl hover:shadow-xl transition-all font-bold flex items-center gap-2 whitespace-nowrap group/btn"
                      >
                        <CheckCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span>Resolve</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-3xl blur-xl" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-sm font-bold text-gray-900">{user.username}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                          user.role === 'admin' ? 'bg-purple-500/20 text-purple-800 border-purple-200' :
                          user.role === 'moderator' ? 'bg-blue-500/20 text-blue-800 border-blue-200' :
                          user.role === 'doctor' ? 'bg-green-500/20 text-green-800 border-green-200' :
                          user.role === 'banned' ? 'bg-red-500/20 text-red-800 border-red-200' :
                          'bg-gray-100 text-gray-700 border-gray-200'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {backendUser.role === 'admin' && user.role !== 'admin' && user.id !== backendUser.id && (
                          <div className="flex gap-2">
                            {user.role !== 'moderator' && user.role !== 'banned' && (
                              <button
                                onClick={() => handlePromoteUser(user.id, user.username, 'moderator')}
                                className="px-4 py-2 bg-blue-500/10 text-blue-700 rounded-xl hover:bg-blue-500/20 transition-colors font-semibold"
                              >
                                Make Mod
                              </button>
                            )}
                            {user.role !== 'banned' && (
                              <button
                                onClick={() => handleBanUser(user.id, user.username)}
                                className="px-4 py-2 bg-red-500/10 text-red-700 rounded-xl hover:bg-red-500/20 transition-colors font-semibold"
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
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;