'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Edit3, Trash2, Play, ExternalLink, LogOut } from 'lucide-react';
import { Video } from '@/types';

export default function VideosManager() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState<Partial<Video>>({
    title: '',
    description: '',
    youtubeUrl: '',
    category: '',
    featured: false,
  });
  const router = useRouter();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/portfolio/videos');
      const result = await response.json();
      if (result.success) {
        setVideos(result.data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      localStorage.removeItem('auth-token');
      router.push('/admin');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('auth-token');
      router.push('/admin');
    }
  };

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getEmbedUrl = (url: string) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication required. Please login again.' });
        setSaving(false);
        return;
      }

      const url = editingVideo 
        ? `/api/portfolio/videos/${editingVideo._id}`
        : '/api/portfolio/videos';
      
      const method = editingVideo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: editingVideo ? 'Video updated successfully!' : 'Video added successfully!' 
        });
        setShowForm(false);
        setEditingVideo(null);
        setFormData({
          title: '',
          description: '',
          youtubeUrl: '',
          category: '',
          featured: false,
        });
        fetchVideos();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        if (response.status === 401) {
          setMessage({ 
            type: 'error', 
            text: 'Session expired. Please save your work and login again.' 
          });
        } else if (response.status === 403) {
          setMessage({ 
            type: 'error', 
            text: 'Access denied. Admin permissions required.' 
          });
        } else {
          setMessage({ type: 'error', text: result.message || 'Failed to save video' });
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      youtubeUrl: video.youtubeUrl,
      category: video.category || '',
      featured: video.featured || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (video: Video) => {
    if (!confirm(`Are you sure you want to delete "${video.title}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication required. Please login again.' });
        return;
      }

      const response = await fetch(`/api/portfolio/videos/${video._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Video deleted successfully!' });
        fetchVideos();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to delete video' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  const handleAddNew = () => {
    setEditingVideo(null);
    setFormData({
      title: '',
      description: '',
      youtubeUrl: '',
      category: '',
      featured: false,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVideo(null);
    setFormData({
      title: '',
      description: '',
      youtubeUrl: '',
      category: '',
      featured: false,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Video Showcase Management</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Add New Button */}
        {!showForm && (
          <div className="mb-8">
            <button
              onClick={handleAddNew}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus size={20} />
              <span>Add New Video</span>
            </button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingVideo ? 'Edit Video' : 'Add New Video'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Video Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-700"
                    placeholder="Enter video title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-700"
                    placeholder="e.g., Interview, Presentation, Conference"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.youtubeUrl || ''}
                  onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-700"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-700"
                  placeholder="Describe what this video is about..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured || false}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm font-bold text-gray-900">
                  Mark as featured video
                </label>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  <Save size={20} />
                  <span>{saving ? 'Saving...' : 'Save Video'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Videos List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Videos ({videos.length})
            </h2>
          </div>
          
          {videos.length === 0 ? (
            <div className="p-12 text-center">
              <Play className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No videos yet</h3>
              <p className="text-gray-700 font-medium mb-6">Add your first video to get started.</p>
              <button
                onClick={handleAddNew}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mx-auto"
              >
                <Plus size={20} />
                <span>Add New Video</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {videos.map((video) => (
                <div key={video._id} className="p-6">
                  <div className="flex items-start space-x-6">
                    {/* Video Thumbnail */}
                    <div className="flex-shrink-0 w-48 h-28 bg-gray-100 rounded-lg overflow-hidden">
                      {extractVideoId(video.youtubeUrl) ? (
                        <img
                          src={`https://img.youtube.com/vi/${extractVideoId(video.youtubeUrl)}/maxresdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="text-gray-400" size={24} />
                        </div>
                      )}
                    </div>
                    
                    {/* Video Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {video.title}
                            {video.featured && (
                              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                Featured
                              </span>
                            )}
                          </h3>
                          <p className="text-gray-800 font-medium mb-3 line-clamp-2">
                            {video.description}
                          </p>
                          {video.category && (
                            <span className="inline-block bg-gray-100 text-gray-900 font-medium text-sm px-3 py-1 rounded-full mb-3">
                              {video.category}
                            </span>
                          )}
                          <div className="flex items-center space-x-4 text-sm font-medium text-gray-700">
                            <a
                              href={video.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                              <ExternalLink size={14} />
                              <span>View on YouTube</span>
                            </a>
                            <span>•</span>
                            <span>
                              {video.createdAt 
                                ? new Date(video.createdAt).toLocaleDateString()
                                : 'No date'
                              }
                            </span>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(video)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(video)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
