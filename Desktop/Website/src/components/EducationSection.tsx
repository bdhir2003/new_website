'use client';

import { useState, useEffect } from 'react';
import { Education } from '@/types';
import { Calendar, GraduationCap, MapPin } from 'lucide-react';

export default function EducationSection() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await fetch('/api/portfolio/education');
      const result = await response.json();
      if (result.success) {
        setEducation(result.data);
      }
    } catch (error) {
      console.error('Error fetching education data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  if (loading) {
    return (
      <section id="education" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
              <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
            </div>
          </div>
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Education</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {education.length === 0 ? (
          <div className="text-center text-gray-600">
            <GraduationCap size={64} className="mx-auto mb-4 text-gray-400" />
            <p>No education information available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {education.map((edu, index) => (
              <div
                key={edu._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                    {/* Institution Logo/Icon */}
                    <div className="flex-shrink-0 mb-4 md:mb-0">
                      {edu.logo ? (
                        <img
                          src={edu.logo}
                          alt={edu.institution}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                          <GraduationCap className="text-white" size={24} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {edu.degree} in {edu.field}
                          </h3>
                          <p className="text-lg text-blue-600 font-medium">
                            {edu.institution}
                          </p>
                        </div>
                        
                        <div className="mt-2 md:mt-0 flex items-center text-gray-600">
                          <Calendar size={16} className="mr-2" />
                          <span>
                            {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                          </span>
                        </div>
                      </div>

                      {edu.gpa && (
                        <div className="mb-3">
                          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            GPA: {edu.gpa}
                          </span>
                        </div>
                      )}

                      {edu.description && (
                        <p className="text-gray-700 leading-relaxed">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Timeline connector */}
                {index < education.length - 1 && (
                  <div className="flex justify-center">
                    <div className="w-px h-8 bg-gradient-to-b from-blue-300 to-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
