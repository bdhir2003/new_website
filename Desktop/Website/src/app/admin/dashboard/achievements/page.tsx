'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Edit, Trash2, Trophy } from 'lucide-react';

interface Achievement {
  _id?: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  category: string;
}

export default function AchievementsManager() {
  const [achievementsList, setAchievementsList] = useState<Achievement[]>([]);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/portfolio/achievements');
      const result = await response.json();
      
      if (result.success) {
        setAchievementsList(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (achievementData: Achievement) => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('auth-token');
      const method = achievementData._id ? 'PUT' : 'POST';
      const url = achievementData._id ? `/api/portfolio/achievements/${achievementData._id}` : '/api/portfolio/achievements';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify(achievementData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: `Achievement ${method === 'POST' ? 'added' : 'updated'} successfully!` });
        fetchAchievements();
        setIsModalOpen(false);
        setEditingAchievement(null);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('auth-token');
          router.push('/admin');
        } else {
          setMessage({ type: 'error', text: result.message || 'Failed to save achievement' });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/portfolio/achievements/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Achievement deleted successfully!' });
        fetchAchievements();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to delete achievement' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
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
              <h1 className="text-2xl font-bold text-gray-900">Major Achievements in MCH</h1>
            </div>
            <button
              onClick={() => {
                setEditingAchievement({
                  title: '',
                  organization: '',
                  date: '',
                  description: '',
                  category: '',
                });
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus size={16} />
              <span>Add Achievement</span>
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

        {/* Achievements List */}
        <div className="space-y-6">
          {achievementsList.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <Trophy className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Achievements Added</h3>
              <p className="text-gray-600 mb-4">Start by adding your major achievements in MCH</p>
              <button
                onClick={() => {
                  setEditingAchievement({
                    title: '',
                    organization: '',
                    date: '',
                    description: '',
                    category: '',
                  });
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add First Achievement
              </button>
            </div>
          ) : (
            achievementsList.map((achievement) => (
              <div key={achievement._id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{achievement.title}</h3>
                      {achievement.category && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {achievement.category}
                        </span>
                      )}
                    </div>
                    <p className="text-lg text-gray-700 font-medium">{achievement.organization}</p>
                    <p className="text-sm text-gray-500 mt-1">{achievement.date}</p>
                    {achievement.description && (
                      <p className="text-gray-700 mt-3">{achievement.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingAchievement(achievement);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => achievement._id && handleDelete(achievement._id)}
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
      {isModalOpen && editingAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {editingAchievement._id ? 'Edit Achievement' : 'Add Achievement'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSave(editingAchievement);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Achievement Title
                  </label>
                  <input
                    type="text"
                    value={editingAchievement.title}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Award or achievement name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={editingAchievement.organization}
                      onChange={(e) => setEditingAchievement({ ...editingAchievement, organization: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Organization or institution"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Date
                    </label>
                    <input
                      type="text"
                      value={editingAchievement.date}
                      onChange={(e) => setEditingAchievement({ ...editingAchievement, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Month Year"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingAchievement.category}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="e.g., Academic, Research, Competition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={editingAchievement.description}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Details about the achievement..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingAchievement(null);
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
                    <span>{saving ? 'Saving...' : 'Save Achievement'}</span>
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
