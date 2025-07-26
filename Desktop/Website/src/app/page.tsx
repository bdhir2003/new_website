'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import Navigation from '@/components/Navigation';
import AboutSection from '@/components/AboutSection';
import EducationSection from '@/components/EducationSection';
import AchievementsSection from '@/components/AchievementsSection';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import VideoShowcase from '@/components/VideoShowcase';
import PodcastsSection from '@/components/PodcastsSection';
import PublicationsSection from '@/components/PublicationsSection';
import AwardsSection from '@/components/AwardsSection';

export default function HomePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in as admin
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (token) {
          // Verify token and check role
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const result = await response.json();
          if (result.success && result.data.role === 'admin') {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    // Fetch about data for hero section
    const fetchAboutData = async () => {
      try {
        // Add timestamp to prevent caching
        const response = await fetch(`/api/portfolio/about?t=${Date.now()}`);
        const result = await response.json();
        if (result.success) {
          setAboutData(result.data);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    checkAuth();
    fetchAboutData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('auth-token');
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation isAdmin={isAdmin} onLogout={handleLogout} />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              {aboutData?.heroTitle || 'Hi, I\'m Your Name'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {aboutData?.heroSubtitle || 'A passionate student showcasing my journey through education, achievements, and projects'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="#about"
                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Learn About Me
              </a>
              <a
                href="#projects"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200 font-medium"
              >
                View My Work
              </a>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-6 mb-12">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
              >
                <Github size={24} className="text-gray-700" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
              >
                <Linkedin size={24} className="text-blue-600" />
              </a>
              <a
                href="mailto:your.email@example.com"
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
              >
                <Mail size={24} className="text-red-500" />
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="animate-bounce">
            <ChevronDown size={32} className="text-gray-400 mx-auto" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Education Section */}
      <EducationSection />

      {/* Achievements Section */}
      <AchievementsSection />

      {/* Projects Section */}
      <ProjectsSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* Video Showcase Section */}
      <VideoShowcase />

      {/* Podcasts Section */}
      <PodcastsSection />

      {/* Publications Section */}
      <PublicationsSection />

      {/* Awards Section */}
      <AwardsSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2025 Mamello Makhele. All rights reserved.</p>
          {isAdmin && (
            <p className="text-sm text-blue-400 mt-2">
              Admin panel available at{' '}
              <a href="/admin" className="underline hover:text-blue-300">
                /admin
              </a>
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
