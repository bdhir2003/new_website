'use client';

import { useState, useEffect } from 'react';
import { Award, Calendar, ExternalLink, Building } from 'lucide-react';

interface AwardData {
  _id: string;
  title: string;
  organization: string;
  date: string;
  description?: string;
  category: string;
  image?: string;
  certificateUrl?: string;
}

export default function AwardsSection() {
  const [awards, setAwards] = useState<AwardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const response = await fetch('/api/portfolio/awards');
      const result = await response.json();
      
      if (result.success) {
        setAwards(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching awards:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    } catch {
      return dateString;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Academic':
        return 'bg-blue-100 text-blue-800';
      case 'Professional':
        return 'bg-green-100 text-green-800';
      case 'Competition':
        return 'bg-purple-100 text-purple-800';
      case 'Recognition':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <section id="awards" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Awards</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="animate-pulse">Loading awards...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="awards" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Awards</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4">
            Recognition for excellence and outstanding achievements
          </p>
        </div>

        {awards.length === 0 ? (
          <div className="text-center text-gray-600">
            <Award size={48} className="mx-auto text-gray-400 mb-4" />
            <p>No awards added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awards.map((award) => (
              <div
                key={award._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                {award.image && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={award.image}
                      alt={award.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(award.category)}`}>
                      {award.category}
                    </span>
                    {award.certificateUrl && (
                      <a
                        href={award.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Certificate"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{award.title}</h3>
                  
                  <div className="flex items-center text-sm font-medium text-blue-600 mb-3">
                    <Building size={16} className="mr-2" />
                    {award.organization}
                  </div>
                  
                  {award.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{award.description}</p>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-2" />
                    {formatDate(award.date)}
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
