'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Edit, Trash2, Mic, Play, ExternalLink } from 'lucide-react';

interface Podcast {
  _id?: string;
  title: string;
  description: string;
  platform: string;
  episodeNumber?: string;
  publishDate: string;
  duration?: string;
  podcastUrl?: string;
  spotifyUrl?: string;
  appleUrl?: string;
  youtubeUrl?: string;
  featured: boolean;
}

const podcastPlatforms = [
  'Spotify',
  'Apple Podcasts',
  'Google Podcasts',
  'YouTube',
  'SoundCloud',
  'Anchor',
  'Buzzsprout',
  'Other'
];

export default function PodcastsManager() {
  const [podcastsList, setPodcastsList] = useState<Podcast[]>([]);
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const response = await fetch('/api/portfolio/podcasts');
      const result = await response.json();
      
      if (result.success) {
        setPodcastsList(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching podcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (podcastData: Podcast) => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('auth-token');
      const method = podcastData._id ? 'PUT' : 'POST';
      const url = podcastData._id ? `/api/portfolio/podcasts/${podcastData._id}` : '/api/portfolio/podcasts';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify(podcastData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: `Podcast ${method === 'POST' ? 'added' : 'updated'} successfully!` });
        fetchPodcasts();
        setIsModalOpen(false);
        setEditingPodcast(null);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('auth-token');
          router.push('/admin');
        } else {
          setMessage({ type: 'error', text: result.message || 'Failed to save podcast' });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this podcast?')) return;

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/portfolio/podcasts/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Podcast deleted successfully!' });
        fetchPodcasts();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to delete podcast' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Podcasts</h1>
            </div>
            <button
              onClick={() => {
                setEditingPodcast({
                  title: '',
                  description: '',
                  platform: podcastPlatforms[0],
                  episodeNumber: '',
                  publishDate: '',
                  duration: '',
                  podcastUrl: '',
                  spotifyUrl: '',
                  appleUrl: '',
                  youtubeUrl: '',
                  featured: false,
                });
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus size={16} />
              <span>Add Podcast</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Podcasts List */}
        <div className="space-y-6">
          {podcastsList.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <Mic className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Podcasts Added</h3>
              <p className="text-gray-600 mb-4">Start by adding your podcast appearances or episodes</p>
              <button
                onClick={() => {
                  setEditingPodcast({
                    title: '',
                    description: '',
                    platform: podcastPlatforms[0],
                    episodeNumber: '',
                    publishDate: '',
                    duration: '',
                    podcastUrl: '',
                    spotifyUrl: '',
                    appleUrl: '',
                    youtubeUrl: '',
                    featured: false,
                  });
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add First Podcast
              </button>
            </div>
          ) : (
            podcastsList.map((podcast) => (
              <div key={podcast._id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{podcast.title}</h3>
                      {podcast.featured && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center space-x-1">
                        <Play size={14} />
                        <span>{podcast.platform}</span>
                      </span>
                      {podcast.episodeNumber && (
                        <span>Episode #{podcast.episodeNumber}</span>
                      )}
                      <span>{formatDate(podcast.publishDate)}</span>
                      {podcast.duration && (
                        <span>{podcast.duration}</span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-4">{podcast.description}</p>
                    
                    {/* Podcast Links */}
                    <div className="flex flex-wrap gap-2">
                      {podcast.podcastUrl && (
                        <a
                          href={podcast.podcastUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors text-sm"
                        >
                          <ExternalLink size={12} />
                          <span>Listen</span>
                        </a>
                      )}
                      {podcast.spotifyUrl && (
                        <a
                          href={podcast.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors text-sm"
                        >
                          <ExternalLink size={12} />
                          <span>Spotify</span>
                        </a>
                      )}
                      {podcast.appleUrl && (
                        <a
                          href={podcast.appleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 px-3 py-1 bg-gray-900 text-white hover:bg-gray-800 rounded transition-colors text-sm"
                        >
                          <ExternalLink size={12} />
                          <span>Apple</span>
                        </a>
                      )}
                      {podcast.youtubeUrl && (
                        <a
                          href={podcast.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors text-sm"
                        >
                          <ExternalLink size={12} />
                          <span>YouTube</span>
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingPodcast(podcast);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => podcast._id && handleDelete(podcast._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && editingPodcast && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {editingPodcast._id ? 'Edit Podcast' : 'Add Podcast'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSave(editingPodcast);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Podcast Title
                  </label>
                  <input
                    type="text"
                    value={editingPodcast.title}
                    onChange={(e) => setEditingPodcast({ ...editingPodcast, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Episode or podcast title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={editingPodcast.description}
                    onChange={(e) => setEditingPodcast({ ...editingPodcast, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Describe the podcast content..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Platform
                    </label>
                    <select
                      value={editingPodcast.platform}
                      onChange={(e) => setEditingPodcast({ ...editingPodcast, platform: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      {podcastPlatforms.map(platform => (
                        <option key={platform} value={platform}>{platform}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Episode Number
                    </label>
                    <input
                      type="text"
                      value={editingPodcast.episodeNumber || ''}
                      onChange={(e) => setEditingPodcast({ ...editingPodcast, episodeNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="e.g., 42"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={editingPodcast.duration || ''}
                      onChange={(e) => setEditingPodcast({ ...editingPodcast, duration: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="e.g., 45 min"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={editingPodcast.publishDate}
                    onChange={(e) => setEditingPodcast({ ...editingPodcast, publishDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Main Podcast URL
                    </label>
                    <input
                      type="url"
                      value={editingPodcast.podcastUrl || ''}
                      onChange={(e) => setEditingPodcast({ ...editingPodcast, podcastUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="https://podcast.com/episode"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Spotify URL
                    </label>
                    <input
                      type="url"
                      value={editingPodcast.spotifyUrl || ''}
                      onChange={(e) => setEditingPodcast({ ...editingPodcast, spotifyUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="https://open.spotify.com/episode/..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Apple Podcasts URL
                    </label>
                    <input
                      type="url"
                      value={editingPodcast.appleUrl || ''}
                      onChange={(e) => setEditingPodcast({ ...editingPodcast, appleUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="https://podcasts.apple.com/..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={editingPodcast.youtubeUrl || ''}
                      onChange={(e) => setEditingPodcast({ ...editingPodcast, youtubeUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={editingPodcast.featured}
                    onChange={(e) => setEditingPodcast({ ...editingPodcast, featured: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-semibold text-gray-800">
                    Featured Podcast
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingPodcast(null);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save size={16} />
                    <span>{saving ? 'Saving...' : 'Save Podcast'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
