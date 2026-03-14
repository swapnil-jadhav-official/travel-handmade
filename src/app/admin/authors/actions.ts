'use server';

import { db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import type { UserRole } from '@/types';

export async function createAuthorAction(
  email: string,
  password: string,
  displayName: string,
  role: UserRole,
  city: string = '',
  country: string = ''
): Promise<{ uid: string; error?: string }> {
  try {
    const uid = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Create user document in Firestore with password
    await setDoc(doc(db, 'users', uid), {
      uid,
      email,
      password,
      displayName,
      role,
      bio: '',
      avatarUrl: '',
      city,
      country,
      socialLinks: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { uid };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create author';
    return { uid: '', error: message };
  }
}

export async function deleteAuthorAction(uid: string): Promise<{ error?: string }> {
  try {
    await deleteDoc(doc(db, 'users', uid));
    return {};
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete author';
    return { error: message };
  }
}

export async function updateAuthorRoleAction(
  uid: string,
  role: UserRole
): Promise<{ error?: string }> {
  try {
    await updateDoc(doc(db, 'users', uid), {
      role,
      updatedAt: new Date().toISOString(),
    });
    return {};
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update author role';
    return { error: message };
  }
}

export async function updateAuthorProfileAction(
  uid: string,
  displayName: string,
  email: string,
  password: string,
  bio: string,
  avatarUrl: string,
  city: string = '',
  country: string = '',
  socialLinks?: { twitter?: string; instagram?: string; website?: string }
): Promise<{ error?: string }> {
  try {
    const updateData: any = {
      displayName,
      email,
      bio,
      avatarUrl,
      city,
      country,
      socialLinks: socialLinks || {},
      updatedAt: new Date().toISOString(),
    };

    // Only update password if provided
    if (password) {
      updateData.password = password;
    }

    await updateDoc(doc(db, 'users', uid), updateData);
    return {};
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update author profile';
    return { error: message };
  }
}
