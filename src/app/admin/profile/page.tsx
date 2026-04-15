'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/lib/users';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Camera, MapPin, Globe, Twitter, Instagram, User, FileText, AlignLeft, Mail } from 'lucide-react';

const inputCls =
  'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition bg-white';

function Label({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
      {icon}{text}
    </label>
  );
}

export default function ProfilePage(): React.ReactElement {
  const { user, userProfile, refreshProfile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [details, setDetails] = useState(userProfile?.details || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [country, setCountry] = useState(userProfile?.country || '');
  const [twitterUrl, setTwitterUrl] = useState(userProfile?.socialLinks?.twitter || '');
  const [instagramUrl, setInstagramUrl] = useState(userProfile?.socialLinks?.instagram || '');
  const [websiteUrl, setWebsiteUrl] = useState(userProfile?.socialLinks?.website || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setAvatarUrl(url);
    } catch {
      setError('Failed to upload avatar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setError('');
    setMessage('');
    try {
      await updateUserProfile(user.uid, {
        displayName, bio, details, city, country, avatarUrl,
        socialLinks: { twitter: twitterUrl, instagram: instagramUrl, website: websiteUrl },
        updatedAt: new Date().toISOString(),
      });
      await updateProfile(auth.currentUser!, { displayName, photoURL: avatarUrl });
      await refreshProfile();
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setError('Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const initials = displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto w-full p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your public author profile</p>
        </div>

        {message && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            ✓ {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">

          {/* ── Avatar + identity row ── */}
          <div className="border border-gray-200 rounded-xl bg-white p-6">
            <div className="flex items-center gap-8">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-900 flex items-center justify-center">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-semibold text-white">{initials}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition shadow"
                >
                  {isUploading
                    ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    : <Camera className="w-3 h-3" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </div>

              {/* Name + email — takes remaining space as a 2-col grid */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <Label icon={<User className="w-3 h-3" />} text="Display Name" />
                  <input
                    type="text" value={displayName} required
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your full name"
                    className={inputCls}
                  />
                </div>
                <div>
                  <Label icon={<Mail className="w-3 h-3" />} text="Email" />
                  <input
                    type="email" value={user?.email || ''} disabled
                    className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Location + Social ── */}
          <div className="border border-gray-200 rounded-xl bg-white divide-y divide-gray-100">
            <div className="p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Location</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label icon={<MapPin className="w-3 h-3" />} text="City" />
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai" className={inputCls} />
                </div>
                <div>
                  <Label icon={<MapPin className="w-3 h-3" />} text="Country" />
                  <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. India" className={inputCls} />
                </div>
              </div>
            </div>

            <div className="p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Social Links</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label icon={<Twitter className="w-3 h-3" />} text="Twitter / X" />
                  <input type="url" value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} placeholder="https://twitter.com/…" className={inputCls} />
                </div>
                <div>
                  <Label icon={<Instagram className="w-3 h-3" />} text="Instagram" />
                  <input type="url" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/…" className={inputCls} />
                </div>
                <div>
                  <Label icon={<Globe className="w-3 h-3" />} text="Website" />
                  <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://yoursite.com" className={inputCls} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Bio + Details side by side ── */}
          <div className="border border-gray-200 rounded-xl bg-white p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">About You</p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label icon={<FileText className="w-3 h-3" />} text="Short Bio" />
                <textarea
                  value={bio} rows={5}
                  onChange={(e) => setBio(e.target.value.slice(0, 500))}
                  placeholder="One or two lines about yourself…"
                  className={`${inputCls} resize-none`}
                />
                <p className="text-xs text-gray-400 text-right mt-1">{bio.length}/500</p>
              </div>
              <div>
                <Label icon={<AlignLeft className="w-3 h-3" />} text="Author Details" />
                <textarea
                  value={details} rows={5}
                  onChange={(e) => setDetails(e.target.value.slice(0, 1000))}
                  placeholder="Detailed background and expertise…"
                  className={`${inputCls} resize-none`}
                />
                <p className="text-xs text-gray-400 text-right mt-1">{details.length}/1000</p>
              </div>
            </div>
          </div>

          {/* ── Save ── */}
          <div className="flex items-center gap-4">
            <button
              type="submit" disabled={isSaving}
              className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50 transition"
            >
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
