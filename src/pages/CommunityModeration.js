import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Users, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { useUserSync } from '../hooks/useUserSync';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const CommunityModeration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUser } = useUserSync();
  const { showSuccess, showError } = useToast();
  
  const [community, setCommunity] = useState(null);
  const [moderators, setModerators] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (backendUser && (backendUser.role === 'admin' || backendUser.role === 'moderator')) {
      fetchData();
    }
  }, [backendUser, id]);

  const fetchData = async () => {
    try {
      const [communityRes, moderatorsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/communities/${id}`),
        axios.get(`${API_URL}/admin/communities/${id}/moderators`),
        axios.get(`${API_URL}/admin/users?admin_id=${backendUser.id}`)
      ]);
      
      setCommunity(communityRes.data);
      setModerators(moderatorsRes.data);
      setAllUsers(usersRes.data.filter(u => u.role !== 'banned'));
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddModerator = async (userId) => {
    try {
      await axios.post(`${API_URL}/admin/communities/${id}/moderators?admin_id=${backendUser.id}&user_id=${userId}`);
      showSuccess('Moderator added successfully');
      setShowAddModal(false);
      fetchData();
    } catch (error) {
      showError('Failed to add moderator');
    }
  };

  const handleRemoveModerator = async (userId, username) => {
    if (!window.confirm(`Remove ${username} as moderator?`)) return;

    try {
      await axios.delete(`${API_URL}/admin/communities/${id}/moderators/${userId}?admin_id=${backendUser.id}`);
      showSuccess('Moderator removed');
      fetchData();
    } catch (error) {
      showError('Failed to remove moderator');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!backendUser || (backendUser.role !== 'admin' && backendUser.role !== 'moderator')) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Access Denied</p>
      </div>
    );
  }

  const existingModeratorIds = moderators.map(m => m.user_id);
  const availableUsers = allUsers.filter(u => !existingModeratorIds.includes(u.id));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <button 
        onClick={() => navigate(`/community/${id}`)}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Community</span>
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{community?.name}</h1>
          <p className="text-gray-600">Manage Community Moderators</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add Moderator</span>
        </button>
      </div>

      {/* Moderators List */}
      <div className="bg-white rounded-lg shadow-md">
        {moderators.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No moderators assigned yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {moderators.map(mod => {
              const user = allUsers.find(u => u.id === mod.user_id);
              if (!user) return null;
              
              return (
                <div key={mod.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-800">{user.username}</p>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">
                          <Shield className="w-3 h-3 inline mr-1" />
                          Moderator
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">
                        Added: {new Date(mod.assigned_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {backendUser.role === 'admin' && (
                    <button
                      onClick={() => handleRemoveModerator(user.id, user.username)}
                      className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Moderator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Add Moderator</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              {availableUsers.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No users available to add</p>
              ) : (
                <div className="space-y-2">
                  {availableUsers.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.username}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddModerator(user.id)}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityModeration;