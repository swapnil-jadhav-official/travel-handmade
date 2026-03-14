'use client';

import { useEffect, useState } from 'react';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { getSiteSettings, updateSiteSettings } from '@/lib/settings';
import type { SiteSettings } from '@/lib/settings';
import { X } from 'lucide-react';

export default function SettingsPage(): React.ReactElement {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [logoUrl, setLogoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();
        if (data) {
          setSettings(data);
          setLogoUrl(data.logoUrl || '');
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
        <div className="max-w-2xl mx-auto w-full p-8">
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="max-w-2xl mx-auto w-full p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <form onSubmit={handleSave} className="space-y-8">
          {message && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Site Logo
            </label>
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
                      file:bg-black file:text-white
                      hover:file:bg-gray-900
                      disabled:file:bg-gray-400"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:bg-gray-400 transition"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
