'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getUserProfile, updateUserProfile } from '@/lib/users';
import type { UserProfile, UserRole } from '@/types';

// Simple user object for session management
interface SimpleUser {
  uid: string;
  email: string;
}

interface AuthContextValue {
  user: SimpleUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isSuperAdmin: () => boolean;
  isEditorOrAbove: () => boolean;
  canPublish: () => boolean;
  canManageUsers: () => boolean;
  canEditPost: (authorId: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    const savedEmail = localStorage.getItem('userEmail');

    if (savedUserId && savedEmail) {
      setUser({ uid: savedUserId, email: savedEmail });
      // Fetch the profile
      getUserProfile(savedUserId)
        .then(profile => setUserProfile(profile))
        .catch(error => {
          console.error('Error fetching profile:', error);
          localStorage.removeItem('userId');
          localStorage.removeItem('userEmail');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      // Query Firestore for user with matching email and password
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('email', '==', email),
        where('password', '==', password)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Invalid email or password');
      }

      const userDoc = querySnapshot.docs[0];
      const uid = userDoc.id;
      const profile = userDoc.data() as UserProfile;

      // Save to localStorage
      localStorage.setItem('userId', uid);
      localStorage.setItem('userEmail', email);

      setUser({ uid, email });
      setUserProfile(profile);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    setUser(null);
    setUserProfile(null);
  };

  const refreshProfile = async (): Promise<void> => {
    if (!user) return;
    try {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error refreshing profile:', error);
      throw error;
    }
  };

  // Role check helpers
  const isSuperAdmin = (): boolean => {
    return userProfile?.role === 'super_admin';
  };

  const isEditorOrAbove = (): boolean => {
    return userProfile?.role === 'editor' || userProfile?.role === 'super_admin';
  };

  const canPublish = (): boolean => {
    return (
      userProfile?.role === 'author' ||
      userProfile?.role === 'editor' ||
      userProfile?.role === 'super_admin'
    );
  };

  const canManageUsers = (): boolean => {
    return userProfile?.role === 'editor' || userProfile?.role === 'super_admin';
  };

  const canEditPost = (authorId: string): boolean => {
    if (isEditorOrAbove()) return true;
    return user?.uid === authorId;
  };

  const value: AuthContextValue = {
    user,
    userProfile,
    loading,
    signIn,
    signOut,
    refreshProfile,
    isSuperAdmin,
    isEditorOrAbove,
    canPublish,
    canManageUsers,
    canEditPost,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
