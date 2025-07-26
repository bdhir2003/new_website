'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Edit, Trash2, Code, Star } from 'lucide-react';

interface Skill {
  _id?: string;
  name: string;
  category: string;
  level: number;
  experience: string;
  description?: string;
}

const skillCategories = [
  'Programming Languages',
  'Frontend Development',
  'Backend Development',
  'Database',
  'Cloud & DevOps',
  'Tools & Technologies',
  'Soft Skills',
  'Other'
];

export default function SkillsManager() {
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/portfolio/skills');
      const result = await response.json();
      
      if (result.success) {
        setSkillsList(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (skillData: Skill) => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('auth-token');
      const method = skillData._id ? 'PUT' : 'POST';
      const url = skillData._id ? `/api/portfolio/skills/${skillData._id}` : '/api/portfolio/skills';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify(skillData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: `Skill ${method === 'POST' ? 'added' : 'updated'} successfully!` });
        fetchSkills();
        setIsModalOpen(false);
        setEditingSkill(null);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('auth-token');
          router.push('/admin');
        } else {
          setMessage({ type: 'error', text: result.message || 'Failed to save skill' });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/portfolio/skills/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Skill deleted successfully!' });
        fetchSkills();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to delete skill' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  const getSkillLevelText = (level: number) => {
    if (level <= 2) return 'Beginner';
    if (level <= 4) return 'Intermediate';
    if (level <= 7) return 'Advanced';
    return 'Expert';
  };

  const getSkillLevelColor = (level: number) => {
    if (level <= 2) return 'text-red-600 bg-red-100';
    if (level <= 4) return 'text-yellow-600 bg-yellow-100';
    if (level <= 7) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  const filteredSkills = selectedCategory === 'all' 
    ? skillsList 
    : skillsList.filter(skill => skill.category === selectedCategory);

  const skillsByCategory = skillCategories.reduce((acc, category) => {
    acc[category] = skillsList.filter(skill => skill.category === category);
    return acc;
  }, {} as Record<string, Skill[]>);

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
              <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
            </div>
            <button
              onClick={() => {
                setEditingSkill({
                  name: '',
                  category: skillCategories[0],
                  level: 5,
                  experience: '',
                  description: '',
                });
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus size={16} />
              <span>Add Skill</span>
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
            All Skills ({skillsList.length})
          </button>
          {skillCategories.map(category => {
            const count = skillsByCategory[category]?.length || 0;
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

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-sm border p-8 text-center">
              <Code className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedCategory === 'all' ? 'No Skills Added' : `No Skills in ${selectedCategory}`}
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedCategory === 'all' 
                  ? 'Start by adding your technical and soft skills'
                  : `Add skills to the ${selectedCategory} category`
                }
              </p>
              <button
                onClick={() => {
                  setEditingSkill({
                    name: '',
                    category: selectedCategory === 'all' ? skillCategories[0] : selectedCategory,
                    level: 5,
                    experience: '',
                    description: '',
                  });
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add First Skill
              </button>
            </div>
          ) : (
            filteredSkills.map((skill) => (
              <div key={skill._id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{skill.name}</h3>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {skill.category}
                    </span>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => {
                        setEditingSkill(skill);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => skill._id && handleDelete(skill._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Skill Level */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Proficiency</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getSkillLevelColor(skill.level)}`}>
                      {getSkillLevelText(skill.level)}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(10)].map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-3 rounded-sm ${
                          index < skill.level ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {skill.experience && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Experience: </span>
                    <span className="text-sm text-gray-600">{skill.experience}</span>
                  </div>
                )}

                {skill.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{skill.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {editingSkill._id ? 'Edit Skill' : 'Add Skill'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSave(editingSkill);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    value={editingSkill.name}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="e.g., JavaScript, React, Communication"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Category
                  </label>
                  <select
                    value={editingSkill.category}
                    onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    {skillCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Proficiency Level: {editingSkill.level}/10 ({getSkillLevelText(editingSkill.level)})
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={editingSkill.level}
                      onChange={(e) => setEditingSkill({ ...editingSkill, level: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex space-x-1">
                      {[...Array(10)].map((_, index) => (
                        <div
                          key={index}
                          className={`h-3 w-2 rounded-sm ${
                            index < editingSkill.level ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Experience Duration
                  </label>
                  <input
                    type="text"
                    value={editingSkill.experience}
                    onChange={(e) => setEditingSkill({ ...editingSkill, experience: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="e.g., 2 years, 6 months, Since 2020"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingSkill.description || ''}
                    onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Brief description of your experience with this skill..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingSkill(null);
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
                    <span>{saving ? 'Saving...' : 'Save Skill'}</span>
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
