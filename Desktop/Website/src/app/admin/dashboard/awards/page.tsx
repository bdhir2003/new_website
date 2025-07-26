'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Edit, Trash2, Award, Medal } from 'lucide-react';

interface AwardType {
  _id?: string;
  title: string;
  organization: string;
  date: string;
  description?: string;
  category: string;
  level: string;
  certificateUrl?: string;
}

const awardCategories = [
  'Academic Excellence',
  'Research',
  'Leadership',
  'Community Service',
  'Sports',
  'Arts & Culture',
  'Technical Skills',
  'Innovation',
  'Scholarship',
  'Other'
];

const awardLevels = [
  'International',
  'National',
  'State/Provincial',
  'Regional',
  'Local',
  'Institutional'
];

export default function AwardsManager() {
  const [awardsList, setAwardsList] = useState<AwardType[]>([]);
  const [editingAward, setEditingAward] = useState<AwardType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const response = await fetch('/api/portfolio/awards');
      const result = await response.json();
      
      if (result.success) {
        setAwardsList(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching awards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (awardData: AwardType) => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('auth-token');
      const method = awardData._id ? 'PUT' : 'POST';
      const url = awardData._id ? `/api/portfolio/awards/${awardData._id}` : '/api/portfolio/awards';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify(awardData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: `Award ${method === 'POST' ? 'added' : 'updated'} successfully!` });
        fetchAwards();
        setIsModalOpen(false);
        setEditingAward(null);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('auth-token');
          router.push('/admin');
        } else {
          setMessage({ type: 'error', text: result.message || 'Failed to save award' });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this award?')) return;

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/portfolio/awards/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Award deleted successfully!' });
        fetchAwards();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to delete award' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'International': return 'bg-purple-100 text-purple-800';
      case 'National': return 'bg-blue-100 text-blue-800';
      case 'State/Provincial': return 'bg-green-100 text-green-800';
      case 'Regional': return 'bg-yellow-100 text-yellow-800';
      case 'Local': return 'bg-orange-100 text-orange-800';
      case 'Institutional': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const filteredAwards = selectedCategory === 'all' 
    ? awardsList 
    : awardsList.filter(award => award.category === selectedCategory);

  const awardsByCategory = awardCategories.reduce((acc, category) => {
    acc[category] = awardsList.filter(award => award.category === category);
    return acc;
  }, {} as Record<string, AwardType[]>);

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
              <h1 className="text-2xl font-bold text-gray-900">Awards</h1>
            </div>
            <button
              onClick={() => {
                setEditingAward({
                  title: '',
                  organization: '',
                  date: '',
                  description: '',
                  category: awardCategories[0],
                  level: awardLevels[0],
                  certificateUrl: '',
                });
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus size={16} />
              <span>Add Award</span>
            </button>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            All Awards ({awardsList.length})
          </button>
          {awardCategories.map(category => {
            const count = awardsByCategory[category]?.length || 0;
            if (count === 0) return null;
            
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Awards List */}
        <div className="space-y-6">
          {filteredAwards.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <Award className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedCategory === 'all' ? 'No Awards Added' : `No Awards in ${selectedCategory}`}
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedCategory === 'all' 
                  ? 'Start by adding your awards and recognitions'
                  : `Add awards to the ${selectedCategory} category`
                }
              </p>
              <button
                onClick={() => {
                  setEditingAward({
                    title: '',
                    organization: '',
                    date: '',
                    description: '',
                    category: selectedCategory === 'all' ? awardCategories[0] : selectedCategory,
                    level: awardLevels[0],
                    certificateUrl: '',
                  });
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add First Award
              </button>
            </div>
          ) : (
            filteredAwards.map((award) => (
              <div key={award._id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Medal className="text-yellow-500" size={20} />
                      <h3 className="text-xl font-semibold text-gray-900">{award.title}</h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(award.level)}`}>
                        {award.level}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                        {award.category}
                      </span>
                    </div>
                    
                    <p className="text-lg text-gray-700 font-medium mb-1">{award.organization}</p>
                    <p className="text-sm text-gray-500 mb-3">{formatDate(award.date)}</p>
                    
                    {award.description && (
                      <p className="text-gray-700 mb-4">{award.description}</p>
                    )}
                    
                    {award.certificateUrl && (
                      <a
                        href={award.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors text-sm"
                      >
                        <Award size={12} />
                        <span>View Certificate</span>
                      </a>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingAward(award);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => award._id && handleDelete(award._id)}
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
      {isModalOpen && editingAward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {editingAward._id ? 'Edit Award' : 'Add Award'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSave(editingAward);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Award Title
                  </label>
                  <input
                    type="text"
                    value={editingAward.title}
                    onChange={(e) => setEditingAward({ ...editingAward, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Award or recognition name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={editingAward.organization}
                      onChange={(e) => setEditingAward({ ...editingAward, organization: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Awarding organization"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={editingAward.date}
                      onChange={(e) => setEditingAward({ ...editingAward, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Category
                    </label>
                    <select
                      value={editingAward.category}
                      onChange={(e) => setEditingAward({ ...editingAward, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      {awardCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Level *
                    </label>
                    <select
                      value={editingAward.level}
                      onChange={(e) => setEditingAward({ ...editingAward, level: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      {awardLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={editingAward.description || ''}
                    onChange={(e) => setEditingAward({ ...editingAward, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Details about the award and why it was received..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Certificate URL
                  </label>
                  <input
                    type="url"
                    value={editingAward.certificateUrl || ''}
                    onChange={(e) => setEditingAward({ ...editingAward, certificateUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="https://example.com/certificate.pdf"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingAward(null);
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
                    <span>{saving ? 'Saving...' : 'Save Award'}</span>
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
