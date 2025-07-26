'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Edit3, Trash2, BookOpen, ExternalLink, Download, LogOut } from 'lucide-react';
import { Publication } from '@/types';

const publicationTypes = [
  'Journal Article',
  'Conference Paper', 
  'Book Chapter',
  'Thesis',
  'Report',
  'Other'
];

export default function PublicationsManager() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState<Partial<Publication>>({
    title: '',
    authors: [],
    journal: '',
    conference: '',
    publisher: '',
    publicationDate: new Date(),
    type: 'Journal Article',
    abstract: '',
    keywords: [],
    doi: '',
    url: '',
    pdfUrl: '',
    citation: '',
    featured: false,
  });
  const router = useRouter();

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

  const handleInputChange = (field: string, value: string | boolean | string[] | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      localStorage.removeItem('auth-token');
      router.push('/admin');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('auth-token');
      router.push('/admin');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication required. Please login again.' });
        setSaving(false);
        return;
      }

      const url = editingPublication 
        ? `/api/portfolio/publications/${editingPublication._id}`
        : '/api/portfolio/publications';
      
      const method = editingPublication ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: editingPublication ? 'Publication updated successfully!' : 'Publication added successfully!' 
        });
        setShowForm(false);
        setEditingPublication(null);
        resetForm();
        fetchPublications();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        if (response.status === 401) {
          setMessage({ 
            type: 'error', 
            text: 'Session expired. Please save your work and login again.' 
          });
        } else if (response.status === 403) {
          setMessage({ 
            type: 'error', 
            text: 'Access denied. Admin permissions required.' 
          });
        } else {
          setMessage({ type: 'error', text: result.message || 'Failed to save publication' });
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      authors: [],
      journal: '',
      conference: '',
      publisher: '',
      publicationDate: new Date(),
      type: 'Journal Article',
      abstract: '',
      keywords: [],
      doi: '',
      url: '',
      pdfUrl: '',
      citation: '',
      featured: false,
    });
  };

  const handleEdit = (publication: Publication) => {
    setEditingPublication(publication);
    setFormData({
      title: publication.title,
      authors: publication.authors,
      journal: publication.journal || '',
      conference: publication.conference || '',
      publisher: publication.publisher || '',
      publicationDate: publication.publicationDate,
      type: publication.type,
      abstract: publication.abstract || '',
      keywords: publication.keywords || [],
      doi: publication.doi || '',
      url: publication.url || '',
      pdfUrl: publication.pdfUrl || '',
      citation: publication.citation || '',
      featured: publication.featured || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (publication: Publication) => {
    if (!confirm(`Are you sure you want to delete "${publication.title}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication required. Please login again.' });
        return;
      }

      const response = await fetch(`/api/portfolio/publications/${publication._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Publication deleted successfully!' });
        fetchPublications();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to delete publication' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  const handleAddNew = () => {
    setEditingPublication(null);
    resetForm();
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPublication(null);
    resetForm();
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
              <h1 className="text-2xl font-bold text-gray-900">Publications Management</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Add New Button */}
        {!showForm && (
          <div className="mb-8">
            <button
              onClick={handleAddNew}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus size={20} />
              <span>Add New Publication</span>
            </button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingPublication ? 'Edit Publication' : 'Add New Publication'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Publication Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-700"
                  placeholder="Enter the publication title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type || 'Journal Article'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                  >
                    {publicationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.publicationDate ? new Date(formData.publicationDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleInputChange('publicationDate', new Date(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Authors (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={Array.isArray(formData.authors) ? formData.authors.join(', ') : ''}
                  onChange={(e) => handleInputChange('authors', e.target.value.split(',').map(author => author.trim()))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-700"
                  placeholder="e.g., John Doe, Jane Smith, Mary Johnson"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Journal
                  </label>
                  <input
                    type="text"
                    value={formData.journal || ''}
                    onChange={(e) => handleInputChange('journal', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-700"
                    placeholder="Journal name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Conference
                  </label>
                  <input
                    type="text"
                    value={formData.conference || ''}
                    onChange={(e) => handleInputChange('conference', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-700"
                    placeholder="Conference name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Publisher
                  </label>
                  <input
                    type="text"
                    value={formData.publisher || ''}
                    onChange={(e) => handleInputChange('publisher', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-700"
                    placeholder="Publisher name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Abstract
                </label>
                <textarea
                  rows={4}
                  value={formData.abstract || ''}
                  onChange={(e) => handleInputChange('abstract', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-700"
                  placeholder="Enter the publication abstract..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(formData.keywords) ? formData.keywords.join(', ') : ''}
                  onChange={(e) => handleInputChange('keywords', e.target.value.split(',').map(keyword => keyword.trim()))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-700"
                  placeholder="e.g., maternal health, public health, epidemiology"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    DOI
                  </label>
                  <input
                    type="text"
                    value={formData.doi || ''}
                    onChange={(e) => handleInputChange('doi', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-700"
                    placeholder="10.1000/xyz123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Publication URL
                  </label>
                  <input
                    type="url"
                    value={formData.url || ''}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-700"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    PDF URL
                  </label>
                  <input
                    type="url"
                    value={formData.pdfUrl || ''}
                    onChange={(e) => handleInputChange('pdfUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-700"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Citation
                </label>
                <textarea
                  rows={3}
                  value={formData.citation || ''}
                  onChange={(e) => handleInputChange('citation', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-700"
                  placeholder="APA or any other citation format..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured || false}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm font-bold text-gray-900">
                  Mark as featured publication
                </label>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  <Save size={20} />
                  <span>{saving ? 'Saving...' : 'Save Publication'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Publications List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Publications ({publications.length})
            </h2>
          </div>
          
          {publications.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No publications yet</h3>
              <p className="text-gray-700 font-medium mb-6">Add your first publication to get started.</p>
              <button
                onClick={handleAddNew}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mx-auto"
              >
                <Plus size={20} />
                <span>Add New Publication</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {publications.map((publication) => (
                <div key={publication._id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {publication.title}
                        {publication.featured && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Featured
                          </span>
                        )}
                      </h3>
                      
                      <p className="text-gray-800 font-medium mb-2">
                        {publication.authors.join(', ')}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
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

                      <div className="flex items-center space-x-4 text-sm font-medium text-gray-700 mb-3">
                        <span>
                          {new Date(publication.publicationDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                          })}
                        </span>
                        {publication.doi && (
                          <>
                            <span>•</span>
                            <span>DOI: {publication.doi}</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center space-x-4">
                        {publication.url && (
                          <a
                            href={publication.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-semibold"
                          >
                            <ExternalLink size={14} />
                            <span>View</span>
                          </a>
                        )}
                        
                        {publication.pdfUrl && (
                          <a
                            href={publication.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-green-600 hover:text-green-700 font-semibold"
                          >
                            <Download size={14} />
                            <span>PDF</span>
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(publication)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(publication)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
