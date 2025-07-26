'use client';

import { useState, useEffect } from 'react';
import { Code, Wrench, Users, Star } from 'lucide-react';

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: string;
  icon?: string;
}

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Technical', 'Programming', 'Tools', 'Soft Skills'];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/portfolio/skills');
      const result = await response.json();
      
      if (result.success) {
        setSkills(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technical':
      case 'Programming':
        return <Code size={20} />;
      case 'Tools':
        return <Wrench size={20} />;
      case 'Soft Skills':
        return <Users size={20} />;
      default:
        return <Star size={20} />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'bg-green-500';
      case 'Advanced':
        return 'bg-blue-500';
      case 'Intermediate':
        return 'bg-yellow-500';
      case 'Beginner':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getLevelWidth = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'w-full';
      case 'Advanced':
        return 'w-4/5';
      case 'Intermediate':
        return 'w-3/5';
      case 'Beginner':
        return 'w-2/5';
      default:
        return 'w-1/4';
    }
  };

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Skills</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="animate-pulse">Loading skills...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Skills</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4">
            My technical expertise and professional capabilities
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredSkills.length === 0 ? (
          <div className="text-center text-gray-600">
            <Star size={48} className="mx-auto text-gray-400 mb-4" />
            <p>No skills added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredSkills.map((skill) => (
              <div
                key={skill._id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-3 text-blue-600">
                    {getCategoryIcon(skill.category)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3>
                    <p className="text-sm text-gray-600">{skill.category}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{skill.level}</span>
                </div>
                
                {/* Skill Level Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getLevelColor(skill.level)} ${getLevelWidth(skill.level)}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
