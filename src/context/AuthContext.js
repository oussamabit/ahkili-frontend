import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserByFirebaseUid } from '../services/api';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signup = async (email, password, username) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Update profile with username
    await updateProfile(result.user, {
      displayName: username
    });
    return result;
  };

  // Login with email and password
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Login with Google
  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  // Listen for auth state changes
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Fetch the database user using Firebase UID
        const dbUser = await getUserByFirebaseUid(user.uid);
        // Combine Firebase user with database user data
        setCurrentUser({
          ...user,
          id: dbUser.id,
          username: dbUser.username,
          email: dbUser.email,
          role: dbUser.role,
          verified: dbUser.verified
        });
      } catch (error) {
        console.error('Error fetching user from database:', error);
        setCurrentUser(user); // Fallback to just Firebase user
      }
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  });

  return unsubscribe;
}, []);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};