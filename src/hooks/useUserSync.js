import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createUser, getUserByFirebaseUid } from '../services/api';

export const useUserSync = () => {
  const { currentUser } = useAuth();
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const syncUser = async () => {
      if (currentUser) {
        try {
          console.log('Syncing user with Firebase UID:', currentUser.uid);
          
          // Try to get user from backend
          let user;
          try {
            user = await getUserByFirebaseUid(currentUser.uid);
            console.log('User found in backend:', user);
          } catch (err) {
            console.log('User not found, creating new user...');
            // User doesn't exist in backend, create them
            user = await createUser({
              firebase_uid: currentUser.uid,
              username: currentUser.displayName || currentUser.email.split('@')[0],
              email: currentUser.email,
            });
            console.log('User created:', user);
          }
          
          setBackendUser(user);
        } catch (error) {
          console.error('Error syncing user:', error);
          setError(error.message);
        }
      } else {
        setBackendUser(null);
      }
      setLoading(false);
    };

    syncUser();
  }, [currentUser]);

  return { backendUser, loading, error };
};