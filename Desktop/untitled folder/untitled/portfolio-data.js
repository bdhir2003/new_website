// Auto-generated portfolio data - Upload this file to your website
// Generated on: 2025-07-27T00:00:00.000Z

window.PORTFOLIO_DATA = {
  "hero": {
    "name": "Mamello Makhele",
    "title": "Computer Science Student",
    "tagline": "Passionate about AI, Machine Learning, and Software Development"
  },
  "personal": {
    "fullName": "Mamello Makhele"
  },
  "about": {
    "description": "I am a dedicated Computer Science student with a passion for artificial intelligence and machine learning. I enjoy working on innovative projects that solve real-world problems and am always eager to learn new technologies.",
    "profileImage": "https://via.placeholder.com/300x300/667eea/ffffff?text=MM"
  },
  "education": [
    {
      "id": "1",
      "institution": "University of Nebraska at Omaha",
      "degree": "Bachelor of Science in Computer Science",
      "year": "2022-2026",
      "description": "Focusing on Artificial Intelligence and Machine Learning"
    }
  ],
  "skills": {
    "Programming Languages": ["Python", "JavaScript", "Java", "C++"],
    "Web Development": ["HTML", "CSS", "React", "Node.js"],
    "Data Science": ["Machine Learning", "Data Analysis", "Statistics"],
    "Tools & Technologies": ["Git", "VS Code", "MongoDB", "SQL"]
  },
  "projects": [
    {
      "id": "1",
      "title": "AI Fairness in Healthcare",
      "description": "Research project analyzing bias in machine learning models used for healthcare predictions.",
      "technologies": ["Python", "Scikit-learn", "Pandas"],
      "link": "#"
    },
    {
      "id": "2",
      "title": "Student Portfolio Website",
      "description": "Modern, responsive portfolio website with admin panel for content management.",
      "technologies": ["HTML", "CSS", "JavaScript"],
      "link": "#"
    }
  ],
  "contact": {
    "email": "mamello.makhele@example.com",
    "linkedin": "linkedin.com/in/mamellomakhele"
  },
  "publications": [],
  "podcasts": [],
  "videos": [],
  "awards": []
};

// Auto-load this data when the page loads
if (typeof loadAllPortfolioData === 'function') {
    document.addEventListener('DOMContentLoaded', function() {
        // Use static data if no localStorage data exists
        const existingData = localStorage.getItem('portfolioData');
        if (!existingData || existingData === '{}') {
            localStorage.setItem('portfolioData', JSON.stringify(window.PORTFOLIO_DATA));
        }
        // Always reload with current data
        setTimeout(loadAllPortfolioData, 100);
    });
}
