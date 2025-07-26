'use client';

import { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Download, Calendar, Users, Tag } from 'lucide-react';
import { Publication } from '@/types';

export default function PublicationsSection() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await fetch('/api/portfolio/publications');
      const result = await response.json();
      if (result.success) {
        setPublications(result.data);
      }
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Journal Article': 'bg-blue-100 text-blue-800',
      'Conference Paper': 'bg-green-100 text-green-800',
      'Book Chapter': 'bg-purple-100 text-purple-800',
      'Thesis': 'bg-orange-100 text-orange-800',
      'Report': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    return colors[type as keyof typeof colors] || colors.Other;
  };

  if (loading) {
    return (
      <section id="publications" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Publications
            </h2>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (publications.length === 0) {
    return (
      <section id="publications" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Publications
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Coming soon - My research publications and scholarly work
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="publications" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Publications
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            My research contributions and scholarly publications in maternal and child health
          </p>
        </div>

        <div className="space-y-8">
          {publications.map((publication) => (
            <div 
              key={publication._id}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2 flex-1">
                      {publication.title}
                      {publication.featured && (
                        <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>{publication.authors.join(', ')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{formatDate(publication.publicationDate.toString())}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(publication.type)}`}>
                      {publication.type}
                    </span>
                    {publication.journal && (
                      <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                        {publication.journal}
                      </span>
                    )}
                    {publication.conference && (
                      <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                        {publication.conference}
                      </span>
                    )}
                  </div>

                  {publication.abstract && (
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {publication.abstract}
                    </p>
                  )}

                  {publication.keywords && publication.keywords.length > 0 && (
                    <div className="flex items-start space-x-2 mb-4">
                      <Tag size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="flex flex-wrap gap-1">
                        {publication.keywords.map((keyword, index) => (
                          <span 
                            key={index}
                            className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {publication.citation && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                      <p className="text-sm text-gray-600 italic">
                        {publication.citation}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {publication.url && (
                  <a
                    href={publication.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    <ExternalLink size={16} />
                    <span>View Publication</span>
                  </a>
                )}
                
                {publication.pdfUrl && (
                  <a
                    href={publication.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    <Download size={16} />
                    <span>Download PDF</span>
                  </a>
                )}

                {publication.doi && (
                  <a
                    href={`https://doi.org/${publication.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    <BookOpen size={16} />
                    <span>DOI: {publication.doi}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {publications.length > 5 && (
          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors duration-200 font-medium">
              View All Publications
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
