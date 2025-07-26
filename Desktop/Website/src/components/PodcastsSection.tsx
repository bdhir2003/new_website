'use client';

import { useState, useEffect } from 'react';
import { Play, Calendar, Headphones, ExternalLink } from 'lucide-react';

interface Podcast {
  _id: string;
  title: string;
  description: string;
  platform: string;
  episodeNumber?: number;
  publishDate: string;
  duration?: string;
  audioUrl?: string;
  spotifyUrl?: string;
  applePodcastsUrl?: string;
  thumbnail?: string;
}

export default function PodcastsSection() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const response = await fetch('/api/portfolio/podcasts');
      const result = await response.json();
      
      if (result.success) {
        setPodcasts(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching podcasts:', error);
    } finally {
      setLoading(false);
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

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'spotify':
        return 'bg-green-100 text-green-800';
      case 'apple podcasts':
        return 'bg-purple-100 text-purple-800';
      case 'google podcasts':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <section id="podcasts" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Podcasts</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="animate-pulse">Loading podcasts...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="podcasts" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Podcasts</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4">
            Sharing knowledge and insights through audio content
          </p>
        </div>

        {podcasts.length === 0 ? (
          <div className="text-center text-gray-600">
            <Headphones size={48} className="mx-auto text-gray-400 mb-4" />
            <p>No podcasts added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {podcasts.map((podcast) => (
              <div
                key={podcast._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {podcast.thumbnail && (
                  <div className="h-48 bg-gray-200 overflow-hidden relative">
                    <img
                      src={podcast.thumbnail}
                      alt={podcast.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <Play size={48} className="text-white" />
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlatformColor(podcast.platform)}`}>
                      {podcast.platform}
                    </span>
                    {podcast.episodeNumber && (
                      <span className="text-sm text-gray-500">
                        Episode {podcast.episodeNumber}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{podcast.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{podcast.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      {formatDate(podcast.publishDate)}
                    </div>
                    {podcast.duration && (
                      <span>{podcast.duration}</span>
                    )}
                  </div>
                  
                  {/* Platform Links */}
                  <div className="flex flex-wrap gap-2">
                    {podcast.audioUrl && (
                      <a
                        href={podcast.audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        <Play size={14} className="mr-1" />
                        Play
                      </a>
                    )}
                    {podcast.spotifyUrl && (
                      <a
                        href={podcast.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Spotify
                      </a>
                    )}
                    {podcast.applePodcastsUrl && (
                      <a
                        href={podcast.applePodcastsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Apple
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
