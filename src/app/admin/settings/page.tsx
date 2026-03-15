'use client';

import { useEffect, useState } from 'react';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { getSiteSettings, updateSiteSettings } from '@/lib/settings';
import type { SiteSettings } from '@/lib/settings';
import { X, Image as ImageIcon, Video, ChevronDown } from 'lucide-react';

type SettingSection = 'logo' | 'featured-video';

export default function SettingsPage(): React.ReactElement {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [logoUrl, setLogoUrl] = useState('');
  const [featuredVideoUrl, setFeaturedVideoUrl] = useState('');
  const [featuredVideoTitle, setFeaturedVideoTitle] = useState('');
  const [featuredVideoCreator, setFeaturedVideoCreator] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<SettingSection>>(
    new Set()
  );

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();
        if (data) {
          setSettings(data);
          setLogoUrl(data.logoUrl || '');
          setFeaturedVideoUrl(data.featuredVideoUrl || '');
          setFeaturedVideoTitle(data.featuredVideoTitle || '');
          setFeaturedVideoCreator(data.featuredVideoCreator || '');
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const toggleSection = (section: SettingSection) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

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

  const handleRemoveLogo = () => {
    setLogoUrl('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      await updateSiteSettings({
        logoUrl,
        featuredVideoUrl: featuredVideoUrl.trim() || undefined,
        featuredVideoTitle: featuredVideoTitle.trim() || undefined,
        featuredVideoCreator: featuredVideoCreator.trim() || undefined,
      });
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
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

        {/* Settings Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Logo Card */}
          <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <button
              onClick={() => toggleSection('logo')}
              className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-transparent hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ImageIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Site Logo</h3>
                  <p className="text-sm text-gray-600">Manage your site logo</p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  expandedSections.has('logo') ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expandedSections.has('logo') && (
              <form onSubmit={handleSave} className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex items-start gap-6">
                  {logoUrl ? (
                    <div className="relative">
                      <img
                        src={logoUrl}
                        alt="Site Logo"
                        className="h-24 object-contain"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
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
                    <label htmlFor="logo" className="block">
                      <span className="sr-only">Upload logo</span>
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
                          file:bg-blue-600 file:text-white
                          hover:file:bg-blue-700
                          disabled:file:bg-gray-400"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Featured Video Card */}
          <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <button
              onClick={() => toggleSection('featured-video')}
              className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-transparent hover:bg-purple-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Video className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Featured Video</h3>
                  <p className="text-sm text-gray-600">Manage Stories left card video</p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  expandedSections.has('featured-video') ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expandedSections.has('featured-video') && (
              <form onSubmit={handleSave} className="border-t border-gray-200 p-6 bg-gray-50 space-y-4">
                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube Video URL
                  </label>
                  <input
                    type="url"
                    value={featuredVideoUrl}
                    onChange={(e) => setFeaturedVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                  />
                </div>

                {/* Video Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Title
                  </label>
                  <input
                    type="text"
                    value={featuredVideoTitle}
                    onChange={(e) => setFeaturedVideoTitle(e.target.value)}
                    placeholder="Enter video title..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                  />
                </div>

                {/* Creator Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creator/Traveller Name
                  </label>
                  <input
                    type="text"
                    value={featuredVideoCreator}
                    onChange={(e) => setFeaturedVideoCreator(e.target.value)}
                    placeholder="Enter creator name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                  />
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Save Button */}
        {expandedSections.size > 0 && (
          <div className="flex gap-3 sticky bottom-8">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:bg-gray-400 transition"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
