'use client';

import { useState, useEffect } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { Video } from '@/types';

export default function VideoShowcase() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

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

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getEmbedUrl = (url: string) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  if (loading) {
    return (
      <section id="videos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Video Showcase - My Work in Action
            </h2>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return (
      <section id="videos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Video Showcase - My Work in Action
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Coming soon - Video content showcasing my work and achievements
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="videos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Video Showcase - My Work in Action
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Watch me in action - presentations, interviews, and highlights from my work in maternal and child health
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {videos.map((video, index) => (
            <div 
              key={video._id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                index === 0 && videos.length > 1 ? 'lg:col-span-2' : ''
              }`}
            >
              <div className={`relative ${index === 0 && videos.length > 1 ? 'aspect-video' : 'aspect-video'}`}>
                <iframe
                  src={getEmbedUrl(video.youtubeUrl)}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {video.title}
                  </h3>
                  {video.featured && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-2 flex-shrink-0">
                      Featured
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {video.description}
                </p>
                
                {video.category && (
                  <div className="mb-4">
                    <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                      {video.category}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    <ExternalLink size={16} />
                    <span>Watch on YouTube</span>
                  </a>
                  
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Play size={16} />
                    <span className="text-sm">Video</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {videos.length > 4 && (
          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors duration-200 font-medium">
              View All Videos
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
