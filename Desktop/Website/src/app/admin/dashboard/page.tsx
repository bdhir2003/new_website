'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  GraduationCap, 
  Trophy, 
  Award, 
  FolderOpen, 
  Code, 
  Video, 
  Mic, 
  FileText,
  Settings,
  LogOut
} from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          window.location.href = '/admin';
          return;
        }

        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (result.success && result.data.role === 'admin') {
          setUser(result.data);
        } else {
          window.location.href = '/admin';
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/admin';
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('auth-token');
      window.location.href = '/admin';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    {
      title: 'About',
      description: 'Manage personal information and bio',
      icon: User,
      href: '/admin/dashboard/about',
      color: 'bg-blue-500'
    },
    {
      title: 'Education',
      description: 'Manage educational background',
      icon: GraduationCap,
      href: '/admin/dashboard/education',
      color: 'bg-green-500'
    },
    {
      title: 'Achievements',
      description: 'Manage achievements and accomplishments',
      icon: Trophy,
      href: '/admin/dashboard/achievements',
      color: 'bg-yellow-500'
    },
    {
      title: 'Awards',
      description: 'Manage awards and recognitions',
      icon: Award,
      href: '/admin/dashboard/awards',
      color: 'bg-purple-500'
    },
    {
      title: 'Projects',
      description: 'Manage portfolio projects',
      icon: FolderOpen,
      href: '/admin/dashboard/projects',
      color: 'bg-indigo-500'
    },
    {
      title: 'Skills',
      description: 'Manage technical skills',
      icon: Code,
      href: '/admin/dashboard/skills',
      color: 'bg-red-500'
    },
    {
      title: 'Videos',
      description: 'Manage video content',
      icon: Video,
      href: '/admin/dashboard/videos',
      color: 'bg-pink-500'
    },
    {
      title: 'Podcasts',
      description: 'Manage podcast content',
      icon: Mic,
      href: '/admin/dashboard/podcasts',
      color: 'bg-orange-500'
    },
    {
      title: 'Publications',
      description: 'Manage publications and papers',
      icon: FileText,
      href: '/admin/dashboard/publications',
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage Your Portfolio</h2>
          <p className="text-gray-600">Select a section to manage your portfolio content</p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${item.color} text-white`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              View Portfolio
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
