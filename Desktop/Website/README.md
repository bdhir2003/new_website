# Student Portfolio Website

A modern, editable student portfolio website built with Next.js, TypeScript, and MongoDB. Features an admin panel for easy content management across all portfolio sections.

## Features

### Portfolio Sections
- **About Me** - Personal information, profile image, and social links
- **Education** - Academic background with institutions, degrees, and timelines
- **Major Achievements in MCH** - Significant accomplishments and milestones
- **Featured Projects** - Showcase of development projects with details and links
- **Skills** - Technical and soft skills with proficiency levels
- **Podcasts** - Audio content and podcast appearances
- **Awards** - Recognition and awards received

### Admin Features
- Secure authentication system
- Admin panel for content management
- CRUD operations for all portfolio sections
- Image upload and management
- Real-time content updates

### Technical Features
- Modern responsive design
- Server-side rendering with Next.js
- MongoDB database integration
- TypeScript for type safety
- Tailwind CSS for styling
- RESTful API architecture

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd student-portfolio
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a `.env.local` file in the root directory:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/student-portfolio
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin Setup

1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Create your admin account
3. Login to access the admin dashboard
4. Start adding your portfolio content

## Project Structure

\`\`\`
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── portfolio/     # Portfolio data endpoints
│   ├── admin/             # Admin panel pages
│   └── page.tsx           # Homepage
├── components/            # React components
├── lib/                   # Utilities and configurations
├── models/                # MongoDB/Mongoose models
└── types/                 # TypeScript type definitions
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Portfolio Data
- `GET/PUT /api/portfolio/about` - About Me information
- `GET/POST /api/portfolio/education` - Education entries
- `GET/POST /api/portfolio/achievements` - Achievement entries
- `GET/POST /api/portfolio/projects` - Project entries
- `GET/POST /api/portfolio/skills` - Skill entries
- `GET/POST /api/portfolio/podcasts` - Podcast entries
- `GET/POST /api/portfolio/awards` - Award entries

## Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Customize components in `src/components/`

### Content Sections
- Add new portfolio sections by creating corresponding:
  - Database models in `src/models/`
  - API routes in `src/app/api/portfolio/`
  - Frontend components in `src/components/`

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The application is compatible with any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- Digital Ocean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support and questions:
- Create an issue on GitHub
- Contact: your.email@example.com

---

Built with ❤️ using Next.js and modern web technologies.
