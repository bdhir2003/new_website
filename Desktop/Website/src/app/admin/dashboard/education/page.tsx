'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Edit, Trash2, GraduationCap } from 'lucide-react';

interface Education {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description: string;
}

export default function EducationManager() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await fetch('/api/portfolio/education');
      const result = await response.json();
      
      if (result.success) {
        setEducationList(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching education:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (educationData: Education) => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('auth-token');
      const method = educationData._id ? 'PUT' : 'POST';
      const url = educationData._id ? `/api/portfolio/education/${educationData._id}` : '/api/portfolio/education';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify(educationData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: `Education ${method === 'POST' ? 'added' : 'updated'} successfully!` });
        fetchEducation();
        setIsModalOpen(false);
        setEditingEducation(null);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('auth-token');
          router.push('/admin');
        } else {
          setMessage({ type: 'error', text: result.message || 'Failed to save education' });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/portfolio/education/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Education deleted successfully!' });
        fetchEducation();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to delete education' });
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
              <h1 className="text-2xl font-bold text-gray-900">Education</h1>
            </div>
            <button
              onClick={() => {
                setEditingEducation({
                  institution: '',
                  degree: '',
                  field: '',
                  startDate: '',
                  endDate: '',
                  gpa: '',
                  description: '',
                });
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus size={16} />
              <span>Add Education</span>
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

        {/* Education List */}
        <div className="space-y-6">
          {educationList.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <GraduationCap className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Education Added</h3>
              <p className="text-gray-600 mb-4">Start by adding your educational background</p>
              <button
                onClick={() => {
                  setEditingEducation({
                    institution: '',
                    degree: '',
                    field: '',
                    startDate: '',
                    endDate: '',
                    gpa: '',
                    description: '',
                  });
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add First Education
              </button>
            </div>
          ) : (
            educationList.map((education) => (
              <div key={education._id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{education.degree}</h3>
                    <p className="text-lg text-gray-700 font-medium">{education.institution}</p>
                    <p className="text-gray-600">{education.field}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {education.startDate} - {education.endDate}
                      {education.gpa && ` • GPA: ${education.gpa}`}
                    </p>
                    {education.description && (
                      <p className="text-gray-700 mt-3">{education.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingEducation(education);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => education._id && handleDelete(education._id)}
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
      {isModalOpen && editingEducation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {editingEducation._id ? 'Edit Education' : 'Add Education'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSave(editingEducation);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={editingEducation.institution}
                      onChange={(e) => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="University/School name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={editingEducation.degree}
                      onChange={(e) => setEditingEducation({ ...editingEducation, degree: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Bachelor's, Master's, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={editingEducation.field}
                    onChange={(e) => setEditingEducation({ ...editingEducation, field: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Computer Science, Engineering, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={editingEducation.startDate}
                      onChange={(e) => setEditingEducation({ ...editingEducation, startDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Sept 2020"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      End Date
                    </label>
                    <input
                      type="text"
                      value={editingEducation.endDate}
                      onChange={(e) => setEditingEducation({ ...editingEducation, endDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="May 2024 or Present"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      GPA (Optional)
                    </label>
                    <input
                      type="text"
                      value={editingEducation.gpa || ''}
                      onChange={(e) => setEditingEducation({ ...editingEducation, gpa: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="3.8/4.0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={editingEducation.description}
                    onChange={(e) => setEditingEducation({ ...editingEducation, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Relevant coursework, honors, activities, etc."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingEducation(null);
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
                    <span>{saving ? 'Saving...' : 'Save Education'}</span>
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
