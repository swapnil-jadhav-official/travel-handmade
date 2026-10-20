'use client';

import { useEffect, useState } from 'react';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { getSiteSettings, updateSiteSettings } from '@/lib/settings';
import { X, Image as ImageIcon, Search } from 'lucide-react';

export default function SettingsPage(): React.ReactElement {
  const [logoUrl, setLogoUrl] = useState('');
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [isUploadingOg, setIsUploadingOg] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingSeo, setIsSavingSeo] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();
        if (data) {
          setLogoUrl(data.logoUrl || '');
          setSiteName(data.siteName || '');
          setSiteDescription(data.siteDescription || '');
          setOgTitle(data.ogTitle || '');
          setOgDescription(data.ogDescription || '');
          setOgImageUrl(data.ogImageUrl || '');
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const url = await uploadImageToCloudinary(file);
      setLogoUrl(url);
      setMessage('Logo uploaded successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to upload logo. Please try again.');
      console.error('Logo upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      await updateSiteSettings({ logoUrl });
      setMessage('Logo saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingOg(true);
    setError('');
    try {
      const url = await uploadImageToCloudinary(file);
      setOgImageUrl(url);
      setMessage('OG image uploaded successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('OG image upload error:', err);
    } finally {
      setIsUploadingOg(false);
    }
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSeo(true);
    setError('');
    setMessage('');

    try {
      await updateSiteSettings({ siteName, siteDescription, ogTitle, ogDescription, ogImageUrl });
      setMessage('SEO settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to save SEO settings. Please try again.');
      console.error('Save error:', err);
    } finally {
      setIsSavingSeo(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="max-w-6xl mx-auto w-full p-8">
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="max-w-6xl mx-auto w-full p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Logo */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center gap-3 p-6 border-b border-gray-200 bg-gray-50">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ImageIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Site Logo</h2>
              <p className="text-sm text-gray-500">Manage your site logo</p>
            </div>
          </div>
          <form onSubmit={handleSave} className="p-6">
            <div className="flex items-start gap-6 mb-6">
              {logoUrl ? (
                <div className="relative">
                  <div className="bg-black rounded p-3">
                    <img src={logoUrl} alt="Site Logo" className="h-24 object-contain" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setLogoUrl('')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-xs text-gray-500 text-center">No logo</span>
                </div>
              )}
              <div className="flex-1">
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={isUploading}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-black file:text-white
                    hover:file:bg-gray-900
                    disabled:file:bg-gray-400"
                />
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:bg-gray-400 transition"
            >
              {isSaving ? 'Saving...' : 'Save Logo'}
            </button>
          </form>
        </div>

        {/* SEO & Sharing */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mt-8">
          <div className="flex items-center gap-3 p-6 border-b border-gray-200 bg-gray-50">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">SEO & Sharing</h2>
              <p className="text-sm text-gray-500">Controls the title and description shown in search results and social sharing previews</p>
            </div>
          </div>
          <form onSubmit={handleSaveSeo} className="p-6 space-y-5">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                Site Title
              </label>
              <input
                id="siteName"
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Travel Handmade"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <p className="text-xs text-gray-500 mt-1">Used as the default page title and in the title template (e.g. &quot;Article Title | Site Title&quot;)</p>
            </div>
            <div>
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                id="siteDescription"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                placeholder="A digital publication for conscious travellers..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Shown in Google search results. Aim for 150–160 characters.</p>
            </div>
            <div>
              <label htmlFor="ogTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Share Title
              </label>
              <input
                id="ogTitle"
                type="text"
                value={ogTitle}
                onChange={(e) => setOgTitle(e.target.value)}
                placeholder="Travel Handmade — Conscious Travel & Cultural Storytelling"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <p className="text-xs text-gray-500 mt-1">Title shown when the homepage is shared on WhatsApp, Twitter, LinkedIn, etc.</p>
            </div>
            <div>
              <label htmlFor="ogDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Share Description
              </label>
              <textarea
                id="ogDescription"
                value={ogDescription}
                onChange={(e) => setOgDescription(e.target.value)}
                placeholder="A digital publication for conscious travellers. Discover cultural storytelling..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Description shown when the homepage is shared on social media.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Share Image</label>
              <div className="flex items-start gap-4">
                {ogImageUrl ? (
                  <div className="relative flex-shrink-0">
                    <img src={ogImageUrl} alt="OG Image" className="w-40 h-24 object-cover rounded border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => setOgImageUrl('')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-40 h-24 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <span className="text-xs text-gray-500 text-center px-2">No image<br/>1200×630</span>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleOgImageUpload}
                    disabled={isUploadingOg}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-black file:text-white
                      hover:file:bg-gray-900
                      disabled:file:bg-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-2">Recommended 1200×630px. Shown when the homepage is shared on social media.</p>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSavingSeo}
              className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:bg-gray-400 transition"
            >
              {isSavingSeo ? 'Saving...' : 'Save SEO Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
