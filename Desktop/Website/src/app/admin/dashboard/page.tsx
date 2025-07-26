'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  GraduationCap, 
  Trophy, 
  Code, 
  Brain, 
  Mic, 
  Award,
  Play,
  BookOpen,
  Plus,
  Edit,
  Eye,
  LogOut,
  Home
} from 'lucide-react';

interface DashboardStats {
  aboutMe: boolean;
  education: number;
  achievements: number;
  projects: number;
  skills: number;
  podcasts: number;
  videos: number;
  publications: number;
  awards: number;
}

const menuItems = [
  { id: 'about', label: 'About Me', icon: User, color: 'bg-blue-500' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: 'bg-green-500' },
  { id: 'achievements', label: 'Achievements', icon: Trophy, color: 'bg-yellow-500' },
  { id: 'projects', label: 'Projects', icon: Code, color: 'bg-purple-500' },
  { id: 'skills', label: 'Skills', icon: Brain, color: 'bg-indigo-500' },
  { id: 'videos', label: 'Videos', icon: Play, color: 'bg-orange-500' },
  { id: 'podcasts', label: 'Podcasts', icon: Mic, color: 'bg-pink-500' },
  { id: 'publications', label: 'Publications', icon: BookOpen, color: 'bg-teal-500' },
  { id: 'awards', label: 'Awards', icon: Award, color: 'bg-red-500' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    aboutMe: false,
    education: 0,
    achievements: 0,
    projects: 0,
    skills: 0,
    podcasts: 0,
    videos: 0,
    publications: 0,
    awards: 0,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        router.push('/admin');
        return;
      }
      
      // You would verify the token here with an API call
      // For now, we'll assume it's valid
      setUser({ name: 'Admin User', email: 'admin@example.com' });
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin');
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch stats from all sections, including publications
      const [aboutRes, educationRes, achievementsRes, projectsRes, skillsRes, videosRes, podcastsRes, awardsRes, publicationsRes] = await Promise.all([
        fetch('/api/portfolio/about'),
        fetch('/api/portfolio/education'),
        fetch('/api/portfolio/achievements'),
        fetch('/api/portfolio/projects'),
        fetch('/api/portfolio/skills'),
        fetch('/api/portfolio/videos'),
        fetch('/api/portfolio/podcasts'),
        fetch('/api/portfolio/awards'),
        fetch('/api/portfolio/publications'),
      ]);

      const [about, education, achievements, projects, skills, videos, podcasts, awards, publications] = await Promise.all([
        aboutRes.json(),
        educationRes.json(),
        achievementsRes.json(),
        projectsRes.json(),
        skillsRes.json(),
        videosRes.json(),
        podcastsRes.json(),
        awardsRes.json(),
        publicationsRes.json(),
      ]);

      setStats({
        aboutMe: about.success && about.data,
        education: education.success ? education.data.length : 0,
        achievements: achievements.success ? achievements.data.length : 0,
        projects: projects.success ? projects.data.length : 0,
        skills: skills.success ? skills.data.length : 0,
        videos: videos.success ? videos.data.length : 0,
        podcasts: podcasts.success ? podcasts.data.length : 0,
        awards: awards.success ? awards.data.length : 0,
        publications: publications.success ? publications.data.length : 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('auth-token');
      router.push('/admin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSectionClick = (sectionId: string) => {
    router.push(`/admin/dashboard/${sectionId}`);
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
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Portfolio Admin</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                <Eye size={16} />
                <span>View Site</span>
              </a>
              
              <a
                href="/"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                <Home size={16} />
                <span>Home</span>
              </a>
              
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-gray-600 font-medium">{user?.email}</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-700 font-medium">Manage your portfolio content and keep it up to date.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">Total Sections</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(stats).reduce((acc: number, val) => {
                    if (typeof val === 'boolean') return acc + (val ? 1 : 0);
                    return acc + val;
                  }, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.projects}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Code className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">Achievements</p>
                <p className="text-2xl font-bold text-gray-900">{stats.achievements}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Trophy className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">Skills</p>
                <p className="text-2xl font-bold text-gray-900">{stats.skills}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Brain className="text-indigo-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Management Sections */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Content Management</h3>
            <p className="text-gray-600 mt-1">Click on any section to manage its content</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const count = item.id === 'about' 
                  ? (stats.aboutMe ? 1 : 0)
                  : stats[item.id as keyof typeof stats] as number;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionClick(item.id)}
                    className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <IconComponent className="text-white" size={20} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-gray-900">{item.label}</h4>
                        <p className="text-sm text-gray-500">
                          {count} {item.id === 'about' ? (count ? 'configured' : 'not set') : 'items'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {count > 0 && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {count}
                        </span>
                      )}
                      <Edit className="text-gray-400 group-hover:text-blue-600" size={16} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm text-white p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold mb-2">Ready to get started?</h3>
              <p className="text-blue-100">
                {stats.aboutMe 
                  ? "Great! Your About section is set up. Continue adding more content to complete your portfolio."
                  : "Start by setting up your About Me section - it's the foundation of your portfolio."
                }
              </p>
            </div>
            
            <button
              onClick={() => handleSectionClick(stats.aboutMe ? 'projects' : 'about')}
              className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} />
              <span>{stats.aboutMe ? 'Add Projects' : 'Set Up About Me'}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
