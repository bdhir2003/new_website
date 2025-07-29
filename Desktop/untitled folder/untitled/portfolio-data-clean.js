// Portfolio data - Add your content through the admin panel
// This file will be automatically updated when you save changes in the admin

window.PORTFOLIO_DATA = {
  "hero": {
    "name": "",
    "title": "",
    "tagline": "",
    "subtitle": "",
    "buttonText": "Learn More About Me",
    "buttonUrl": "#about"
  },
  "personal": {
    "fullName": "",
    "title": "",
    "tagline": "",
    "profileImage": ""
  },
  "about": {
    "description": "",
    "profileImage": ""
  },
  "education": [],
  "skills": [],
  "projects": [],
  "publications": [],
  "podcasts": [],
  "videos": [],
  "awards": [],
  "contact": {
    "email": "",
    "phone": "",
    "linkedin": "",
    "github": "",
    "twitter": "",
    "website": ""
  },
  "settings": {
    "siteTitle": "Student Portfolio",
    "colorScheme": "blue",
    "metaDescription": ""
  }
};

// Auto-load this data when the page loads
if (typeof loadAllPortfolioData === 'function') {
    document.addEventListener('DOMContentLoaded', function() {
        // Use static data if no localStorage data exists
        const existingData = localStorage.getItem('portfolioData');
        if (!existingData || existingData === '{}') {
            localStorage.setItem('portfolioData', JSON.stringify(window.PORTFOLIO_DATA));
            console.log('Loaded empty portfolio data template');
        }
        // Always reload with current data
        setTimeout(loadAllPortfolioData, 100);
    });
}
