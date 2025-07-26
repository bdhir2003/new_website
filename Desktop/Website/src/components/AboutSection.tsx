'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AboutMe as AboutMeType } from '@/types';
import { MapPin, Mail, Phone, Github, Linkedin, Twitter, Instagram } from 'lucide-react';

export default function AboutSection() {
  const [aboutData, setAboutData] = useState<AboutMeType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/portfolio/about');
      const result = await response.json();
      if (result.success) {
        setAboutData(result.data);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const socialIcons = {
    linkedin: Linkedin,
    github: Github,
    twitter: Twitter,
    instagram: Instagram,
  };

  if (loading) {
    return (
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-8"></div>
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-48 mx-auto mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto"></div>
                <div className="h-4 bg-gray-300 rounded w-4/6 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!aboutData) {
    return (
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">About Me</h2>
            <p className="text-gray-600">About information is not available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">About Me</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {aboutData.profileImage ? (
                <Image
                  src={aboutData.profileImage}
                  alt={aboutData.name}
                  width={400}
                  height={400}
                  className="rounded-2xl shadow-2xl object-cover"
                />
              ) : (
                <div className="w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">
                    {aboutData.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">👋</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{aboutData.name}</h3>
              <p className="text-xl text-blue-600 font-medium mb-6">{aboutData.title}</p>
              <p className="text-gray-700 leading-relaxed text-lg">{aboutData.description}</p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-600" size={20} />
                <a href={`mailto:${aboutData.email}`} className="text-gray-700 hover:text-blue-600">
                  {aboutData.email}
                </a>
              </div>
              
              {aboutData.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="text-blue-600" size={20} />
                  <a href={`tel:${aboutData.phone}`} className="text-gray-700 hover:text-blue-600">
                    {aboutData.phone}
                  </a>
                </div>
              )}
              
              {aboutData.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="text-blue-600" size={20} />
                  <span className="text-gray-700">{aboutData.location}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {aboutData.socialLinks && (
              <div className="flex space-x-4 pt-4">
                {Object.entries(aboutData.socialLinks).map(([platform, url]) => {
                  if (!url) return null;
                  const IconComponent = socialIcons[platform as keyof typeof socialIcons];
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      <IconComponent size={20} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
